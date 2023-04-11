package api

import (
	"context"
	"net"
	"time"

	grpc_zap "github.com/grpc-ecosystem/go-grpc-middleware/logging/zap"
	"github.com/whitekid/goxp/log"
	"google.golang.org/grpc"
	_ "google.golang.org/grpc/encoding/gzip"
	"google.golang.org/grpc/keepalive"

	"focus/api/types"
	"focus/api/v1alpha1"
	"focus/api/v1alpha2"
	"focus/config"
	"focus/databases"
	proto_v1alpha1 "focus/proto/v1alpha1"
	proto_v1alpha2 "focus/proto/v1alpha2"
)

// Serve serve grpc service with block
func Serve(ctx context.Context, ln net.Listener) error {
	ownListener := true
	if ln == nil {
		var err error

		log.Infof("listening %v...", config.ApiServerBindAddr())
		ln, err = net.Listen("tcp", config.ApiServerBindAddr())
		if err != nil {
			return err
		}
		ownListener = false
	}

	if ownListener {
		go func() {
			<-ctx.Done()
			ln.Close()
		}()
	}

	var kaep = keepalive.EnforcementPolicy{
		MinTime:             5 * time.Second, // If a client pings more than once every 5 seconds, terminate the connection
		PermitWithoutStream: true,            // Allow pings even when there are no active streams
	}

	var kasp = keepalive.ServerParameters{
		Time:    5 * time.Second, // Ping the client if it is idle for 5 seconds to ensure the connection is still active
		Timeout: time.Second,     // Wait 1 second for the ping ack before assuming the connection is dead
	}

	logger := log.Zap(log.New())

	db, err := databases.Open()
	if err != nil {
		return err
	}

	opts := []grpc.ServerOption{
		grpc.KeepaliveEnforcementPolicy(kaep),
		grpc.KeepaliveParams(kasp),
	}

	// NOTE interceptor는 한번만 설정 가능
	unaryInterceptors := []grpc.UnaryServerInterceptor{
		grpc_zap.UnaryServerInterceptor(logger),
	}

	streamInterceptors := []grpc.StreamServerInterceptor{
		grpc_zap.StreamServerInterceptor(logger),
	}

	v1alpha1Svc := v1alpha1.New(db)
	v1alpha2Svc := v1alpha2.New(db)

	for _, intf := range []any{v1alpha1Svc, v1alpha2Svc} {
		if v, ok := intf.(types.Interceptor); ok {
			unaryInterceptors = append(unaryInterceptors, v.GetUnrayInterceptor()...)
			streamInterceptors = append(streamInterceptors, v.GetStreamInterceptor()...)
		}
	}

	opts = append(opts, grpc.ChainUnaryInterceptor(unaryInterceptors...))
	opts = append(opts, grpc.ChainStreamInterceptor(streamInterceptors...))

	g := grpc.NewServer(opts...)
	proto_v1alpha1.RegisterFocusServer(g, v1alpha1Svc)
	proto_v1alpha2.RegisterFocusServer(g, v1alpha2Svc)

	return g.Serve(ln)
}
