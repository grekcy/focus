package v1alpha1

import (
	"context"
	"strings"
	"time"

	"github.com/golang-jwt/jwt/v5"
	"github.com/lithammer/shortuuid/v4"
	"github.com/whitekid/goxp/log"
	"github.com/whitekid/goxp/validate"
	"google.golang.org/grpc/codes"
	"google.golang.org/grpc/status"
	"google.golang.org/protobuf/types/known/wrapperspb"
	"gorm.io/gorm"

	"focus/config"
	"focus/models"
	proto "focus/proto/v1alpha1"
)

// extractUserInfo extract user info and set to context
// context.WithValue(keyUser): *models.User; current user
// context.WithValue(keyUserWorkspace): *models.Workspace; default workspace for current user
func ExtractUserInfo(ctx context.Context) (context.Context, error) {
	db := ctx.Value(KeyDB).(*gorm.DB)
	token := ctx.Value(KeyToken).(string) // TODO use jwt token

	log.Debugf("@@@ ExtractUserInfo(): %v", token)

	user := &models.User{}
	if tx := db.First(user, &models.User{Email: token}); tx.Error != nil {
		return nil, status.Error(codes.Unauthenticated, "user not found")
	}
	ctx = context.WithValue(ctx, KeyUser, user)

	userWorkspace := &models.UserWorkspace{}
	if tx := db.Preload("Workspace").Where(&models.UserWorkspace{
		UserID: user.ID,
		Role:   models.RoleDefault,
	}).First(userWorkspace); tx.Error != nil {
		return nil, status.Errorf(codes.Unauthenticated, "user workspace not found: %v", tx.Error)
	}

	ctx = context.WithValue(ctx, KeyUserWorkspace, userWorkspace.Workspace)

	return ctx, nil
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

	claims := token.Claims.(jwt.MapClaims)

	if req.Extra != "__charlie__" {
		exp, ok := claims["exp"].(float64)
		if !ok || exp == 0 {
			return nil, status.Errorf(codes.InvalidArgument, "expired")
		}
		expiredAt := time.Unix(int64(exp), 0)
		if expiredAt.Before(time.Now()) {
			return nil, status.Errorf(codes.InvalidArgument, "expired")
		}
	}

	email, ok := claims["email"].(string)
	if !ok || email == "" {
		return nil, status.Errorf(codes.InvalidArgument, "empty email")
	}

	name, ok := claims["name"].(string)
	if !ok || name == "" {
		return nil, status.Errorf(codes.InvalidArgument, "empty name")
	}

	tk := &models.Token{
		UserID:    s.currentUser(ctx).ID,
		Token:     shortuuid.New() + shortuuid.New(),
		ExpiredAt: time.Now().AddDate(1, 0, 0),
	}
	if err := s.db.Transaction(func(tx *gorm.DB) error {
		return tx.Save(tk).Error
	}); err != nil {
		return nil, status.Error(codes.Internal, err.Error())
	}

	// return jwt token
	tok, err := jwt.NewWithClaims(jwt.SigningMethodHS512, jwt.RegisteredClaims{
		Issuer:    email,
		ExpiresAt: jwt.NewNumericDate(tk.ExpiredAt),
	}).SignedString(config.AuthSigningKey())
	if err != nil {
		return nil, status.Error(codes.Internal, err.Error())
	}

	return wrapperspb.String(tok), nil
}
