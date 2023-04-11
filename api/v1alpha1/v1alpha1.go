package v1alpha1

import (
	"context"
	"log"

	"google.golang.org/grpc"
	"google.golang.org/protobuf/types/known/emptypb"
	"google.golang.org/protobuf/types/known/wrapperspb"
	"gorm.io/gorm"

	"focus/api/types"
	"focus/models"
	proto "focus/proto/v1alpha1"
)

type v1alpha1ServiceImpl struct {
	proto.UnimplementedFocusServer

	db *gorm.DB
}

var _ types.Interceptor = (*v1alpha1ServiceImpl)(nil)

func New(db *gorm.DB) proto.FocusServer {
	return &v1alpha1ServiceImpl{
		db: db,
	}
}

type Key string

const (
	KeyDB            Key = "focus.db"
	KeyToken         Key = "focus.token" // token in authorization header
	KeyUser          Key = "focus.user"
	KeyUserWorkspace Key = "focus.user.workspace"
)

func (s *v1alpha1ServiceImpl) GetUnrayInterceptor() []grpc.UnaryServerInterceptor {
	return []grpc.UnaryServerInterceptor{s.authInterceptor()}
}

func (s *v1alpha1ServiceImpl) GetStreamInterceptor() []grpc.StreamServerInterceptor { return nil }

func (s *v1alpha1ServiceImpl) Version(ctx context.Context, _ *emptypb.Empty) (*wrapperspb.StringValue, error) {
	return &wrapperspb.StringValue{Value: "v1alpha1"}, nil
}

func (s *v1alpha1ServiceImpl) VersionEx(ctx context.Context, _ *emptypb.Empty) (*wrapperspb.StringValue, error) {
	return &wrapperspb.StringValue{Value: "v1alpha1.ex"}, nil
}

// currentUser return current currentUser
func (s *v1alpha1ServiceImpl) currentUser(ctx context.Context) *models.User {
	user, ok := ctx.Value(KeyUser).(*models.User)
	if !ok {
		log.Fatalf("user was not set: user=%+v", user)
	}
	return user
}

// currentWorkspace returns current user's default workspace
func (s *v1alpha1ServiceImpl) currentWorkspace(ctx context.Context) *models.Workspace {
	ws, ok := ctx.Value(KeyUserWorkspace).(*models.Workspace)
	if !ok {
		log.Fatalf("workspace was not set: workspace=%+v", ws)
	}

	return ws
}
