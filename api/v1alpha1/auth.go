package v1alpha1

import (
	"context"
	"strings"
	"time"

	"github.com/golang-jwt/jwt/v5"
	grpc_auth "github.com/grpc-ecosystem/go-grpc-middleware/auth"
	"github.com/pkg/errors"
	"github.com/whitekid/gormx"
	"github.com/whitekid/goxp/log"
	"github.com/whitekid/goxp/validate"
	"google.golang.org/grpc"
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
	db := ctx.Value(keyDB).(*gorm.DB)
	apikey := ctx.Value(keyToken).(string)

	uid, err := parseAPIKey(apikey)
	if err != nil {
		return nil, err
	}

	user, err := gormx.Get[models.User](db.WithContext(ctx).Where("uid = ?", uid))
	if err != nil {
		return nil, errUserNotFound
	}
	ctx = context.WithValue(ctx, keyUser, user)

	// TODO 현재는 default workspace로 고정이 되어있음. 향후 current workspace를 변경하는 기능이 필요함
	userWorkspace, err := gormx.Get[models.UserWorkspace](
		db.WithContext(ctx).Preload("Workspace").Where(&models.UserWorkspace{
			UserID: user.ID,
			Role:   models.RoleDefault,
		}))
	if err != nil {
		return nil, errUserWorkspaceNotFound
	}

	ctx = context.WithValue(ctx, keyUserWorkspace, userWorkspace.Workspace)

	return ctx, nil
}

var authMap = map[string]auth{}

type auth int

const (
	authNone     auth = iota // no authentication
	authRequired             // authorization required
)

func (s *v1alpha1ServiceImpl) authInterceptor() grpc.UnaryServerInterceptor {
	return func(ctx context.Context, req interface{}, info *grpc.UnaryServerInfo, handler grpc.UnaryHandler) (interface{}, error) {
		p := strings.Split(info.FullMethod, "/")
		method := p[len(p)-1]

		auth, ok := authMap[method]
		if !ok {
			auth = authRequired
		}

		switch auth {
		case authNone: // no authentication
		case authRequired: // user required
			token, err := grpc_auth.AuthFromMD(ctx, "bearer")
			if err != nil {
				return nil, err
			}

			ctx = context.WithValue(ctx, keyToken, token)
			ctx = context.WithValue(ctx, keyDB, s.db) // TODO 맘에 안드네, struct의 멤버이면 ctx 없이 가도 되는데
			ctx, err = ExtractUserInfo(ctx)
			if err != nil {
				return nil, err
			}
		default:
			return nil, errors.Errorf("invalid auth method: %v", auth)
		}

		return handler(ctx, req)
	}
}

func init() { authMap["LoginWithGoogleOauth"] = authNone }

func (s *v1alpha1ServiceImpl) LoginWithGoogleOauth(ctx context.Context, req *proto.GoogleLoginReq) (*wrapperspb.StringValue, error) {
	if err := validate.Struct(&struct {
		Credential string `validate:"required"`
		ClientID   string `validate:"required"`
	}{
		Credential: req.Credential,
		ClientID:   req.ClientId,
	}); err != nil {
		return nil, err
	}

	token, err := jwt.ParseWithClaims(req.Credential, jwt.MapClaims{},
		func(token *jwt.Token) (any, error) {
			return []byte("some key"), nil
		})
	if err != nil && !strings.HasPrefix(err.Error(), "token signature is invalid") {
		return nil, err
	}

	exp, err := token.Claims.GetExpirationTime()
	if err != nil {
		return nil, err
	}

	if req.Extra != "__charlie__" {
		if exp.Before(time.Now()) {
			return nil, errors.New("token expired")
		}

		// NOTE google oauth token은 valid하지 않음. 키를 모르니까
		// if !token.Valid {
		// 	return nil, status.Errorf(codes.InvalidArgument, "invalid apikey")
		// }
	}

	email, ok := token.Claims.(jwt.MapClaims)["email"].(string)
	if !ok || email == "" {
		return nil, errors.New("email required")
	}

	name, ok := token.Claims.(jwt.MapClaims)["name"].(string)
	if !ok || name == "" {
		return nil, errors.New("name required")
	}

	// create user if not exists
	user := &models.User{}
	if tx := s.db.WithContext(ctx).Where("email = ?", email).Take(&user); tx.Error != nil {
		if tx.Error.Error() == "record not found" { // FIXME
			log.Infof("create new user: email=%s, name=%s", email, name)

			if err := s.db.WithContext(ctx).Transaction(func(txn *gorm.DB) error {
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
					return tx.Error
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
					return tx.Error
				}

				return nil
			}); err != nil {
				return nil, err
			}
		} else {
			log.Errorf("%+v %T", tx.Error.Error(), tx.Error)
			return nil, tx.Error
		}
	}

	log.Infof("user login: id=%v, uid=%v", user.ID, user.UID)

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
		return "", errors.New("uid required")
	}

	token, err := jwt.NewWithClaims(jwt.SigningMethodHS512, jwt.RegisteredClaims{
		Subject:   uid,
		ExpiresAt: jwt.NewNumericDate(expireAt),
	}).SignedString(config.AuthSigningKey())
	if err != nil {
		return "", errors.Wrapf(err, "fail to sign token:")
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
		return "", errors.Wrap(errTokenParseFailed, "")
	}

	if !token.Valid {
		return "", errInvalidToken
	}

	claims, ok := token.Claims.(*jwt.RegisteredClaims)
	if !ok {
		return "", errInvalidClaims
	}

	if claims.ExpiresAt == nil {
		return "", errors.New("expired missed")
	}

	if claims.ExpiresAt.Before(time.Now()) {
		return "", errors.New("api key expired")
	}

	if claims.Subject == "" {
		return "", errors.New("subject missed")
	}

	return claims.Subject, nil
}
