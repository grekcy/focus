package helper

import (
	"google.golang.org/protobuf/types/known/emptypb"
	"google.golang.org/protobuf/types/known/wrapperspb"
)

// prototype type wrappers
func UInt64[T int64 | uint64](v T) *wrapperspb.UInt64Value {
	return &wrapperspb.UInt64Value{Value: uint64(v)}
}

func Empty() *emptypb.Empty {
	return &emptypb.Empty{}
}
