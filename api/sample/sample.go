package sample

import (
	"context"

	"google.golang.org/protobuf/types/known/wrapperspb"

	proto "focus/proto/sample/v1alpha1"
)

type sampleImpl struct {
	proto.UnimplementedSampleServer
}

var _ proto.SampleServer = (*sampleImpl)(nil)

func New() proto.SampleServer {
	return &sampleImpl{}
}

func (s *sampleImpl) Echo(ctx context.Context, req *wrapperspb.StringValue) (*wrapperspb.StringValue, error) {
	return wrapperspb.String(req.Value), nil
}
