package api

import (
	"context"
	"fmt"
	"net"
	"time"

	grpc_auth "github.com/grpc-ecosystem/go-grpc-middleware/auth"
	grpc_zap "github.com/grpc-ecosystem/go-grpc-middleware/logging/zap"
	"github.com/whitekid/goxp/log"
	"google.golang.org/grpc"
	_ "google.golang.org/grpc/encoding/gzip"
	"google.golang.org/grpc/keepalive"
	"gorm.io/gorm"

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

	db, err := databases.Open(fmt.Sprintf("pgsql://%s:%s@%s/%s", config.DBUser(), config.DBPassword(), config.DBHostname(), config.DBName()))
	if err != nil {
		return err
	}

	g := grpc.NewServer(
		grpc.KeepaliveEnforcementPolicy(kaep),
		grpc.KeepaliveParams(kasp),
		grpc.StreamInterceptor(grpc_zap.StreamServerInterceptor(logger)),
		grpc.UnaryInterceptor(grpc_auth.UnaryServerInterceptor(authInterceptor(db))),
	)

	proto_v1alpha1.RegisterFocusServer(g, v1alpha1.New(db))
	proto_v1alpha2.RegisterFocusServer(g, v1alpha2.New(db))

	return g.Serve(ln)
}

func authInterceptor(db *gorm.DB) func(ctx context.Context) (context.Context, error) {
	return func(ctx context.Context) (context.Context, error) {
		token, err := grpc_auth.AuthFromMD(ctx, "bearer")
		if err != nil {
			return nil, err
		}
		ctx = context.WithValue(ctx, v1alpha1.KeyToken, token)

		// tokenInfo, err := parseToken(token)
		// if err != nil {
		// 	return nil, status.Errorf(codes.Unauthenticated, "invalid auth token: %v", err)
		// }

		// grpc_ctxtags.Extract(ctx).Set("auth.sub", userClaimFromToken(tokenInfo))
		// ctx = context.WithValue(ctx, "tokenInfo", tokenInfo)

		ctx = context.WithValue(ctx, v1alpha1.KeyDB, db)
		return v1alpha1.ExtractUserInfo(ctx)
	}
}

func parseToken(token string) (struct{}, error) {
	return struct{}{}, nil
}

func userClaimFromToken(struct{}) string {
	return "foobar"
}
