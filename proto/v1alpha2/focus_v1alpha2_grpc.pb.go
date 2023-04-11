// Code generated by protoc-gen-go-grpc. DO NOT EDIT.
// versions:
// - protoc-gen-go-grpc v1.3.0
// - protoc             v3.21.12
// source: focus_v1alpha2.proto

package v1alpha2

import (
	context "context"
	grpc "google.golang.org/grpc"
	codes "google.golang.org/grpc/codes"
	status "google.golang.org/grpc/status"
	emptypb "google.golang.org/protobuf/types/known/emptypb"
	wrapperspb "google.golang.org/protobuf/types/known/wrapperspb"
)

// This is a compile-time assertion to ensure that this generated file
// is compatible with the grpc package it is being compiled against.
// Requires gRPC-Go v1.32.0 or later.
const _ = grpc.SupportPackageIsVersion7

const (
	Focus_Version_FullMethodName = "/api.v1alpha2.Focus/version"
)

// FocusClient is the client API for Focus service.
//
// For semantics around ctx use and closing/ending streaming RPCs, please refer to https://pkg.go.dev/google.golang.org/grpc/?tab=doc#ClientConn.NewStream.
type FocusClient interface {
	Version(ctx context.Context, in *emptypb.Empty, opts ...grpc.CallOption) (*wrapperspb.StringValue, error)
}

type focusClient struct {
	cc grpc.ClientConnInterface
}

func NewFocusClient(cc grpc.ClientConnInterface) FocusClient {
	return &focusClient{cc}
}

func (c *focusClient) Version(ctx context.Context, in *emptypb.Empty, opts ...grpc.CallOption) (*wrapperspb.StringValue, error) {
	out := new(wrapperspb.StringValue)
	err := c.cc.Invoke(ctx, Focus_Version_FullMethodName, in, out, opts...)
	if err != nil {
		return nil, err
	}
	return out, nil
}

// FocusServer is the server API for Focus service.
// All implementations must embed UnimplementedFocusServer
// for forward compatibility
type FocusServer interface {
	Version(context.Context, *emptypb.Empty) (*wrapperspb.StringValue, error)
	mustEmbedUnimplementedFocusServer()
}

// UnimplementedFocusServer must be embedded to have forward compatible implementations.
type UnimplementedFocusServer struct {
}

func (UnimplementedFocusServer) Version(context.Context, *emptypb.Empty) (*wrapperspb.StringValue, error) {
	return nil, status.Errorf(codes.Unimplemented, "method Version not implemented")
}
func (UnimplementedFocusServer) mustEmbedUnimplementedFocusServer() {}

// UnsafeFocusServer may be embedded to opt out of forward compatibility for this service.
// Use of this interface is not recommended, as added methods to FocusServer will
// result in compilation errors.
type UnsafeFocusServer interface {
	mustEmbedUnimplementedFocusServer()
}

func RegisterFocusServer(s grpc.ServiceRegistrar, srv FocusServer) {
	s.RegisterService(&Focus_ServiceDesc, srv)
}

func _Focus_Version_Handler(srv interface{}, ctx context.Context, dec func(interface{}) error, interceptor grpc.UnaryServerInterceptor) (interface{}, error) {
	in := new(emptypb.Empty)
	if err := dec(in); err != nil {
		return nil, err
	}
	if interceptor == nil {
		return srv.(FocusServer).Version(ctx, in)
	}
	info := &grpc.UnaryServerInfo{
		Server:     srv,
		FullMethod: Focus_Version_FullMethodName,
	}
	handler := func(ctx context.Context, req interface{}) (interface{}, error) {
		return srv.(FocusServer).Version(ctx, req.(*emptypb.Empty))
	}
	return interceptor(ctx, in, info, handler)
}

// Focus_ServiceDesc is the grpc.ServiceDesc for Focus service.
// It's only intended for direct use with grpc.RegisterService,
// and not to be introspected or modified (even as a copy)
var Focus_ServiceDesc = grpc.ServiceDesc{
	ServiceName: "api.v1alpha2.Focus",
	HandlerType: (*FocusServer)(nil),
	Methods: []grpc.MethodDesc{
		{
			MethodName: "version",
			Handler:    _Focus_Version_Handler,
		},
	},
	Streams:  []grpc.StreamDesc{},
	Metadata: "focus_v1alpha2.proto",
}
