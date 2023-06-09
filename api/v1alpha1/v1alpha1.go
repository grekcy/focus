package v1alpha1

import (
	"context"

	"github.com/whitekid/goxp/log"
	"github.com/whitekid/grpcx"
	"google.golang.org/grpc"
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

var _ grpcx.Interceptor = (*v1alpha1ServiceImpl)(nil)

func New(db *gorm.DB) proto.FocusServer {
	return &v1alpha1ServiceImpl{
		db: db,
	}
}

type contextKey string

const (
	keyDB            contextKey = "focus.db"
	keyToken         contextKey = "focus.token" // token in authorization header
	keyUser          contextKey = "focus.user"
	keyUserWorkspace contextKey = "focus.user.workspace"
)

func (s *v1alpha1ServiceImpl) UnrayInterceptor() []grpc.UnaryServerInterceptor {
	return []grpc.UnaryServerInterceptor{s.authInterceptor()}
}

func (s *v1alpha1ServiceImpl) StreamInterceptor() []grpc.StreamServerInterceptor { return nil }

func init() { authMap["Version"] = authNone }

func (s *v1alpha1ServiceImpl) Version(ctx context.Context, _ *emptypb.Empty) (*wrapperspb.StringValue, error) {
	return &wrapperspb.StringValue{Value: "v1alpha1"}, nil
}

func (s *v1alpha1ServiceImpl) VersionEx(ctx context.Context, _ *emptypb.Empty) (*wrapperspb.StringValue, error) {
	return &wrapperspb.StringValue{Value: "v1alpha1.ex"}, nil
}

// currentUser return current user
func (s *v1alpha1ServiceImpl) currentUser(ctx context.Context) *models.User {
	user, ok := ctx.Value(keyUser).(*models.User)
	if !ok {
		log.Fatalf("fail to get user from context: user=%+v", user)
	}

	return user
}

// currentWorkspace returns current workspace
func (s *v1alpha1ServiceImpl) currentWorkspace(ctx context.Context) *models.Workspace {
	v := ctx.Value(keyUserWorkspace)
	if v == nil {
		log.Fatalf("fail to get workspace from context")
	}

	ws, ok := v.(*models.Workspace)
	if !ok {
		log.Fatalf("workspace was not a workspace type")
	}

	return ws
}
