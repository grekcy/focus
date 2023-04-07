package v1alpha1

import (
	"context"

	"google.golang.org/grpc/codes"
	"google.golang.org/grpc/status"
	"gorm.io/gorm"

	"focus/models"
)

// extractUserInfo extract user info and set to context
// context.WithValue(keyUser): *models.User; current user
// context.WithValue(keyUserWorkspace): *models.Workspace; default workspace for current user
func ExtractUserInfo(ctx context.Context) (context.Context, error) {
	db := ctx.Value(KeyDB).(*gorm.DB)
	token := ctx.Value(KeyToken).(string) // TODO use jwt token

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
