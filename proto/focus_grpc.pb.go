// Code generated by protoc-gen-go-grpc. DO NOT EDIT.
// versions:
// - protoc-gen-go-grpc v1.3.0
// - protoc             v3.21.12
// source: focus.proto

package proto

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
	V1Alpha1_Version_FullMethodName                = "/api.V1Alpha1/version"
	V1Alpha1_GetUser_FullMethodName                = "/api.V1Alpha1/getUser"
	V1Alpha1_AddCard_FullMethodName                = "/api.V1Alpha1/addCard"
	V1Alpha1_ListCards_FullMethodName              = "/api.V1Alpha1/listCards"
	V1Alpha1_GetCard_FullMethodName                = "/api.V1Alpha1/getCard"
	V1Alpha1_GetCards_FullMethodName               = "/api.V1Alpha1/getCards"
	V1Alpha1_GetCardProgressSummary_FullMethodName = "/api.V1Alpha1/getCardProgressSummary"
	V1Alpha1_PatchCard_FullMethodName              = "/api.V1Alpha1/patchCard"
	V1Alpha1_RerankCard_FullMethodName             = "/api.V1Alpha1/rerankCard"
	V1Alpha1_DeleteCard_FullMethodName             = "/api.V1Alpha1/deleteCard"
	V1Alpha1_ListLabels_FullMethodName             = "/api.V1Alpha1/listLabels"
	V1Alpha1_UpdateLabel_FullMethodName            = "/api.V1Alpha1/updateLabel"
	V1Alpha1_DeleteLabel_FullMethodName            = "/api.V1Alpha1/deleteLabel"
	V1Alpha1_ListChallenges_FullMethodName         = "/api.V1Alpha1/listChallenges"
	V1Alpha1_GetChallenge_FullMethodName           = "/api.V1Alpha1/getChallenge"
)

// V1Alpha1Client is the client API for V1Alpha1 service.
//
// For semantics around ctx use and closing/ending streaming RPCs, please refer to https://pkg.go.dev/google.golang.org/grpc/?tab=doc#ClientConn.NewStream.
type V1Alpha1Client interface {
	Version(ctx context.Context, in *emptypb.Empty, opts ...grpc.CallOption) (*wrapperspb.StringValue, error)
	GetUser(ctx context.Context, in *wrapperspb.UInt64Value, opts ...grpc.CallOption) (*User, error)
	AddCard(ctx context.Context, in *AddCardReq, opts ...grpc.CallOption) (*Card, error)
	ListCards(ctx context.Context, in *ListCardReq, opts ...grpc.CallOption) (*ListCardResp, error)
	GetCard(ctx context.Context, in *wrapperspb.UInt64Value, opts ...grpc.CallOption) (*Card, error)
	GetCards(ctx context.Context, in *GetCardReq, opts ...grpc.CallOption) (*GetCardResp, error)
	GetCardProgressSummary(ctx context.Context, in *wrapperspb.UInt64Value, opts ...grpc.CallOption) (*CardProgressSummaryResp, error)
	PatchCard(ctx context.Context, in *PatchCardReq, opts ...grpc.CallOption) (*Card, error)
	RerankCard(ctx context.Context, in *RankCardReq, opts ...grpc.CallOption) (*emptypb.Empty, error)
	DeleteCard(ctx context.Context, in *wrapperspb.UInt64Value, opts ...grpc.CallOption) (*emptypb.Empty, error)
	ListLabels(ctx context.Context, in *ListLabelsReq, opts ...grpc.CallOption) (*ListLabelsResp, error)
	UpdateLabel(ctx context.Context, in *Label, opts ...grpc.CallOption) (*Label, error)
	DeleteLabel(ctx context.Context, in *wrapperspb.UInt64Value, opts ...grpc.CallOption) (*emptypb.Empty, error)
	ListChallenges(ctx context.Context, in *ListChallengesReq, opts ...grpc.CallOption) (*ListChallengesResp, error)
	GetChallenge(ctx context.Context, in *wrapperspb.UInt64Value, opts ...grpc.CallOption) (*Challenge, error)
}

type v1Alpha1Client struct {
	cc grpc.ClientConnInterface
}

func NewV1Alpha1Client(cc grpc.ClientConnInterface) V1Alpha1Client {
	return &v1Alpha1Client{cc}
}

func (c *v1Alpha1Client) Version(ctx context.Context, in *emptypb.Empty, opts ...grpc.CallOption) (*wrapperspb.StringValue, error) {
	out := new(wrapperspb.StringValue)
	err := c.cc.Invoke(ctx, V1Alpha1_Version_FullMethodName, in, out, opts...)
	if err != nil {
		return nil, err
	}
	return out, nil
}

func (c *v1Alpha1Client) GetUser(ctx context.Context, in *wrapperspb.UInt64Value, opts ...grpc.CallOption) (*User, error) {
	out := new(User)
	err := c.cc.Invoke(ctx, V1Alpha1_GetUser_FullMethodName, in, out, opts...)
	if err != nil {
		return nil, err
	}
	return out, nil
}

func (c *v1Alpha1Client) AddCard(ctx context.Context, in *AddCardReq, opts ...grpc.CallOption) (*Card, error) {
	out := new(Card)
	err := c.cc.Invoke(ctx, V1Alpha1_AddCard_FullMethodName, in, out, opts...)
	if err != nil {
		return nil, err
	}
	return out, nil
}

func (c *v1Alpha1Client) ListCards(ctx context.Context, in *ListCardReq, opts ...grpc.CallOption) (*ListCardResp, error) {
	out := new(ListCardResp)
	err := c.cc.Invoke(ctx, V1Alpha1_ListCards_FullMethodName, in, out, opts...)
	if err != nil {
		return nil, err
	}
	return out, nil
}

func (c *v1Alpha1Client) GetCard(ctx context.Context, in *wrapperspb.UInt64Value, opts ...grpc.CallOption) (*Card, error) {
	out := new(Card)
	err := c.cc.Invoke(ctx, V1Alpha1_GetCard_FullMethodName, in, out, opts...)
	if err != nil {
		return nil, err
	}
	return out, nil
}

func (c *v1Alpha1Client) GetCards(ctx context.Context, in *GetCardReq, opts ...grpc.CallOption) (*GetCardResp, error) {
	out := new(GetCardResp)
	err := c.cc.Invoke(ctx, V1Alpha1_GetCards_FullMethodName, in, out, opts...)
	if err != nil {
		return nil, err
	}
	return out, nil
}

func (c *v1Alpha1Client) GetCardProgressSummary(ctx context.Context, in *wrapperspb.UInt64Value, opts ...grpc.CallOption) (*CardProgressSummaryResp, error) {
	out := new(CardProgressSummaryResp)
	err := c.cc.Invoke(ctx, V1Alpha1_GetCardProgressSummary_FullMethodName, in, out, opts...)
	if err != nil {
		return nil, err
	}
	return out, nil
}

func (c *v1Alpha1Client) PatchCard(ctx context.Context, in *PatchCardReq, opts ...grpc.CallOption) (*Card, error) {
	out := new(Card)
	err := c.cc.Invoke(ctx, V1Alpha1_PatchCard_FullMethodName, in, out, opts...)
	if err != nil {
		return nil, err
	}
	return out, nil
}

func (c *v1Alpha1Client) RerankCard(ctx context.Context, in *RankCardReq, opts ...grpc.CallOption) (*emptypb.Empty, error) {
	out := new(emptypb.Empty)
	err := c.cc.Invoke(ctx, V1Alpha1_RerankCard_FullMethodName, in, out, opts...)
	if err != nil {
		return nil, err
	}
	return out, nil
}

func (c *v1Alpha1Client) DeleteCard(ctx context.Context, in *wrapperspb.UInt64Value, opts ...grpc.CallOption) (*emptypb.Empty, error) {
	out := new(emptypb.Empty)
	err := c.cc.Invoke(ctx, V1Alpha1_DeleteCard_FullMethodName, in, out, opts...)
	if err != nil {
		return nil, err
	}
	return out, nil
}

func (c *v1Alpha1Client) ListLabels(ctx context.Context, in *ListLabelsReq, opts ...grpc.CallOption) (*ListLabelsResp, error) {
	out := new(ListLabelsResp)
	err := c.cc.Invoke(ctx, V1Alpha1_ListLabels_FullMethodName, in, out, opts...)
	if err != nil {
		return nil, err
	}
	return out, nil
}

func (c *v1Alpha1Client) UpdateLabel(ctx context.Context, in *Label, opts ...grpc.CallOption) (*Label, error) {
	out := new(Label)
	err := c.cc.Invoke(ctx, V1Alpha1_UpdateLabel_FullMethodName, in, out, opts...)
	if err != nil {
		return nil, err
	}
	return out, nil
}

func (c *v1Alpha1Client) DeleteLabel(ctx context.Context, in *wrapperspb.UInt64Value, opts ...grpc.CallOption) (*emptypb.Empty, error) {
	out := new(emptypb.Empty)
	err := c.cc.Invoke(ctx, V1Alpha1_DeleteLabel_FullMethodName, in, out, opts...)
	if err != nil {
		return nil, err
	}
	return out, nil
}

func (c *v1Alpha1Client) ListChallenges(ctx context.Context, in *ListChallengesReq, opts ...grpc.CallOption) (*ListChallengesResp, error) {
	out := new(ListChallengesResp)
	err := c.cc.Invoke(ctx, V1Alpha1_ListChallenges_FullMethodName, in, out, opts...)
	if err != nil {
		return nil, err
	}
	return out, nil
}

func (c *v1Alpha1Client) GetChallenge(ctx context.Context, in *wrapperspb.UInt64Value, opts ...grpc.CallOption) (*Challenge, error) {
	out := new(Challenge)
	err := c.cc.Invoke(ctx, V1Alpha1_GetChallenge_FullMethodName, in, out, opts...)
	if err != nil {
		return nil, err
	}
	return out, nil
}

// V1Alpha1Server is the server API for V1Alpha1 service.
// All implementations must embed UnimplementedV1Alpha1Server
// for forward compatibility
type V1Alpha1Server interface {
	Version(context.Context, *emptypb.Empty) (*wrapperspb.StringValue, error)
	GetUser(context.Context, *wrapperspb.UInt64Value) (*User, error)
	AddCard(context.Context, *AddCardReq) (*Card, error)
	ListCards(context.Context, *ListCardReq) (*ListCardResp, error)
	GetCard(context.Context, *wrapperspb.UInt64Value) (*Card, error)
	GetCards(context.Context, *GetCardReq) (*GetCardResp, error)
	GetCardProgressSummary(context.Context, *wrapperspb.UInt64Value) (*CardProgressSummaryResp, error)
	PatchCard(context.Context, *PatchCardReq) (*Card, error)
	RerankCard(context.Context, *RankCardReq) (*emptypb.Empty, error)
	DeleteCard(context.Context, *wrapperspb.UInt64Value) (*emptypb.Empty, error)
	ListLabels(context.Context, *ListLabelsReq) (*ListLabelsResp, error)
	UpdateLabel(context.Context, *Label) (*Label, error)
	DeleteLabel(context.Context, *wrapperspb.UInt64Value) (*emptypb.Empty, error)
	ListChallenges(context.Context, *ListChallengesReq) (*ListChallengesResp, error)
	GetChallenge(context.Context, *wrapperspb.UInt64Value) (*Challenge, error)
	mustEmbedUnimplementedV1Alpha1Server()
}

// UnimplementedV1Alpha1Server must be embedded to have forward compatible implementations.
type UnimplementedV1Alpha1Server struct {
}

func (UnimplementedV1Alpha1Server) Version(context.Context, *emptypb.Empty) (*wrapperspb.StringValue, error) {
	return nil, status.Errorf(codes.Unimplemented, "method Version not implemented")
}
func (UnimplementedV1Alpha1Server) GetUser(context.Context, *wrapperspb.UInt64Value) (*User, error) {
	return nil, status.Errorf(codes.Unimplemented, "method GetUser not implemented")
}
func (UnimplementedV1Alpha1Server) AddCard(context.Context, *AddCardReq) (*Card, error) {
	return nil, status.Errorf(codes.Unimplemented, "method AddCard not implemented")
}
func (UnimplementedV1Alpha1Server) ListCards(context.Context, *ListCardReq) (*ListCardResp, error) {
	return nil, status.Errorf(codes.Unimplemented, "method ListCards not implemented")
}
func (UnimplementedV1Alpha1Server) GetCard(context.Context, *wrapperspb.UInt64Value) (*Card, error) {
	return nil, status.Errorf(codes.Unimplemented, "method GetCard not implemented")
}
func (UnimplementedV1Alpha1Server) GetCards(context.Context, *GetCardReq) (*GetCardResp, error) {
	return nil, status.Errorf(codes.Unimplemented, "method GetCards not implemented")
}
func (UnimplementedV1Alpha1Server) GetCardProgressSummary(context.Context, *wrapperspb.UInt64Value) (*CardProgressSummaryResp, error) {
	return nil, status.Errorf(codes.Unimplemented, "method GetCardProgressSummary not implemented")
}
func (UnimplementedV1Alpha1Server) PatchCard(context.Context, *PatchCardReq) (*Card, error) {
	return nil, status.Errorf(codes.Unimplemented, "method PatchCard not implemented")
}
func (UnimplementedV1Alpha1Server) RerankCard(context.Context, *RankCardReq) (*emptypb.Empty, error) {
	return nil, status.Errorf(codes.Unimplemented, "method RerankCard not implemented")
}
func (UnimplementedV1Alpha1Server) DeleteCard(context.Context, *wrapperspb.UInt64Value) (*emptypb.Empty, error) {
	return nil, status.Errorf(codes.Unimplemented, "method DeleteCard not implemented")
}
func (UnimplementedV1Alpha1Server) ListLabels(context.Context, *ListLabelsReq) (*ListLabelsResp, error) {
	return nil, status.Errorf(codes.Unimplemented, "method ListLabels not implemented")
}
func (UnimplementedV1Alpha1Server) UpdateLabel(context.Context, *Label) (*Label, error) {
	return nil, status.Errorf(codes.Unimplemented, "method UpdateLabel not implemented")
}
func (UnimplementedV1Alpha1Server) DeleteLabel(context.Context, *wrapperspb.UInt64Value) (*emptypb.Empty, error) {
	return nil, status.Errorf(codes.Unimplemented, "method DeleteLabel not implemented")
}
func (UnimplementedV1Alpha1Server) ListChallenges(context.Context, *ListChallengesReq) (*ListChallengesResp, error) {
	return nil, status.Errorf(codes.Unimplemented, "method ListChallenges not implemented")
}
func (UnimplementedV1Alpha1Server) GetChallenge(context.Context, *wrapperspb.UInt64Value) (*Challenge, error) {
	return nil, status.Errorf(codes.Unimplemented, "method GetChallenge not implemented")
}
func (UnimplementedV1Alpha1Server) mustEmbedUnimplementedV1Alpha1Server() {}

// UnsafeV1Alpha1Server may be embedded to opt out of forward compatibility for this service.
// Use of this interface is not recommended, as added methods to V1Alpha1Server will
// result in compilation errors.
type UnsafeV1Alpha1Server interface {
	mustEmbedUnimplementedV1Alpha1Server()
}

func RegisterV1Alpha1Server(s grpc.ServiceRegistrar, srv V1Alpha1Server) {
	s.RegisterService(&V1Alpha1_ServiceDesc, srv)
}

func _V1Alpha1_Version_Handler(srv interface{}, ctx context.Context, dec func(interface{}) error, interceptor grpc.UnaryServerInterceptor) (interface{}, error) {
	in := new(emptypb.Empty)
	if err := dec(in); err != nil {
		return nil, err
	}
	if interceptor == nil {
		return srv.(V1Alpha1Server).Version(ctx, in)
	}
	info := &grpc.UnaryServerInfo{
		Server:     srv,
		FullMethod: V1Alpha1_Version_FullMethodName,
	}
	handler := func(ctx context.Context, req interface{}) (interface{}, error) {
		return srv.(V1Alpha1Server).Version(ctx, req.(*emptypb.Empty))
	}
	return interceptor(ctx, in, info, handler)
}

func _V1Alpha1_GetUser_Handler(srv interface{}, ctx context.Context, dec func(interface{}) error, interceptor grpc.UnaryServerInterceptor) (interface{}, error) {
	in := new(wrapperspb.UInt64Value)
	if err := dec(in); err != nil {
		return nil, err
	}
	if interceptor == nil {
		return srv.(V1Alpha1Server).GetUser(ctx, in)
	}
	info := &grpc.UnaryServerInfo{
		Server:     srv,
		FullMethod: V1Alpha1_GetUser_FullMethodName,
	}
	handler := func(ctx context.Context, req interface{}) (interface{}, error) {
		return srv.(V1Alpha1Server).GetUser(ctx, req.(*wrapperspb.UInt64Value))
	}
	return interceptor(ctx, in, info, handler)
}

func _V1Alpha1_AddCard_Handler(srv interface{}, ctx context.Context, dec func(interface{}) error, interceptor grpc.UnaryServerInterceptor) (interface{}, error) {
	in := new(AddCardReq)
	if err := dec(in); err != nil {
		return nil, err
	}
	if interceptor == nil {
		return srv.(V1Alpha1Server).AddCard(ctx, in)
	}
	info := &grpc.UnaryServerInfo{
		Server:     srv,
		FullMethod: V1Alpha1_AddCard_FullMethodName,
	}
	handler := func(ctx context.Context, req interface{}) (interface{}, error) {
		return srv.(V1Alpha1Server).AddCard(ctx, req.(*AddCardReq))
	}
	return interceptor(ctx, in, info, handler)
}

func _V1Alpha1_ListCards_Handler(srv interface{}, ctx context.Context, dec func(interface{}) error, interceptor grpc.UnaryServerInterceptor) (interface{}, error) {
	in := new(ListCardReq)
	if err := dec(in); err != nil {
		return nil, err
	}
	if interceptor == nil {
		return srv.(V1Alpha1Server).ListCards(ctx, in)
	}
	info := &grpc.UnaryServerInfo{
		Server:     srv,
		FullMethod: V1Alpha1_ListCards_FullMethodName,
	}
	handler := func(ctx context.Context, req interface{}) (interface{}, error) {
		return srv.(V1Alpha1Server).ListCards(ctx, req.(*ListCardReq))
	}
	return interceptor(ctx, in, info, handler)
}

func _V1Alpha1_GetCard_Handler(srv interface{}, ctx context.Context, dec func(interface{}) error, interceptor grpc.UnaryServerInterceptor) (interface{}, error) {
	in := new(wrapperspb.UInt64Value)
	if err := dec(in); err != nil {
		return nil, err
	}
	if interceptor == nil {
		return srv.(V1Alpha1Server).GetCard(ctx, in)
	}
	info := &grpc.UnaryServerInfo{
		Server:     srv,
		FullMethod: V1Alpha1_GetCard_FullMethodName,
	}
	handler := func(ctx context.Context, req interface{}) (interface{}, error) {
		return srv.(V1Alpha1Server).GetCard(ctx, req.(*wrapperspb.UInt64Value))
	}
	return interceptor(ctx, in, info, handler)
}

func _V1Alpha1_GetCards_Handler(srv interface{}, ctx context.Context, dec func(interface{}) error, interceptor grpc.UnaryServerInterceptor) (interface{}, error) {
	in := new(GetCardReq)
	if err := dec(in); err != nil {
		return nil, err
	}
	if interceptor == nil {
		return srv.(V1Alpha1Server).GetCards(ctx, in)
	}
	info := &grpc.UnaryServerInfo{
		Server:     srv,
		FullMethod: V1Alpha1_GetCards_FullMethodName,
	}
	handler := func(ctx context.Context, req interface{}) (interface{}, error) {
		return srv.(V1Alpha1Server).GetCards(ctx, req.(*GetCardReq))
	}
	return interceptor(ctx, in, info, handler)
}

func _V1Alpha1_GetCardProgressSummary_Handler(srv interface{}, ctx context.Context, dec func(interface{}) error, interceptor grpc.UnaryServerInterceptor) (interface{}, error) {
	in := new(wrapperspb.UInt64Value)
	if err := dec(in); err != nil {
		return nil, err
	}
	if interceptor == nil {
		return srv.(V1Alpha1Server).GetCardProgressSummary(ctx, in)
	}
	info := &grpc.UnaryServerInfo{
		Server:     srv,
		FullMethod: V1Alpha1_GetCardProgressSummary_FullMethodName,
	}
	handler := func(ctx context.Context, req interface{}) (interface{}, error) {
		return srv.(V1Alpha1Server).GetCardProgressSummary(ctx, req.(*wrapperspb.UInt64Value))
	}
	return interceptor(ctx, in, info, handler)
}

func _V1Alpha1_PatchCard_Handler(srv interface{}, ctx context.Context, dec func(interface{}) error, interceptor grpc.UnaryServerInterceptor) (interface{}, error) {
	in := new(PatchCardReq)
	if err := dec(in); err != nil {
		return nil, err
	}
	if interceptor == nil {
		return srv.(V1Alpha1Server).PatchCard(ctx, in)
	}
	info := &grpc.UnaryServerInfo{
		Server:     srv,
		FullMethod: V1Alpha1_PatchCard_FullMethodName,
	}
	handler := func(ctx context.Context, req interface{}) (interface{}, error) {
		return srv.(V1Alpha1Server).PatchCard(ctx, req.(*PatchCardReq))
	}
	return interceptor(ctx, in, info, handler)
}

func _V1Alpha1_RerankCard_Handler(srv interface{}, ctx context.Context, dec func(interface{}) error, interceptor grpc.UnaryServerInterceptor) (interface{}, error) {
	in := new(RankCardReq)
	if err := dec(in); err != nil {
		return nil, err
	}
	if interceptor == nil {
		return srv.(V1Alpha1Server).RerankCard(ctx, in)
	}
	info := &grpc.UnaryServerInfo{
		Server:     srv,
		FullMethod: V1Alpha1_RerankCard_FullMethodName,
	}
	handler := func(ctx context.Context, req interface{}) (interface{}, error) {
		return srv.(V1Alpha1Server).RerankCard(ctx, req.(*RankCardReq))
	}
	return interceptor(ctx, in, info, handler)
}

func _V1Alpha1_DeleteCard_Handler(srv interface{}, ctx context.Context, dec func(interface{}) error, interceptor grpc.UnaryServerInterceptor) (interface{}, error) {
	in := new(wrapperspb.UInt64Value)
	if err := dec(in); err != nil {
		return nil, err
	}
	if interceptor == nil {
		return srv.(V1Alpha1Server).DeleteCard(ctx, in)
	}
	info := &grpc.UnaryServerInfo{
		Server:     srv,
		FullMethod: V1Alpha1_DeleteCard_FullMethodName,
	}
	handler := func(ctx context.Context, req interface{}) (interface{}, error) {
		return srv.(V1Alpha1Server).DeleteCard(ctx, req.(*wrapperspb.UInt64Value))
	}
	return interceptor(ctx, in, info, handler)
}

func _V1Alpha1_ListLabels_Handler(srv interface{}, ctx context.Context, dec func(interface{}) error, interceptor grpc.UnaryServerInterceptor) (interface{}, error) {
	in := new(ListLabelsReq)
	if err := dec(in); err != nil {
		return nil, err
	}
	if interceptor == nil {
		return srv.(V1Alpha1Server).ListLabels(ctx, in)
	}
	info := &grpc.UnaryServerInfo{
		Server:     srv,
		FullMethod: V1Alpha1_ListLabels_FullMethodName,
	}
	handler := func(ctx context.Context, req interface{}) (interface{}, error) {
		return srv.(V1Alpha1Server).ListLabels(ctx, req.(*ListLabelsReq))
	}
	return interceptor(ctx, in, info, handler)
}

func _V1Alpha1_UpdateLabel_Handler(srv interface{}, ctx context.Context, dec func(interface{}) error, interceptor grpc.UnaryServerInterceptor) (interface{}, error) {
	in := new(Label)
	if err := dec(in); err != nil {
		return nil, err
	}
	if interceptor == nil {
		return srv.(V1Alpha1Server).UpdateLabel(ctx, in)
	}
	info := &grpc.UnaryServerInfo{
		Server:     srv,
		FullMethod: V1Alpha1_UpdateLabel_FullMethodName,
	}
	handler := func(ctx context.Context, req interface{}) (interface{}, error) {
		return srv.(V1Alpha1Server).UpdateLabel(ctx, req.(*Label))
	}
	return interceptor(ctx, in, info, handler)
}

func _V1Alpha1_DeleteLabel_Handler(srv interface{}, ctx context.Context, dec func(interface{}) error, interceptor grpc.UnaryServerInterceptor) (interface{}, error) {
	in := new(wrapperspb.UInt64Value)
	if err := dec(in); err != nil {
		return nil, err
	}
	if interceptor == nil {
		return srv.(V1Alpha1Server).DeleteLabel(ctx, in)
	}
	info := &grpc.UnaryServerInfo{
		Server:     srv,
		FullMethod: V1Alpha1_DeleteLabel_FullMethodName,
	}
	handler := func(ctx context.Context, req interface{}) (interface{}, error) {
		return srv.(V1Alpha1Server).DeleteLabel(ctx, req.(*wrapperspb.UInt64Value))
	}
	return interceptor(ctx, in, info, handler)
}

func _V1Alpha1_ListChallenges_Handler(srv interface{}, ctx context.Context, dec func(interface{}) error, interceptor grpc.UnaryServerInterceptor) (interface{}, error) {
	in := new(ListChallengesReq)
	if err := dec(in); err != nil {
		return nil, err
	}
	if interceptor == nil {
		return srv.(V1Alpha1Server).ListChallenges(ctx, in)
	}
	info := &grpc.UnaryServerInfo{
		Server:     srv,
		FullMethod: V1Alpha1_ListChallenges_FullMethodName,
	}
	handler := func(ctx context.Context, req interface{}) (interface{}, error) {
		return srv.(V1Alpha1Server).ListChallenges(ctx, req.(*ListChallengesReq))
	}
	return interceptor(ctx, in, info, handler)
}

func _V1Alpha1_GetChallenge_Handler(srv interface{}, ctx context.Context, dec func(interface{}) error, interceptor grpc.UnaryServerInterceptor) (interface{}, error) {
	in := new(wrapperspb.UInt64Value)
	if err := dec(in); err != nil {
		return nil, err
	}
	if interceptor == nil {
		return srv.(V1Alpha1Server).GetChallenge(ctx, in)
	}
	info := &grpc.UnaryServerInfo{
		Server:     srv,
		FullMethod: V1Alpha1_GetChallenge_FullMethodName,
	}
	handler := func(ctx context.Context, req interface{}) (interface{}, error) {
		return srv.(V1Alpha1Server).GetChallenge(ctx, req.(*wrapperspb.UInt64Value))
	}
	return interceptor(ctx, in, info, handler)
}

// V1Alpha1_ServiceDesc is the grpc.ServiceDesc for V1Alpha1 service.
// It's only intended for direct use with grpc.RegisterService,
// and not to be introspected or modified (even as a copy)
var V1Alpha1_ServiceDesc = grpc.ServiceDesc{
	ServiceName: "api.V1Alpha1",
	HandlerType: (*V1Alpha1Server)(nil),
	Methods: []grpc.MethodDesc{
		{
			MethodName: "version",
			Handler:    _V1Alpha1_Version_Handler,
		},
		{
			MethodName: "getUser",
			Handler:    _V1Alpha1_GetUser_Handler,
		},
		{
			MethodName: "addCard",
			Handler:    _V1Alpha1_AddCard_Handler,
		},
		{
			MethodName: "listCards",
			Handler:    _V1Alpha1_ListCards_Handler,
		},
		{
			MethodName: "getCard",
			Handler:    _V1Alpha1_GetCard_Handler,
		},
		{
			MethodName: "getCards",
			Handler:    _V1Alpha1_GetCards_Handler,
		},
		{
			MethodName: "getCardProgressSummary",
			Handler:    _V1Alpha1_GetCardProgressSummary_Handler,
		},
		{
			MethodName: "patchCard",
			Handler:    _V1Alpha1_PatchCard_Handler,
		},
		{
			MethodName: "rerankCard",
			Handler:    _V1Alpha1_RerankCard_Handler,
		},
		{
			MethodName: "deleteCard",
			Handler:    _V1Alpha1_DeleteCard_Handler,
		},
		{
			MethodName: "listLabels",
			Handler:    _V1Alpha1_ListLabels_Handler,
		},
		{
			MethodName: "updateLabel",
			Handler:    _V1Alpha1_UpdateLabel_Handler,
		},
		{
			MethodName: "deleteLabel",
			Handler:    _V1Alpha1_DeleteLabel_Handler,
		},
		{
			MethodName: "listChallenges",
			Handler:    _V1Alpha1_ListChallenges_Handler,
		},
		{
			MethodName: "getChallenge",
			Handler:    _V1Alpha1_GetChallenge_Handler,
		},
	},
	Streams:  []grpc.StreamDesc{},
	Metadata: "focus.proto",
}
