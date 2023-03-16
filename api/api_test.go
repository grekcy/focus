package api

import (
	"context"
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

func TestVersion(t *testing.T) {
	ctx, cancel := context.WithCancel(context.Background())
	defer cancel()

	go func() { Serve(ctx) }()

	addr := "127.0.0.1:8888"

	var kacp = keepalive.ClientParameters{
		Time:                10 * time.Second, // send pings every 10 seconds if there is no activity
		Timeout:             time.Second,      // wait 1 second for ping ack before considering the connection dead
		PermitWithoutStream: true,             // send pings even without active streams
	}

	conn, err := grpc.Dial(addr,
		grpc.WithTransportCredentials(insecure.NewCredentials()),
		grpc.WithKeepaliveParams(kacp),
	)
	require.NoError(t, err)

	v1alpha1 := proto.NewV1Alpha1Client(conn)
	v, err := v1alpha1.Version(ctx, &emptypb.Empty{}, grpc.UseCompressor(gzip.Name))
	require.NoError(t, err)
	require.Equal(t, "v1alpha1", v.Value)
}
