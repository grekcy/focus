package types

import "google.golang.org/grpc"

type Interceptor interface {
	GetUnrayInterceptor() []grpc.UnaryServerInterceptor
	GetStreamInterceptor() []grpc.StreamServerInterceptor
}
