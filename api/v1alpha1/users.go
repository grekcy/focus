package v1alpha1

import (
	"context"

	"google.golang.org/grpc/codes"
	"google.golang.org/grpc/status"
	"google.golang.org/protobuf/types/known/emptypb"
	"google.golang.org/protobuf/types/known/wrapperspb"
	"gorm.io/gorm"

	"focus/models"
	proto "focus/proto/v1alpha1"
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

func (s *v1alpha1ServiceImpl) _getUser(ctx context.Context, where *models.User) (*models.User, error) {
	r, err := s.listUsers(ctx, where)
	if err != nil {
		return nil, err
	}

	switch len(r) {
	case 0:
		return nil, status.Errorf(codes.NotFound, "user not found: %+v", where)
	case 1:
		return r[0], nil
	default:
		return nil, status.Errorf(codes.Internal, "multiple user found: %+v, count=%d", where, len(r))
	}
}

func (s *v1alpha1ServiceImpl) getUser(ctx context.Context, userID uint) (*models.User, error) {
	return s._getUser(ctx, &models.User{Model: &gorm.Model{ID: userID}})
}

func (s *v1alpha1ServiceImpl) getUserByUID(ctx context.Context, uid string) (*models.User, error) {
	return s._getUser(ctx, &models.User{UID: uid})
}

func (s *v1alpha1ServiceImpl) getUserByEmail(ctx context.Context, email string) (*models.User, error) {
	return s._getUser(ctx, &models.User{Email: email})
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
	user, err := s.getUser(ctx, uint(req.Value))
	if err != nil {
		return nil, err
	}

	return userModelToProto(user), nil
}
