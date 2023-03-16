package api

import (
	"context"
	"net"
	"time"

	"github.com/whitekid/goxp/log"
	"google.golang.org/grpc"
	_ "google.golang.org/grpc/encoding/gzip"
	"google.golang.org/grpc/keepalive"

	"focus/config"
	"focus/proto"
)

func Serve(ctx context.Context) error {
	log.Infof("listening %v...", config.ApiServerBindAddr())

	ln, err := net.Listen("tcp", config.ApiServerBindAddr())
	if err != nil {
		return err
	}

	go func() {
		<-ctx.Done()
		ln.Close()
	}()

	var kaep = keepalive.EnforcementPolicy{
		MinTime:             5 * time.Second, // If a client pings more than once every 5 seconds, terminate the connection
		PermitWithoutStream: true,            // Allow pings even when there are no active streams
	}

	var kasp = keepalive.ServerParameters{
		Time:    5 * time.Second, // Ping the client if it is idle for 5 seconds to ensure the connection is still active
		Timeout: time.Second,     // Wait 1 second for the ping ack before assuming the connection is dead
	}

	g := grpc.NewServer(
		grpc.KeepaliveEnforcementPolicy(kaep),
		grpc.KeepaliveParams(kasp),
	)

	proto.RegisterV1Alpha1Server(g, newV1Alpha1Service())

	return g.Serve(ln)
}
