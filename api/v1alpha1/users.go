package v1alpha1

import (
	"context"

	"google.golang.org/grpc/codes"
	"google.golang.org/grpc/status"
	"google.golang.org/protobuf/types/known/emptypb"
	"google.golang.org/protobuf/types/known/wrapperspb"

	"focus/models"
	proto "focus/proto/v1alpha1"
	"focus/repository"
)

func (s *v1alpha1ServiceImpl) GetProfile(ctx context.Context, _ *emptypb.Empty) (*proto.User, error) {
	return userModelToProto(s.currentUser(ctx)), nil
}

func (s *v1alpha1ServiceImpl) listUsers(ctx context.Context, where *models.User) ([]*models.User, error) {
	users := []*models.User{}
	if tx := s.db.WithContext(ctx).Unscoped().Where(where).Find(&users); tx.Error != nil {
		return nil, status.Errorf(codes.Internal, "fail to list tags: %+v", tx.Error)
	}

	return users, nil
}

func (s *v1alpha1ServiceImpl) getUserByUID(ctx context.Context, uid string) (*models.User, error) {
	return repository.UserByUID(s.db.WithContext(ctx), uid)
}

func (s *v1alpha1ServiceImpl) getUserByEmail(ctx context.Context, email string) (*models.User, error) {
	return repository.UserByEmail(s.db.WithContext(ctx), email)
}

func userModelToProto(in *models.User) *proto.User {
	return &proto.User{
		Id:    uint64(in.ID),
		Uid:   in.UID,
		Email: in.Email,
		Name:  in.Name,
	}
}

// TODO authorization이 필요하겠음
func (s *v1alpha1ServiceImpl) GetUser(ctx context.Context, req *wrapperspb.UInt64Value) (*proto.User, error) {
	user, err := repository.User(s.db.WithContext(ctx), uint(req.Value))
	if err != nil {
		return nil, err
	}

	return userModelToProto(user), nil
}
