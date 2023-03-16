package api

import (
	"context"

	"google.golang.org/protobuf/types/known/emptypb"
	"google.golang.org/protobuf/types/known/wrapperspb"

	"focus/proto"
)

type v1alpha1ServiceImpl struct {
	proto.UnimplementedV1Alpha1Server
}

func newV1Alpha1Service() proto.V1Alpha1Server {
	return &v1alpha1ServiceImpl{}
}

func (s *v1alpha1ServiceImpl) Version(context.Context, *emptypb.Empty) (*wrapperspb.StringValue, error) {
	return &wrapperspb.StringValue{Value: "v1alpha1"}, nil
}
