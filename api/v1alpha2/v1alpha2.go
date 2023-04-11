package v1alpha2

import (
	"context"

	"google.golang.org/protobuf/types/known/emptypb"
	"google.golang.org/protobuf/types/known/wrapperspb"
	"gorm.io/gorm"

	proto "focus/proto/v1alpha2"
)

type v1alpha2ServiceImpl struct {
	proto.UnimplementedFocusServer

	db *gorm.DB
}

func New(db *gorm.DB) proto.FocusServer {
	return &v1alpha2ServiceImpl{db: db}
}

func (s *v1alpha2ServiceImpl) Version(ctx context.Context, _ *emptypb.Empty) (*wrapperspb.StringValue, error) {
	return &wrapperspb.StringValue{Value: "v1alpha2"}, nil
}
