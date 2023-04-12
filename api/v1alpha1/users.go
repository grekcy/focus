package v1alpha1

import (
	"context"

	"google.golang.org/grpc/codes"
	"google.golang.org/grpc/status"
	"google.golang.org/protobuf/types/known/wrapperspb"
	"gorm.io/gorm"

	"focus/models"
	proto "focus/proto/v1alpha1"
)

func (s *v1alpha1ServiceImpl) listUsers(ctx context.Context, where *models.User) ([]*models.User, error) {
	users := []*models.User{}
	if tx := s.db.WithContext(ctx).Where(where).Find(&users); tx.Error != nil {
		return nil, status.Errorf(codes.Internal, "fail to list tags: %+v", tx.Error)
	}

	return users, nil
}

func (s *v1alpha1ServiceImpl) getUser(ctx context.Context, userID uint) (*models.User, error) {
	r, err := s.listUsers(ctx, &models.User{Model: &gorm.Model{ID: userID}})
	if err != nil {
		return nil, err
	}

	switch len(r) {
	case 0:
		return nil, status.Errorf(codes.NotFound, "user not found: %v", userID)
	case 1:
		return r[0], nil
	default:
		return nil, status.Errorf(codes.Internal, "multiple user found: %v, count=%d", userID, len(r))
	}
}

func userModelToProto(in *models.User) *proto.User {
	return &proto.User{
		Id:    uint64(in.ID),
		Uid:   in.UID,
		Email: in.Email,
		Name:  in.Name,
	}
}

func (s *v1alpha1ServiceImpl) GetUser(ctx context.Context, req *wrapperspb.UInt64Value) (*proto.User, error) {
	user, err := s.getUser(ctx, uint(req.Value))
	if err != nil {
		return nil, err
	}

	return userModelToProto(user), nil
}
