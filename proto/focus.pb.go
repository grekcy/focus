// Code generated by protoc-gen-go. DO NOT EDIT.
// versions:
// 	protoc-gen-go v1.30.0
// 	protoc        v3.21.12
// source: focus.proto

package proto

import (
	protoreflect "google.golang.org/protobuf/reflect/protoreflect"
	protoimpl "google.golang.org/protobuf/runtime/protoimpl"
	emptypb "google.golang.org/protobuf/types/known/emptypb"
	timestamppb "google.golang.org/protobuf/types/known/timestamppb"
	wrapperspb "google.golang.org/protobuf/types/known/wrapperspb"
	reflect "reflect"
	sync "sync"
)

const (
	// Verify that this generated code is sufficiently up-to-date.
	_ = protoimpl.EnforceVersion(20 - protoimpl.MinVersion)
	// Verify that runtime/protoimpl is sufficiently up-to-date.
	_ = protoimpl.EnforceVersion(protoimpl.MaxVersion - 20)
)

type CardField int32

const (
	CardField_SUBJECT      CardField = 0
	CardField_COMPLETED_AT CardField = 1
	CardField_CONTENT      CardField = 2
)

// Enum value maps for CardField.
var (
	CardField_name = map[int32]string{
		0: "SUBJECT",
		1: "COMPLETED_AT",
		2: "CONTENT",
	}
	CardField_value = map[string]int32{
		"SUBJECT":      0,
		"COMPLETED_AT": 1,
		"CONTENT":      2,
	}
)

func (x CardField) Enum() *CardField {
	p := new(CardField)
	*p = x
	return p
}

func (x CardField) String() string {
	return protoimpl.X.EnumStringOf(x.Descriptor(), protoreflect.EnumNumber(x))
}

func (CardField) Descriptor() protoreflect.EnumDescriptor {
	return file_focus_proto_enumTypes[0].Descriptor()
}

func (CardField) Type() protoreflect.EnumType {
	return &file_focus_proto_enumTypes[0]
}

func (x CardField) Number() protoreflect.EnumNumber {
	return protoreflect.EnumNumber(x)
}

// Deprecated: Use CardField.Descriptor instead.
func (CardField) EnumDescriptor() ([]byte, []int) {
	return file_focus_proto_rawDescGZIP(), []int{0}
}

type Card struct {
	state         protoimpl.MessageState
	sizeCache     protoimpl.SizeCache
	unknownFields protoimpl.UnknownFields

	CardNo       uint64                 `protobuf:"varint,1,opt,name=card_no,json=cardNo,proto3" json:"card_no,omitempty"`
	ParentCardNo *uint64                `protobuf:"varint,2,opt,name=parent_card_no,json=parentCardNo,proto3,oneof" json:"parent_card_no,omitempty"`
	Depth        uint32                 `protobuf:"varint,3,opt,name=depth,proto3" json:"depth,omitempty"`
	CreatedAt    *timestamppb.Timestamp `protobuf:"bytes,4,opt,name=created_at,json=createdAt,proto3" json:"created_at,omitempty"`
	UpdatedAt    *timestamppb.Timestamp `protobuf:"bytes,5,opt,name=updated_at,json=updatedAt,proto3" json:"updated_at,omitempty"`
	CompletedAt  *timestamppb.Timestamp `protobuf:"bytes,6,opt,name=completed_at,json=completedAt,proto3,oneof" json:"completed_at,omitempty"`
	Subject      string                 `protobuf:"bytes,7,opt,name=subject,proto3" json:"subject,omitempty"`
	Content      string                 `protobuf:"bytes,8,opt,name=content,proto3" json:"content,omitempty"`
}

func (x *Card) Reset() {
	*x = Card{}
	if protoimpl.UnsafeEnabled {
		mi := &file_focus_proto_msgTypes[0]
		ms := protoimpl.X.MessageStateOf(protoimpl.Pointer(x))
		ms.StoreMessageInfo(mi)
	}
}

func (x *Card) String() string {
	return protoimpl.X.MessageStringOf(x)
}

func (*Card) ProtoMessage() {}

func (x *Card) ProtoReflect() protoreflect.Message {
	mi := &file_focus_proto_msgTypes[0]
	if protoimpl.UnsafeEnabled && x != nil {
		ms := protoimpl.X.MessageStateOf(protoimpl.Pointer(x))
		if ms.LoadMessageInfo() == nil {
			ms.StoreMessageInfo(mi)
		}
		return ms
	}
	return mi.MessageOf(x)
}

// Deprecated: Use Card.ProtoReflect.Descriptor instead.
func (*Card) Descriptor() ([]byte, []int) {
	return file_focus_proto_rawDescGZIP(), []int{0}
}

func (x *Card) GetCardNo() uint64 {
	if x != nil {
		return x.CardNo
	}
	return 0
}

func (x *Card) GetParentCardNo() uint64 {
	if x != nil && x.ParentCardNo != nil {
		return *x.ParentCardNo
	}
	return 0
}

func (x *Card) GetDepth() uint32 {
	if x != nil {
		return x.Depth
	}
	return 0
}

func (x *Card) GetCreatedAt() *timestamppb.Timestamp {
	if x != nil {
		return x.CreatedAt
	}
	return nil
}

func (x *Card) GetUpdatedAt() *timestamppb.Timestamp {
	if x != nil {
		return x.UpdatedAt
	}
	return nil
}

func (x *Card) GetCompletedAt() *timestamppb.Timestamp {
	if x != nil {
		return x.CompletedAt
	}
	return nil
}

func (x *Card) GetSubject() string {
	if x != nil {
		return x.Subject
	}
	return ""
}

func (x *Card) GetContent() string {
	if x != nil {
		return x.Content
	}
	return ""
}

type ListCardReq struct {
	state         protoimpl.MessageState
	sizeCache     protoimpl.SizeCache
	unknownFields protoimpl.UnknownFields

	ExcludeCompleted  bool `protobuf:"varint,1,opt,name=exclude_completed,json=excludeCompleted,proto3" json:"exclude_completed,omitempty"`
	ExcludeChallenges bool `protobuf:"varint,2,opt,name=exclude_challenges,json=excludeChallenges,proto3" json:"exclude_challenges,omitempty"`
}

func (x *ListCardReq) Reset() {
	*x = ListCardReq{}
	if protoimpl.UnsafeEnabled {
		mi := &file_focus_proto_msgTypes[1]
		ms := protoimpl.X.MessageStateOf(protoimpl.Pointer(x))
		ms.StoreMessageInfo(mi)
	}
}

func (x *ListCardReq) String() string {
	return protoimpl.X.MessageStringOf(x)
}

func (*ListCardReq) ProtoMessage() {}

func (x *ListCardReq) ProtoReflect() protoreflect.Message {
	mi := &file_focus_proto_msgTypes[1]
	if protoimpl.UnsafeEnabled && x != nil {
		ms := protoimpl.X.MessageStateOf(protoimpl.Pointer(x))
		if ms.LoadMessageInfo() == nil {
			ms.StoreMessageInfo(mi)
		}
		return ms
	}
	return mi.MessageOf(x)
}

// Deprecated: Use ListCardReq.ProtoReflect.Descriptor instead.
func (*ListCardReq) Descriptor() ([]byte, []int) {
	return file_focus_proto_rawDescGZIP(), []int{1}
}

func (x *ListCardReq) GetExcludeCompleted() bool {
	if x != nil {
		return x.ExcludeCompleted
	}
	return false
}

func (x *ListCardReq) GetExcludeChallenges() bool {
	if x != nil {
		return x.ExcludeChallenges
	}
	return false
}

type ListCardResp struct {
	state         protoimpl.MessageState
	sizeCache     protoimpl.SizeCache
	unknownFields protoimpl.UnknownFields

	Items []*Card `protobuf:"bytes,1,rep,name=items,proto3" json:"items,omitempty"`
}

func (x *ListCardResp) Reset() {
	*x = ListCardResp{}
	if protoimpl.UnsafeEnabled {
		mi := &file_focus_proto_msgTypes[2]
		ms := protoimpl.X.MessageStateOf(protoimpl.Pointer(x))
		ms.StoreMessageInfo(mi)
	}
}

func (x *ListCardResp) String() string {
	return protoimpl.X.MessageStringOf(x)
}

func (*ListCardResp) ProtoMessage() {}

func (x *ListCardResp) ProtoReflect() protoreflect.Message {
	mi := &file_focus_proto_msgTypes[2]
	if protoimpl.UnsafeEnabled && x != nil {
		ms := protoimpl.X.MessageStateOf(protoimpl.Pointer(x))
		if ms.LoadMessageInfo() == nil {
			ms.StoreMessageInfo(mi)
		}
		return ms
	}
	return mi.MessageOf(x)
}

// Deprecated: Use ListCardResp.ProtoReflect.Descriptor instead.
func (*ListCardResp) Descriptor() ([]byte, []int) {
	return file_focus_proto_rawDescGZIP(), []int{2}
}

func (x *ListCardResp) GetItems() []*Card {
	if x != nil {
		return x.Items
	}
	return nil
}

type GetCardReq struct {
	state         protoimpl.MessageState
	sizeCache     protoimpl.SizeCache
	unknownFields protoimpl.UnknownFields

	CardNos []uint64 `protobuf:"varint,1,rep,packed,name=card_nos,json=cardNos,proto3" json:"card_nos,omitempty"`
}

func (x *GetCardReq) Reset() {
	*x = GetCardReq{}
	if protoimpl.UnsafeEnabled {
		mi := &file_focus_proto_msgTypes[3]
		ms := protoimpl.X.MessageStateOf(protoimpl.Pointer(x))
		ms.StoreMessageInfo(mi)
	}
}

func (x *GetCardReq) String() string {
	return protoimpl.X.MessageStringOf(x)
}

func (*GetCardReq) ProtoMessage() {}

func (x *GetCardReq) ProtoReflect() protoreflect.Message {
	mi := &file_focus_proto_msgTypes[3]
	if protoimpl.UnsafeEnabled && x != nil {
		ms := protoimpl.X.MessageStateOf(protoimpl.Pointer(x))
		if ms.LoadMessageInfo() == nil {
			ms.StoreMessageInfo(mi)
		}
		return ms
	}
	return mi.MessageOf(x)
}

// Deprecated: Use GetCardReq.ProtoReflect.Descriptor instead.
func (*GetCardReq) Descriptor() ([]byte, []int) {
	return file_focus_proto_rawDescGZIP(), []int{3}
}

func (x *GetCardReq) GetCardNos() []uint64 {
	if x != nil {
		return x.CardNos
	}
	return nil
}

type GetCardResp struct {
	state         protoimpl.MessageState
	sizeCache     protoimpl.SizeCache
	unknownFields protoimpl.UnknownFields

	Items map[uint64]*Card `protobuf:"bytes,1,rep,name=items,proto3" json:"items,omitempty" protobuf_key:"varint,1,opt,name=key,proto3" protobuf_val:"bytes,2,opt,name=value,proto3"`
}

func (x *GetCardResp) Reset() {
	*x = GetCardResp{}
	if protoimpl.UnsafeEnabled {
		mi := &file_focus_proto_msgTypes[4]
		ms := protoimpl.X.MessageStateOf(protoimpl.Pointer(x))
		ms.StoreMessageInfo(mi)
	}
}

func (x *GetCardResp) String() string {
	return protoimpl.X.MessageStringOf(x)
}

func (*GetCardResp) ProtoMessage() {}

func (x *GetCardResp) ProtoReflect() protoreflect.Message {
	mi := &file_focus_proto_msgTypes[4]
	if protoimpl.UnsafeEnabled && x != nil {
		ms := protoimpl.X.MessageStateOf(protoimpl.Pointer(x))
		if ms.LoadMessageInfo() == nil {
			ms.StoreMessageInfo(mi)
		}
		return ms
	}
	return mi.MessageOf(x)
}

// Deprecated: Use GetCardResp.ProtoReflect.Descriptor instead.
func (*GetCardResp) Descriptor() ([]byte, []int) {
	return file_focus_proto_rawDescGZIP(), []int{4}
}

func (x *GetCardResp) GetItems() map[uint64]*Card {
	if x != nil {
		return x.Items
	}
	return nil
}

type RankCardReq struct {
	state         protoimpl.MessageState
	sizeCache     protoimpl.SizeCache
	unknownFields protoimpl.UnknownFields

	CardNo       uint64 `protobuf:"varint,1,opt,name=card_no,json=cardNo,proto3" json:"card_no,omitempty"`
	TargetCardNo uint64 `protobuf:"varint,2,opt,name=target_card_no,json=targetCardNo,proto3" json:"target_card_no,omitempty"`
}

func (x *RankCardReq) Reset() {
	*x = RankCardReq{}
	if protoimpl.UnsafeEnabled {
		mi := &file_focus_proto_msgTypes[5]
		ms := protoimpl.X.MessageStateOf(protoimpl.Pointer(x))
		ms.StoreMessageInfo(mi)
	}
}

func (x *RankCardReq) String() string {
	return protoimpl.X.MessageStringOf(x)
}

func (*RankCardReq) ProtoMessage() {}

func (x *RankCardReq) ProtoReflect() protoreflect.Message {
	mi := &file_focus_proto_msgTypes[5]
	if protoimpl.UnsafeEnabled && x != nil {
		ms := protoimpl.X.MessageStateOf(protoimpl.Pointer(x))
		if ms.LoadMessageInfo() == nil {
			ms.StoreMessageInfo(mi)
		}
		return ms
	}
	return mi.MessageOf(x)
}

// Deprecated: Use RankCardReq.ProtoReflect.Descriptor instead.
func (*RankCardReq) Descriptor() ([]byte, []int) {
	return file_focus_proto_rawDescGZIP(), []int{5}
}

func (x *RankCardReq) GetCardNo() uint64 {
	if x != nil {
		return x.CardNo
	}
	return 0
}

func (x *RankCardReq) GetTargetCardNo() uint64 {
	if x != nil {
		return x.TargetCardNo
	}
	return 0
}

type PatchCardReq struct {
	state         protoimpl.MessageState
	sizeCache     protoimpl.SizeCache
	unknownFields protoimpl.UnknownFields

	Fields []CardField `protobuf:"varint,1,rep,packed,name=fields,proto3,enum=CardField" json:"fields,omitempty"`
	Card   *Card       `protobuf:"bytes,2,opt,name=card,proto3" json:"card,omitempty"`
}

func (x *PatchCardReq) Reset() {
	*x = PatchCardReq{}
	if protoimpl.UnsafeEnabled {
		mi := &file_focus_proto_msgTypes[6]
		ms := protoimpl.X.MessageStateOf(protoimpl.Pointer(x))
		ms.StoreMessageInfo(mi)
	}
}

func (x *PatchCardReq) String() string {
	return protoimpl.X.MessageStringOf(x)
}

func (*PatchCardReq) ProtoMessage() {}

func (x *PatchCardReq) ProtoReflect() protoreflect.Message {
	mi := &file_focus_proto_msgTypes[6]
	if protoimpl.UnsafeEnabled && x != nil {
		ms := protoimpl.X.MessageStateOf(protoimpl.Pointer(x))
		if ms.LoadMessageInfo() == nil {
			ms.StoreMessageInfo(mi)
		}
		return ms
	}
	return mi.MessageOf(x)
}

// Deprecated: Use PatchCardReq.ProtoReflect.Descriptor instead.
func (*PatchCardReq) Descriptor() ([]byte, []int) {
	return file_focus_proto_rawDescGZIP(), []int{6}
}

func (x *PatchCardReq) GetFields() []CardField {
	if x != nil {
		return x.Fields
	}
	return nil
}

func (x *PatchCardReq) GetCard() *Card {
	if x != nil {
		return x.Card
	}
	return nil
}

var File_focus_proto protoreflect.FileDescriptor

var file_focus_proto_rawDesc = []byte{
	0x0a, 0x0b, 0x66, 0x6f, 0x63, 0x75, 0x73, 0x2e, 0x70, 0x72, 0x6f, 0x74, 0x6f, 0x1a, 0x1e, 0x67,
	0x6f, 0x6f, 0x67, 0x6c, 0x65, 0x2f, 0x70, 0x72, 0x6f, 0x74, 0x6f, 0x62, 0x75, 0x66, 0x2f, 0x77,
	0x72, 0x61, 0x70, 0x70, 0x65, 0x72, 0x73, 0x2e, 0x70, 0x72, 0x6f, 0x74, 0x6f, 0x1a, 0x1b, 0x67,
	0x6f, 0x6f, 0x67, 0x6c, 0x65, 0x2f, 0x70, 0x72, 0x6f, 0x74, 0x6f, 0x62, 0x75, 0x66, 0x2f, 0x65,
	0x6d, 0x70, 0x74, 0x79, 0x2e, 0x70, 0x72, 0x6f, 0x74, 0x6f, 0x1a, 0x1f, 0x67, 0x6f, 0x6f, 0x67,
	0x6c, 0x65, 0x2f, 0x70, 0x72, 0x6f, 0x74, 0x6f, 0x62, 0x75, 0x66, 0x2f, 0x74, 0x69, 0x6d, 0x65,
	0x73, 0x74, 0x61, 0x6d, 0x70, 0x2e, 0x70, 0x72, 0x6f, 0x74, 0x6f, 0x22, 0xf2, 0x02, 0x0a, 0x04,
	0x43, 0x61, 0x72, 0x64, 0x12, 0x17, 0x0a, 0x07, 0x63, 0x61, 0x72, 0x64, 0x5f, 0x6e, 0x6f, 0x18,
	0x01, 0x20, 0x01, 0x28, 0x04, 0x52, 0x06, 0x63, 0x61, 0x72, 0x64, 0x4e, 0x6f, 0x12, 0x29, 0x0a,
	0x0e, 0x70, 0x61, 0x72, 0x65, 0x6e, 0x74, 0x5f, 0x63, 0x61, 0x72, 0x64, 0x5f, 0x6e, 0x6f, 0x18,
	0x02, 0x20, 0x01, 0x28, 0x04, 0x48, 0x00, 0x52, 0x0c, 0x70, 0x61, 0x72, 0x65, 0x6e, 0x74, 0x43,
	0x61, 0x72, 0x64, 0x4e, 0x6f, 0x88, 0x01, 0x01, 0x12, 0x14, 0x0a, 0x05, 0x64, 0x65, 0x70, 0x74,
	0x68, 0x18, 0x03, 0x20, 0x01, 0x28, 0x0d, 0x52, 0x05, 0x64, 0x65, 0x70, 0x74, 0x68, 0x12, 0x39,
	0x0a, 0x0a, 0x63, 0x72, 0x65, 0x61, 0x74, 0x65, 0x64, 0x5f, 0x61, 0x74, 0x18, 0x04, 0x20, 0x01,
	0x28, 0x0b, 0x32, 0x1a, 0x2e, 0x67, 0x6f, 0x6f, 0x67, 0x6c, 0x65, 0x2e, 0x70, 0x72, 0x6f, 0x74,
	0x6f, 0x62, 0x75, 0x66, 0x2e, 0x54, 0x69, 0x6d, 0x65, 0x73, 0x74, 0x61, 0x6d, 0x70, 0x52, 0x09,
	0x63, 0x72, 0x65, 0x61, 0x74, 0x65, 0x64, 0x41, 0x74, 0x12, 0x39, 0x0a, 0x0a, 0x75, 0x70, 0x64,
	0x61, 0x74, 0x65, 0x64, 0x5f, 0x61, 0x74, 0x18, 0x05, 0x20, 0x01, 0x28, 0x0b, 0x32, 0x1a, 0x2e,
	0x67, 0x6f, 0x6f, 0x67, 0x6c, 0x65, 0x2e, 0x70, 0x72, 0x6f, 0x74, 0x6f, 0x62, 0x75, 0x66, 0x2e,
	0x54, 0x69, 0x6d, 0x65, 0x73, 0x74, 0x61, 0x6d, 0x70, 0x52, 0x09, 0x75, 0x70, 0x64, 0x61, 0x74,
	0x65, 0x64, 0x41, 0x74, 0x12, 0x42, 0x0a, 0x0c, 0x63, 0x6f, 0x6d, 0x70, 0x6c, 0x65, 0x74, 0x65,
	0x64, 0x5f, 0x61, 0x74, 0x18, 0x06, 0x20, 0x01, 0x28, 0x0b, 0x32, 0x1a, 0x2e, 0x67, 0x6f, 0x6f,
	0x67, 0x6c, 0x65, 0x2e, 0x70, 0x72, 0x6f, 0x74, 0x6f, 0x62, 0x75, 0x66, 0x2e, 0x54, 0x69, 0x6d,
	0x65, 0x73, 0x74, 0x61, 0x6d, 0x70, 0x48, 0x01, 0x52, 0x0b, 0x63, 0x6f, 0x6d, 0x70, 0x6c, 0x65,
	0x74, 0x65, 0x64, 0x41, 0x74, 0x88, 0x01, 0x01, 0x12, 0x18, 0x0a, 0x07, 0x73, 0x75, 0x62, 0x6a,
	0x65, 0x63, 0x74, 0x18, 0x07, 0x20, 0x01, 0x28, 0x09, 0x52, 0x07, 0x73, 0x75, 0x62, 0x6a, 0x65,
	0x63, 0x74, 0x12, 0x18, 0x0a, 0x07, 0x63, 0x6f, 0x6e, 0x74, 0x65, 0x6e, 0x74, 0x18, 0x08, 0x20,
	0x01, 0x28, 0x09, 0x52, 0x07, 0x63, 0x6f, 0x6e, 0x74, 0x65, 0x6e, 0x74, 0x42, 0x11, 0x0a, 0x0f,
	0x5f, 0x70, 0x61, 0x72, 0x65, 0x6e, 0x74, 0x5f, 0x63, 0x61, 0x72, 0x64, 0x5f, 0x6e, 0x6f, 0x42,
	0x0f, 0x0a, 0x0d, 0x5f, 0x63, 0x6f, 0x6d, 0x70, 0x6c, 0x65, 0x74, 0x65, 0x64, 0x5f, 0x61, 0x74,
	0x22, 0x69, 0x0a, 0x0b, 0x4c, 0x69, 0x73, 0x74, 0x43, 0x61, 0x72, 0x64, 0x52, 0x65, 0x71, 0x12,
	0x2b, 0x0a, 0x11, 0x65, 0x78, 0x63, 0x6c, 0x75, 0x64, 0x65, 0x5f, 0x63, 0x6f, 0x6d, 0x70, 0x6c,
	0x65, 0x74, 0x65, 0x64, 0x18, 0x01, 0x20, 0x01, 0x28, 0x08, 0x52, 0x10, 0x65, 0x78, 0x63, 0x6c,
	0x75, 0x64, 0x65, 0x43, 0x6f, 0x6d, 0x70, 0x6c, 0x65, 0x74, 0x65, 0x64, 0x12, 0x2d, 0x0a, 0x12,
	0x65, 0x78, 0x63, 0x6c, 0x75, 0x64, 0x65, 0x5f, 0x63, 0x68, 0x61, 0x6c, 0x6c, 0x65, 0x6e, 0x67,
	0x65, 0x73, 0x18, 0x02, 0x20, 0x01, 0x28, 0x08, 0x52, 0x11, 0x65, 0x78, 0x63, 0x6c, 0x75, 0x64,
	0x65, 0x43, 0x68, 0x61, 0x6c, 0x6c, 0x65, 0x6e, 0x67, 0x65, 0x73, 0x22, 0x2b, 0x0a, 0x0c, 0x4c,
	0x69, 0x73, 0x74, 0x43, 0x61, 0x72, 0x64, 0x52, 0x65, 0x73, 0x70, 0x12, 0x1b, 0x0a, 0x05, 0x69,
	0x74, 0x65, 0x6d, 0x73, 0x18, 0x01, 0x20, 0x03, 0x28, 0x0b, 0x32, 0x05, 0x2e, 0x43, 0x61, 0x72,
	0x64, 0x52, 0x05, 0x69, 0x74, 0x65, 0x6d, 0x73, 0x22, 0x27, 0x0a, 0x0a, 0x47, 0x65, 0x74, 0x43,
	0x61, 0x72, 0x64, 0x52, 0x65, 0x71, 0x12, 0x19, 0x0a, 0x08, 0x63, 0x61, 0x72, 0x64, 0x5f, 0x6e,
	0x6f, 0x73, 0x18, 0x01, 0x20, 0x03, 0x28, 0x04, 0x52, 0x07, 0x63, 0x61, 0x72, 0x64, 0x4e, 0x6f,
	0x73, 0x22, 0x7d, 0x0a, 0x0b, 0x47, 0x65, 0x74, 0x43, 0x61, 0x72, 0x64, 0x52, 0x65, 0x73, 0x70,
	0x12, 0x2d, 0x0a, 0x05, 0x69, 0x74, 0x65, 0x6d, 0x73, 0x18, 0x01, 0x20, 0x03, 0x28, 0x0b, 0x32,
	0x17, 0x2e, 0x47, 0x65, 0x74, 0x43, 0x61, 0x72, 0x64, 0x52, 0x65, 0x73, 0x70, 0x2e, 0x49, 0x74,
	0x65, 0x6d, 0x73, 0x45, 0x6e, 0x74, 0x72, 0x79, 0x52, 0x05, 0x69, 0x74, 0x65, 0x6d, 0x73, 0x1a,
	0x3f, 0x0a, 0x0a, 0x49, 0x74, 0x65, 0x6d, 0x73, 0x45, 0x6e, 0x74, 0x72, 0x79, 0x12, 0x10, 0x0a,
	0x03, 0x6b, 0x65, 0x79, 0x18, 0x01, 0x20, 0x01, 0x28, 0x04, 0x52, 0x03, 0x6b, 0x65, 0x79, 0x12,
	0x1b, 0x0a, 0x05, 0x76, 0x61, 0x6c, 0x75, 0x65, 0x18, 0x02, 0x20, 0x01, 0x28, 0x0b, 0x32, 0x05,
	0x2e, 0x43, 0x61, 0x72, 0x64, 0x52, 0x05, 0x76, 0x61, 0x6c, 0x75, 0x65, 0x3a, 0x02, 0x38, 0x01,
	0x22, 0x4c, 0x0a, 0x0b, 0x52, 0x61, 0x6e, 0x6b, 0x43, 0x61, 0x72, 0x64, 0x52, 0x65, 0x71, 0x12,
	0x17, 0x0a, 0x07, 0x63, 0x61, 0x72, 0x64, 0x5f, 0x6e, 0x6f, 0x18, 0x01, 0x20, 0x01, 0x28, 0x04,
	0x52, 0x06, 0x63, 0x61, 0x72, 0x64, 0x4e, 0x6f, 0x12, 0x24, 0x0a, 0x0e, 0x74, 0x61, 0x72, 0x67,
	0x65, 0x74, 0x5f, 0x63, 0x61, 0x72, 0x64, 0x5f, 0x6e, 0x6f, 0x18, 0x02, 0x20, 0x01, 0x28, 0x04,
	0x52, 0x0c, 0x74, 0x61, 0x72, 0x67, 0x65, 0x74, 0x43, 0x61, 0x72, 0x64, 0x4e, 0x6f, 0x22, 0x4d,
	0x0a, 0x0c, 0x50, 0x61, 0x74, 0x63, 0x68, 0x43, 0x61, 0x72, 0x64, 0x52, 0x65, 0x71, 0x12, 0x22,
	0x0a, 0x06, 0x66, 0x69, 0x65, 0x6c, 0x64, 0x73, 0x18, 0x01, 0x20, 0x03, 0x28, 0x0e, 0x32, 0x0a,
	0x2e, 0x43, 0x61, 0x72, 0x64, 0x46, 0x69, 0x65, 0x6c, 0x64, 0x52, 0x06, 0x66, 0x69, 0x65, 0x6c,
	0x64, 0x73, 0x12, 0x19, 0x0a, 0x04, 0x63, 0x61, 0x72, 0x64, 0x18, 0x02, 0x20, 0x01, 0x28, 0x0b,
	0x32, 0x05, 0x2e, 0x43, 0x61, 0x72, 0x64, 0x52, 0x04, 0x63, 0x61, 0x72, 0x64, 0x2a, 0x37, 0x0a,
	0x09, 0x43, 0x61, 0x72, 0x64, 0x46, 0x69, 0x65, 0x6c, 0x64, 0x12, 0x0b, 0x0a, 0x07, 0x53, 0x55,
	0x42, 0x4a, 0x45, 0x43, 0x54, 0x10, 0x00, 0x12, 0x10, 0x0a, 0x0c, 0x43, 0x4f, 0x4d, 0x50, 0x4c,
	0x45, 0x54, 0x45, 0x44, 0x5f, 0x41, 0x54, 0x10, 0x01, 0x12, 0x0b, 0x0a, 0x07, 0x43, 0x4f, 0x4e,
	0x54, 0x45, 0x4e, 0x54, 0x10, 0x02, 0x32, 0x07, 0x0a, 0x05, 0x46, 0x6f, 0x63, 0x75, 0x73, 0x32,
	0xaa, 0x03, 0x0a, 0x08, 0x56, 0x31, 0x41, 0x6c, 0x70, 0x68, 0x61, 0x31, 0x12, 0x41, 0x0a, 0x07,
	0x76, 0x65, 0x72, 0x73, 0x69, 0x6f, 0x6e, 0x12, 0x16, 0x2e, 0x67, 0x6f, 0x6f, 0x67, 0x6c, 0x65,
	0x2e, 0x70, 0x72, 0x6f, 0x74, 0x6f, 0x62, 0x75, 0x66, 0x2e, 0x45, 0x6d, 0x70, 0x74, 0x79, 0x1a,
	0x1c, 0x2e, 0x67, 0x6f, 0x6f, 0x67, 0x6c, 0x65, 0x2e, 0x70, 0x72, 0x6f, 0x74, 0x6f, 0x62, 0x75,
	0x66, 0x2e, 0x53, 0x74, 0x72, 0x69, 0x6e, 0x67, 0x56, 0x61, 0x6c, 0x75, 0x65, 0x22, 0x00, 0x12,
	0x33, 0x0a, 0x0c, 0x71, 0x75, 0x69, 0x63, 0x6b, 0x41, 0x64, 0x64, 0x43, 0x61, 0x72, 0x64, 0x12,
	0x1c, 0x2e, 0x67, 0x6f, 0x6f, 0x67, 0x6c, 0x65, 0x2e, 0x70, 0x72, 0x6f, 0x74, 0x6f, 0x62, 0x75,
	0x66, 0x2e, 0x53, 0x74, 0x72, 0x69, 0x6e, 0x67, 0x56, 0x61, 0x6c, 0x75, 0x65, 0x1a, 0x05, 0x2e,
	0x43, 0x61, 0x72, 0x64, 0x12, 0x2a, 0x0a, 0x09, 0x6c, 0x69, 0x73, 0x74, 0x43, 0x61, 0x72, 0x64,
	0x73, 0x12, 0x0c, 0x2e, 0x4c, 0x69, 0x73, 0x74, 0x43, 0x61, 0x72, 0x64, 0x52, 0x65, 0x71, 0x1a,
	0x0d, 0x2e, 0x4c, 0x69, 0x73, 0x74, 0x43, 0x61, 0x72, 0x64, 0x52, 0x65, 0x73, 0x70, 0x22, 0x00,
	0x12, 0x30, 0x0a, 0x07, 0x67, 0x65, 0x74, 0x43, 0x61, 0x72, 0x64, 0x12, 0x1c, 0x2e, 0x67, 0x6f,
	0x6f, 0x67, 0x6c, 0x65, 0x2e, 0x70, 0x72, 0x6f, 0x74, 0x6f, 0x62, 0x75, 0x66, 0x2e, 0x55, 0x49,
	0x6e, 0x74, 0x36, 0x34, 0x56, 0x61, 0x6c, 0x75, 0x65, 0x1a, 0x05, 0x2e, 0x43, 0x61, 0x72, 0x64,
	0x22, 0x00, 0x12, 0x27, 0x0a, 0x08, 0x67, 0x65, 0x74, 0x43, 0x61, 0x72, 0x64, 0x73, 0x12, 0x0b,
	0x2e, 0x47, 0x65, 0x74, 0x43, 0x61, 0x72, 0x64, 0x52, 0x65, 0x71, 0x1a, 0x0c, 0x2e, 0x47, 0x65,
	0x74, 0x43, 0x61, 0x72, 0x64, 0x52, 0x65, 0x73, 0x70, 0x22, 0x00, 0x12, 0x23, 0x0a, 0x09, 0x70,
	0x61, 0x74, 0x63, 0x68, 0x43, 0x61, 0x72, 0x64, 0x12, 0x0d, 0x2e, 0x50, 0x61, 0x74, 0x63, 0x68,
	0x43, 0x61, 0x72, 0x64, 0x52, 0x65, 0x71, 0x1a, 0x05, 0x2e, 0x43, 0x61, 0x72, 0x64, 0x22, 0x00,
	0x12, 0x34, 0x0a, 0x0a, 0x72, 0x65, 0x72, 0x61, 0x6e, 0x6b, 0x43, 0x61, 0x72, 0x64, 0x12, 0x0c,
	0x2e, 0x52, 0x61, 0x6e, 0x6b, 0x43, 0x61, 0x72, 0x64, 0x52, 0x65, 0x71, 0x1a, 0x16, 0x2e, 0x67,
	0x6f, 0x6f, 0x67, 0x6c, 0x65, 0x2e, 0x70, 0x72, 0x6f, 0x74, 0x6f, 0x62, 0x75, 0x66, 0x2e, 0x45,
	0x6d, 0x70, 0x74, 0x79, 0x22, 0x00, 0x12, 0x44, 0x0a, 0x0a, 0x64, 0x65, 0x6c, 0x65, 0x74, 0x65,
	0x43, 0x61, 0x72, 0x64, 0x12, 0x1c, 0x2e, 0x67, 0x6f, 0x6f, 0x67, 0x6c, 0x65, 0x2e, 0x70, 0x72,
	0x6f, 0x74, 0x6f, 0x62, 0x75, 0x66, 0x2e, 0x55, 0x49, 0x6e, 0x74, 0x36, 0x34, 0x56, 0x61, 0x6c,
	0x75, 0x65, 0x1a, 0x16, 0x2e, 0x67, 0x6f, 0x6f, 0x67, 0x6c, 0x65, 0x2e, 0x70, 0x72, 0x6f, 0x74,
	0x6f, 0x62, 0x75, 0x66, 0x2e, 0x45, 0x6d, 0x70, 0x74, 0x79, 0x22, 0x00, 0x42, 0x1f, 0x5a, 0x1d,
	0x67, 0x69, 0x74, 0x68, 0x75, 0x62, 0x2e, 0x63, 0x6f, 0x6d, 0x2f, 0x67, 0x72, 0x65, 0x6b, 0x63,
	0x79, 0x2f, 0x66, 0x6f, 0x63, 0x75, 0x73, 0x2f, 0x70, 0x72, 0x6f, 0x74, 0x6f, 0x62, 0x06, 0x70,
	0x72, 0x6f, 0x74, 0x6f, 0x33,
}

var (
	file_focus_proto_rawDescOnce sync.Once
	file_focus_proto_rawDescData = file_focus_proto_rawDesc
)

func file_focus_proto_rawDescGZIP() []byte {
	file_focus_proto_rawDescOnce.Do(func() {
		file_focus_proto_rawDescData = protoimpl.X.CompressGZIP(file_focus_proto_rawDescData)
	})
	return file_focus_proto_rawDescData
}

var file_focus_proto_enumTypes = make([]protoimpl.EnumInfo, 1)
var file_focus_proto_msgTypes = make([]protoimpl.MessageInfo, 8)
var file_focus_proto_goTypes = []interface{}{
	(CardField)(0),                 // 0: CardField
	(*Card)(nil),                   // 1: Card
	(*ListCardReq)(nil),            // 2: ListCardReq
	(*ListCardResp)(nil),           // 3: ListCardResp
	(*GetCardReq)(nil),             // 4: GetCardReq
	(*GetCardResp)(nil),            // 5: GetCardResp
	(*RankCardReq)(nil),            // 6: RankCardReq
	(*PatchCardReq)(nil),           // 7: PatchCardReq
	nil,                            // 8: GetCardResp.ItemsEntry
	(*timestamppb.Timestamp)(nil),  // 9: google.protobuf.Timestamp
	(*emptypb.Empty)(nil),          // 10: google.protobuf.Empty
	(*wrapperspb.StringValue)(nil), // 11: google.protobuf.StringValue
	(*wrapperspb.UInt64Value)(nil), // 12: google.protobuf.UInt64Value
}
var file_focus_proto_depIdxs = []int32{
	9,  // 0: Card.created_at:type_name -> google.protobuf.Timestamp
	9,  // 1: Card.updated_at:type_name -> google.protobuf.Timestamp
	9,  // 2: Card.completed_at:type_name -> google.protobuf.Timestamp
	1,  // 3: ListCardResp.items:type_name -> Card
	8,  // 4: GetCardResp.items:type_name -> GetCardResp.ItemsEntry
	0,  // 5: PatchCardReq.fields:type_name -> CardField
	1,  // 6: PatchCardReq.card:type_name -> Card
	1,  // 7: GetCardResp.ItemsEntry.value:type_name -> Card
	10, // 8: V1Alpha1.version:input_type -> google.protobuf.Empty
	11, // 9: V1Alpha1.quickAddCard:input_type -> google.protobuf.StringValue
	2,  // 10: V1Alpha1.listCards:input_type -> ListCardReq
	12, // 11: V1Alpha1.getCard:input_type -> google.protobuf.UInt64Value
	4,  // 12: V1Alpha1.getCards:input_type -> GetCardReq
	7,  // 13: V1Alpha1.patchCard:input_type -> PatchCardReq
	6,  // 14: V1Alpha1.rerankCard:input_type -> RankCardReq
	12, // 15: V1Alpha1.deleteCard:input_type -> google.protobuf.UInt64Value
	11, // 16: V1Alpha1.version:output_type -> google.protobuf.StringValue
	1,  // 17: V1Alpha1.quickAddCard:output_type -> Card
	3,  // 18: V1Alpha1.listCards:output_type -> ListCardResp
	1,  // 19: V1Alpha1.getCard:output_type -> Card
	5,  // 20: V1Alpha1.getCards:output_type -> GetCardResp
	1,  // 21: V1Alpha1.patchCard:output_type -> Card
	10, // 22: V1Alpha1.rerankCard:output_type -> google.protobuf.Empty
	10, // 23: V1Alpha1.deleteCard:output_type -> google.protobuf.Empty
	16, // [16:24] is the sub-list for method output_type
	8,  // [8:16] is the sub-list for method input_type
	8,  // [8:8] is the sub-list for extension type_name
	8,  // [8:8] is the sub-list for extension extendee
	0,  // [0:8] is the sub-list for field type_name
}

func init() { file_focus_proto_init() }
func file_focus_proto_init() {
	if File_focus_proto != nil {
		return
	}
	if !protoimpl.UnsafeEnabled {
		file_focus_proto_msgTypes[0].Exporter = func(v interface{}, i int) interface{} {
			switch v := v.(*Card); i {
			case 0:
				return &v.state
			case 1:
				return &v.sizeCache
			case 2:
				return &v.unknownFields
			default:
				return nil
			}
		}
		file_focus_proto_msgTypes[1].Exporter = func(v interface{}, i int) interface{} {
			switch v := v.(*ListCardReq); i {
			case 0:
				return &v.state
			case 1:
				return &v.sizeCache
			case 2:
				return &v.unknownFields
			default:
				return nil
			}
		}
		file_focus_proto_msgTypes[2].Exporter = func(v interface{}, i int) interface{} {
			switch v := v.(*ListCardResp); i {
			case 0:
				return &v.state
			case 1:
				return &v.sizeCache
			case 2:
				return &v.unknownFields
			default:
				return nil
			}
		}
		file_focus_proto_msgTypes[3].Exporter = func(v interface{}, i int) interface{} {
			switch v := v.(*GetCardReq); i {
			case 0:
				return &v.state
			case 1:
				return &v.sizeCache
			case 2:
				return &v.unknownFields
			default:
				return nil
			}
		}
		file_focus_proto_msgTypes[4].Exporter = func(v interface{}, i int) interface{} {
			switch v := v.(*GetCardResp); i {
			case 0:
				return &v.state
			case 1:
				return &v.sizeCache
			case 2:
				return &v.unknownFields
			default:
				return nil
			}
		}
		file_focus_proto_msgTypes[5].Exporter = func(v interface{}, i int) interface{} {
			switch v := v.(*RankCardReq); i {
			case 0:
				return &v.state
			case 1:
				return &v.sizeCache
			case 2:
				return &v.unknownFields
			default:
				return nil
			}
		}
		file_focus_proto_msgTypes[6].Exporter = func(v interface{}, i int) interface{} {
			switch v := v.(*PatchCardReq); i {
			case 0:
				return &v.state
			case 1:
				return &v.sizeCache
			case 2:
				return &v.unknownFields
			default:
				return nil
			}
		}
	}
	file_focus_proto_msgTypes[0].OneofWrappers = []interface{}{}
	type x struct{}
	out := protoimpl.TypeBuilder{
		File: protoimpl.DescBuilder{
			GoPackagePath: reflect.TypeOf(x{}).PkgPath(),
			RawDescriptor: file_focus_proto_rawDesc,
			NumEnums:      1,
			NumMessages:   8,
			NumExtensions: 0,
			NumServices:   2,
		},
		GoTypes:           file_focus_proto_goTypes,
		DependencyIndexes: file_focus_proto_depIdxs,
		EnumInfos:         file_focus_proto_enumTypes,
		MessageInfos:      file_focus_proto_msgTypes,
	}.Build()
	File_focus_proto = out.File
	file_focus_proto_rawDesc = nil
	file_focus_proto_goTypes = nil
	file_focus_proto_depIdxs = nil
}
