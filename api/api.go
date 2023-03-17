package api

import (
	"context"
	"net"
	"time"

	grpc_middleware "github.com/grpc-ecosystem/go-grpc-middleware"
	grpc_zap "github.com/grpc-ecosystem/go-grpc-middleware/logging/zap"
	"github.com/whitekid/goxp/log"
	"google.golang.org/grpc"
	_ "google.golang.org/grpc/encoding/gzip"
	"google.golang.org/grpc/keepalive"

	"focus/config"
	"focus/databases"
	"focus/proto"
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

	g := grpc.NewServer(
		grpc.StreamInterceptor(grpc_middleware.ChainStreamServer(
			grpc_zap.StreamServerInterceptor(logger),
		)),
		grpc.KeepaliveEnforcementPolicy(kaep),
		grpc.KeepaliveParams(kasp),
	)

	db, err := databases.Open("pgsql://focus:focus-pass@localhost/focus_dev")
	if err != nil {
		return err
	}

	proto.RegisterV1Alpha1Server(g, newV1Alpha1Service(db))

	return g.Serve(ln)
}
