package api

import (
	"context"
	"net"
	"testing"
	"time"

	"github.com/stretchr/testify/require"
	"google.golang.org/grpc"
	"google.golang.org/grpc/credentials/insecure"
	"google.golang.org/grpc/encoding/gzip"
	"google.golang.org/grpc/keepalive"
	"google.golang.org/protobuf/types/known/emptypb"

	"focus/proto"
)

func newTestServer(ctx context.Context, t *testing.T) proto.V1Alpha1Client {
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

	conn, err := grpc.Dial(ln.Addr().String(),
		grpc.WithKeepaliveParams(kacp),
		grpc.WithTransportCredentials(insecure.NewCredentials()),
		grpc.WithCompressor(grpc.NewGZIPCompressor()), // TODO
	)
	require.NoError(t, err)

	return proto.NewV1Alpha1Client(conn)
}

func TestVersion(t *testing.T) {
	ctx, cancel := context.WithCancel(context.Background())
	defer cancel()

	client := newTestServer(ctx, t)
	v, err := client.Version(ctx, &emptypb.Empty{}, grpc.UseCompressor(gzip.Name))
	require.NoError(t, err)
	require.Equal(t, "v1alpha1", v.Value)
}

func TestQucickAdd(t *testing.T) {
	ctx, cancel := context.WithCancel(context.Background())
	defer cancel()

	client := newTestServer(ctx, t)
	got, err := client.QuickAddCard(ctx, &proto.Card{Subject: "test subject"})
	require.NoError(t, err)
	require.NotEqual(t, 0, got.No)
	require.Equal(t, "test subject", got.Subject)
	require.NotNil(t, got.CreatedAt)

	resp, err := client.ListCards(ctx, &emptypb.Empty{})
	require.NoError(t, err)
	require.NotEqual(t, 0, len(resp.Items))
	require.Equal(t, "test subject", resp.Items[0].Subject)
}
