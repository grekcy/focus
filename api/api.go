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
	"google.golang.org/grpc/codes"
	_ "google.golang.org/grpc/encoding/gzip"
	"google.golang.org/grpc/keepalive"
	status "google.golang.org/grpc/status"
	"gorm.io/gorm"

	"focus/config"
	"focus/databases"
	"focus/models"
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

	proto.RegisterV1Alpha1Server(g, newV1Alpha1Service(db))

	return g.Serve(ln)
}

type key string

const (
	keyDB            key = "focus.db"
	keyToken         key = "focus.token"
	keyUser          key = "focus.user"
	keyUserWorkspace key = "focus.user.workspace"
)

func authInterceptor(db *gorm.DB) func(ctx context.Context) (context.Context, error) {
	return func(ctx context.Context) (context.Context, error) {
		token, err := grpc_auth.AuthFromMD(ctx, "bearer")
		if err != nil {
			return nil, err
		}
		ctx = context.WithValue(ctx, keyToken, token)

		// tokenInfo, err := parseToken(token)
		// if err != nil {
		// 	return nil, status.Errorf(codes.Unauthenticated, "invalid auth token: %v", err)
		// }

		// grpc_ctxtags.Extract(ctx).Set("auth.sub", userClaimFromToken(tokenInfo))
		// ctx = context.WithValue(ctx, "tokenInfo", tokenInfo)

		ctx = context.WithValue(ctx, keyDB, db)
		return extractUserInfo(ctx)
	}
}

func parseToken(token string) (struct{}, error) {
	return struct{}{}, nil
}

func userClaimFromToken(struct{}) string {
	return "foobar"
}

// extractUserInfo extract user info and set to context
// context.WithValue(keyUser): *models.User; current user
// context.WithValue(keyUserWorkspace): *models.Workspace; default workspace for current user
func extractUserInfo(ctx context.Context) (context.Context, error) {
	db := ctx.Value(keyDB).(*gorm.DB)
	token := ctx.Value(keyToken).(string) // TODO use jwt token

	user := &models.User{}
	if tx := db.First(user, &models.User{Email: token}); tx.Error != nil {
		return nil, status.Error(codes.Unauthenticated, "user not found")
	}
	ctx = context.WithValue(ctx, keyUser, user)

	userWorkspace := &models.UserWorkspace{}
	if tx := db.Preload("Workspace").Where(&models.UserWorkspace{
		UserID: user.ID,
		Role:   models.RoleDefault,
	}).First(userWorkspace); tx.Error != nil {
		return nil, status.Errorf(codes.Unauthenticated, "user workspace not found: %v", tx.Error)
	}

	ctx = context.WithValue(ctx, keyUserWorkspace, userWorkspace.Workspace)

	return ctx, nil
}
