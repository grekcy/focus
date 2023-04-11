package v1alpha1

import (
	"context"

	"google.golang.org/protobuf/types/known/emptypb"
	"google.golang.org/protobuf/types/known/wrapperspb"
	"gorm.io/gorm"

	"focus/models"
	proto "focus/proto/v1alpha1"
)

type v1alpha1ServiceImpl struct {
	proto.UnimplementedFocusServer

	db *gorm.DB
}

func New(db *gorm.DB) proto.FocusServer {
	return &v1alpha1ServiceImpl{
		db: db,
	}
}

type Key string

const (
	KeyDB            Key = "focus.db"
	KeyToken         Key = "focus.token"
	KeyUser          Key = "focus.user"
	KeyUserWorkspace Key = "focus.user.workspace"
)

func (s *v1alpha1ServiceImpl) Version(ctx context.Context, _ *emptypb.Empty) (*wrapperspb.StringValue, error) {
	return &wrapperspb.StringValue{Value: "v1alpha1"}, nil
}

// currentUser return current currentUser
func (s *v1alpha1ServiceImpl) currentUser(ctx context.Context) *models.User {
	user, _ := ctx.Value(KeyUser).(*models.User)
	return user
}

// currentWorkspace returns current user's default workspace
func (s *v1alpha1ServiceImpl) currentWorkspace(ctx context.Context) *models.Workspace {
	ws, _ := ctx.Value(KeyUserWorkspace).(*models.Workspace)
	return ws
}
