package helper

import (
	"time"

	"google.golang.org/protobuf/types/known/emptypb"
	timestamppb "google.golang.org/protobuf/types/known/timestamppb"
	"google.golang.org/protobuf/types/known/wrapperspb"
)

func NewTimestamppb(tm *time.Time) *timestamppb.Timestamp {
	if tm == nil {
		return nil
	}

	return timestamppb.New(*tm)
}

func TimestampToTimeP(in *timestamppb.Timestamp) *time.Time {
	if in == nil {
		return nil
	}

	t := in.AsTime()
	return &t
}

// prototype type wrappers
func UInt64[T int64 | uint64](v T) *wrapperspb.UInt64Value {
	return &wrapperspb.UInt64Value{Value: uint64(v)}
}

func Empty() *emptypb.Empty {
	return &emptypb.Empty{}
}
