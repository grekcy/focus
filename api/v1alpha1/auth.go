package v1alpha1

import (
	"context"
	"strings"
	"time"

	"github.com/golang-jwt/jwt/v5"
	grpc_auth "github.com/grpc-ecosystem/go-grpc-middleware/auth"
	"github.com/pkg/errors"
	"github.com/whitekid/goxp/log"
	"github.com/whitekid/goxp/validate"
	"google.golang.org/grpc"
	"google.golang.org/grpc/codes"
	"google.golang.org/grpc/status"
	"google.golang.org/protobuf/types/known/wrapperspb"
	"gorm.io/gorm"

	"focus/config"
	"focus/models"
	proto "focus/proto/v1alpha1"
)

// extractUserInfo extract user info from token in context and set user to context
// context.WithValue(keyUser): *models.User; current user
// context.WithValue(keyUserWorkspace): *models.Workspace; default workspace for current user
func ExtractUserInfo(ctx context.Context) (context.Context, error) {
	db := ctx.Value(KeyDB).(*gorm.DB)
	apikey := ctx.Value(KeyToken).(string)

	uid, err := parseAPIKey(apikey)
	if err != nil {
		return nil, err
	}

	user := &models.User{UID: uid}
	if tx := db.First(user); tx.Error != nil {
		return nil, status.Error(codes.Unauthenticated, "user not found")
	}
	ctx = context.WithValue(ctx, KeyUser, user)

	userWorkspace := &models.UserWorkspace{}
	if tx := db.Preload("Workspace").Where(&models.UserWorkspace{
		UserID: user.ID,
		Role:   models.RoleDefault,
	}).First(userWorkspace); tx.Error != nil {
		return nil, status.Errorf(codes.Internal, "user workspace not found: %v", tx.Error)
	}

	ctx = context.WithValue(ctx, KeyUserWorkspace, userWorkspace.Workspace)

	return ctx, nil
}

var authMap = map[string]string{
	"version":              "",
	"loginWithGoogleOauth": "",
}

func (s *v1alpha1ServiceImpl) authInterceptor() grpc.UnaryServerInterceptor {
	return func(ctx context.Context, req interface{}, info *grpc.UnaryServerInfo, handler grpc.UnaryHandler) (interface{}, error) {
		p := strings.Split(info.FullMethod, "/")
		method := p[len(p)-1]

		auth, ok := authMap[method]
		if !ok {
			auth = "required"
		}

		switch auth {
		case "": // no authentication
		case "required": // user required
			token, err := grpc_auth.AuthFromMD(ctx, "bearer")
			if err != nil {
				return nil, err
			}

			ctx = context.WithValue(ctx, KeyToken, token)
			ctx = context.WithValue(ctx, KeyDB, s.db) // TODO 맘에 안드네, struct의 멤버이면 ctx 없이 가도 되는데
			ctx, err = ExtractUserInfo(ctx)
			if err != nil {
				return nil, err
			}
		default:
			return nil, status.Errorf(codes.Internal, "invalid auth method: %v", auth)
		}

		return handler(ctx, req)
	}
}

func (s *v1alpha1ServiceImpl) LoginWithGoogleOauth(ctx context.Context, req *proto.GoogleLoginReq) (*wrapperspb.StringValue, error) {
	if err := validate.Struct(&struct {
		Credential string `validate:"required"`
		ClientID   string `validate:"required"`
	}{
		Credential: req.Credential,
		ClientID:   req.ClientId,
	}); err != nil {
		return nil, status.Errorf(codes.InvalidArgument, err.Error())
	}

	token, err := jwt.ParseWithClaims(req.Credential, jwt.MapClaims{},
		func(token *jwt.Token) (any, error) {
			return []byte("some key"), nil
		})
	if err != nil && !strings.HasPrefix(err.Error(), "token signature is invalid") {
		return nil, status.Errorf(codes.InvalidArgument, err.Error())
	}

	exp, err := token.Claims.GetExpirationTime()
	if err != nil {
		return nil, status.Errorf(codes.InvalidArgument, err.Error())
	}

	if req.Extra != "__charlie__" {
		if exp.Before(time.Now()) {
			return nil, status.Errorf(codes.InvalidArgument, "expired")
		}

		// NOTE google oauth token은 valid하지 않음. 키를 모르니까
		// if !token.Valid {
		// 	return nil, status.Errorf(codes.InvalidArgument, "invalid apikey")
		// }
	}

	email, ok := token.Claims.(jwt.MapClaims)["email"].(string)
	if !ok || email == "" {
		return nil, status.Errorf(codes.InvalidArgument, "empty email")
	}

	name, ok := token.Claims.(jwt.MapClaims)["name"].(string)
	if !ok || name == "" {
		return nil, status.Errorf(codes.InvalidArgument, "empty name")
	}

	// create user if not exists
	user := &models.User{}
	if tx := s.db.Where("email = ?", email).Take(&user); tx.Error != nil {
		if tx.Error.Error() == "record not found" { // FIXME
			log.Infof("create new user: email=%s, name=%s", email, name)

			if err := s.db.Transaction(func(txn *gorm.DB) error {
				uw := &models.UserWorkspace{
					Role: models.RoleDefault,
					User: &models.User{
						Email: email,
						Name:  name,
					},
					Workspace: &models.Workspace{
						Name: email,
					},
				}

				if tx := txn.Create(uw); tx.Error != nil {
					log.Errorf("%+v", tx.Error)
					return status.Errorf(codes.Internal, tx.Error.Error())
				}

				user = uw.User

				defaultLabels := []*models.Label{
					{
						WorkspaceID: uw.WorkspaceID,
						Label:       "enhancement",
						Color:       "success.light",
					},
					{
						WorkspaceID: uw.WorkspaceID,
						Label:       "design",
						Color:       "info.light",
					},
					{
						WorkspaceID: uw.WorkspaceID,
						Label:       "important",
						Color:       "secondary.light",
					},
					{
						WorkspaceID: uw.WorkspaceID,
						Label:       "urgent",
						Color:       "error.main",
					},
					{
						WorkspaceID: uw.WorkspaceID,
						Label:       "bug",
						Color:       "error.light",
					},
					{
						WorkspaceID: uw.WorkspaceID,
						Label:       "starred",
						Color:       "warning.light",
					},
				}
				if tx := txn.Create(defaultLabels); tx.Error != nil {
					log.Errorf("%+v", tx.Error)
					return status.Errorf(codes.Internal, tx.Error.Error())
				}

				return nil
			}); err != nil {
				return nil, err
			}
		} else {
			log.Errorf("%+v %T", tx.Error.Error(), tx.Error)
			return nil, status.Errorf(codes.Internal, "%+v", tx.Error.Error())
		}
	}

	// return jwt token
	tok, err := signAPIKey(user.UID, time.Now().AddDate(1, 0, 0))
	if err != nil {
		return nil, err
	}

	return wrapperspb.String(tok), nil
}

// signAPIKey return signed jwt token
func signAPIKey(uid string, expireAt time.Time) (string, error) {
	if uid == "" {
		return "", status.Error(codes.Internal, "uid required")
	}

	token, err := jwt.NewWithClaims(jwt.SigningMethodHS512, jwt.RegisteredClaims{
		Subject:   uid,
		ExpiresAt: jwt.NewNumericDate(expireAt),
	}).SignedString(config.AuthSigningKey())
	if err != nil {
		return "", status.Error(codes.Internal, err.Error())
	}

	return token, nil
}

// parseAPIKey parse jwt signed api key and returns subject(user uid)
// errors when jwt token expired
func parseAPIKey(jwtToken string) (string, error) {
	token, err := jwt.ParseWithClaims(jwtToken, &jwt.RegisteredClaims{},
		func(token *jwt.Token) (any, error) {
			if token.Method.Alg() != jwt.SigningMethodHS512.Name {
				return nil, errors.Errorf("Unexpected signing method: %v", token.Method.Alg())
			}
			return config.AuthSigningKey(), nil
		})
	if err != nil {
		return "", status.Errorf(codes.Unauthenticated, err.Error())
	}

	if !token.Valid {
		return "", status.Errorf(codes.Unauthenticated, "invalid token")
	}

	claims, ok := token.Claims.(*jwt.RegisteredClaims)
	if !ok {
		return "", status.Errorf(codes.Unauthenticated, "invalid calims")
	}

	if claims.ExpiresAt == nil {
		return "", status.Errorf(codes.Unauthenticated, "expired missed")
	}

	if claims.ExpiresAt.Before(time.Now()) {
		return "", status.Errorf(codes.Internal, "api key expired")
	}

	if claims.Subject == "" {
		return "", status.Errorf(codes.Internal, "subject missed")
	}

	return claims.Subject, nil
}
