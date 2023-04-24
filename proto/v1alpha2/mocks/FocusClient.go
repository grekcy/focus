// Code generated by mockery v2.25.0. DO NOT EDIT.

package mocks

import (
	context "context"

	grpc "google.golang.org/grpc"
	emptypb "google.golang.org/protobuf/types/known/emptypb"

	mock "github.com/stretchr/testify/mock"

	wrapperspb "google.golang.org/protobuf/types/known/wrapperspb"
)

// FocusClient is an autogenerated mock type for the FocusClient type
type FocusClient struct {
	mock.Mock
}

// Version provides a mock function with given fields: ctx, in, opts
func (_m *FocusClient) Version(ctx context.Context, in *emptypb.Empty, opts ...grpc.CallOption) (*wrapperspb.StringValue, error) {
	_va := make([]interface{}, len(opts))
	for _i := range opts {
		_va[_i] = opts[_i]
	}
	var _ca []interface{}
	_ca = append(_ca, ctx, in)
	_ca = append(_ca, _va...)
	ret := _m.Called(_ca...)

	var r0 *wrapperspb.StringValue
	var r1 error
	if rf, ok := ret.Get(0).(func(context.Context, *emptypb.Empty, ...grpc.CallOption) (*wrapperspb.StringValue, error)); ok {
		return rf(ctx, in, opts...)
	}
	if rf, ok := ret.Get(0).(func(context.Context, *emptypb.Empty, ...grpc.CallOption) *wrapperspb.StringValue); ok {
		r0 = rf(ctx, in, opts...)
	} else {
		if ret.Get(0) != nil {
			r0 = ret.Get(0).(*wrapperspb.StringValue)
		}
	}

	if rf, ok := ret.Get(1).(func(context.Context, *emptypb.Empty, ...grpc.CallOption) error); ok {
		r1 = rf(ctx, in, opts...)
	} else {
		r1 = ret.Error(1)
	}

	return r0, r1
}

type mockConstructorTestingTNewFocusClient interface {
	mock.TestingT
	Cleanup(func())
}

// NewFocusClient creates a new instance of FocusClient. It also registers a testing interface on the mock and a cleanup function to assert the mocks expectations.
func NewFocusClient(t mockConstructorTestingTNewFocusClient) *FocusClient {
	mock := &FocusClient{}
	mock.Mock.Test(t)

	t.Cleanup(func() { mock.AssertExpectations(t) })

	return mock
}
