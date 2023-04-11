package api

import (
	"context"
	"net"
	"testing"
	"time"

	"github.com/stretchr/testify/require"
	"google.golang.org/grpc"
	"google.golang.org/grpc/credentials/insecure"
	"google.golang.org/grpc/keepalive"
	"google.golang.org/protobuf/types/known/emptypb"

	proto "focus/proto/v1alpha1"
)

func newTestServer(ctx context.Context, t *testing.T) proto.FocusClient {
	ln, err := net.Listen("tcp", "127.0.0.1:0")
	require.NoError(t, err)

	go func() {
		<-ctx.Done()
		ln.Close()
	}()

	go func() { Serve(ctx, ln) }()

	var kacp = keepalive.ClientParameters{
		Time:                10 * time.Second, // send pings every 10 seconds if there is no activity
		Timeout:             time.Second,      // wait 1 second for ping ack before considering the connection dead
		PermitWithoutStream: true,             // send pings even without active streams
	}

	conn, err := grpc.DialContext(ctx, ln.Addr().String(),
		grpc.WithKeepaliveParams(kacp),
		grpc.WithTransportCredentials(insecure.NewCredentials()),
		grpc.WithPerRPCCredentials(&TokenAuth{token: "sample_token"}),
	)
	require.NoError(t, err)

	return proto.NewFocusClient(conn)
}

type TokenAuth struct {
	token string
}

func (t *TokenAuth) GetRequestMetadata(ctx context.Context, in ...string) (map[string]string, error) {
	return map[string]string{
		"Authorization": "Bearer " + t.token,
	}, nil
}

func (t *TokenAuth) RequireTransportSecurity() bool {
	return false
}

func TestVersion(t *testing.T) {
	ctx, cancel := context.WithCancel(context.Background())
	defer cancel()

	client := newTestServer(ctx, t)
	v, err := client.Version(ctx, &emptypb.Empty{})
	require.NoError(t, err)
	require.Equal(t, "v1alpha1", v.Value)
}
