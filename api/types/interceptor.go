package types

import "google.golang.org/grpc"

type Interceptor interface {
	UnrayInterceptor() []grpc.UnaryServerInterceptor
	StreamInterceptor() []grpc.StreamServerInterceptor
}
