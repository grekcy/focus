package v1alpha1

import (
	"context"
	"net"
	"testing"
	"time"

	"github.com/stretchr/testify/require"
	"google.golang.org/grpc"
	"google.golang.org/grpc/credentials/insecure"
	"google.golang.org/protobuf/types/known/emptypb"

	"focus/databases"
	"focus/models"
	proto "focus/proto/v1alpha1"
)

func newTestClientWithEmail(ctx context.Context, t *testing.T, email string) *TestClient {
	db, err := databases.Open()
	require.NoError(t, err)

	// get test user
	token := ""
	if email != "" {
		user := &models.User{Email: email}
		require.NoError(t, db.Take(&user).Error)
		require.NotEqual(t, uint(0), user.ID)

		// generate jwt token
		token, err = signAPIKey(user.Email, time.Now().AddDate(0, 1, 0))
		require.NoError(t, err)
	}

	service := New(db).(*v1alpha1ServiceImpl)

	g := grpc.NewServer(
		grpc.ChainStreamInterceptor(service.StreamInterceptor()...),
		grpc.ChainUnaryInterceptor(service.UnrayInterceptor()...),
	)

	proto.RegisterFocusServer(g, service)

	ln, err := net.Listen("tcp", "127.0.0.1:0")
	require.NoError(t, err)

	go g.Serve(ln)

	go func() {
		<-ctx.Done()
		ln.Close()
	}()

	tokenAuth := &TokenAuth{token: token}
	conn, err := grpc.DialContext(ctx, ln.Addr().String(),
		grpc.WithTransportCredentials(insecure.NewCredentials()),
		grpc.WithPerRPCCredentials(tokenAuth),
	)
	require.NoError(t, err)

	return &TestClient{
		FocusClient: proto.NewFocusClient(conn),
		tokenAuth:   tokenAuth,
		service:     service,
	}
}

func newTestClient(ctx context.Context, t *testing.T) *TestClient {
	return newTestClientWithEmail(ctx, t, "whitekid@gmail.com")
}

func newUnauthenticatedTestClient(ctx context.Context, t *testing.T) *TestClient {
	return newTestClientWithEmail(ctx, t, "")
}

// TestClient client for test
type TestClient struct {
	proto.FocusClient
	tokenAuth *TokenAuth
	service   *v1alpha1ServiceImpl
}

func (t *TestClient) SetToken(token string) { t.tokenAuth.token = token }

func TestVersion(t *testing.T) {
	ctx, cancel := context.WithCancel(context.Background())
	defer cancel()

	// TODO 맘에 안드네...
	client := newUnauthenticatedTestClient(ctx, t)

	// need no authentication
	{
		got, err := client.Version(context.Background(), &emptypb.Empty{})
		require.NoError(t, err)
		require.Equal(t, "v1alpha1", got.Value)
	}

	// need authentication
	token, err := signAPIKey("whitekid@gmail.com", time.Now().Add(30*time.Minute))
	require.NoError(t, err)
	client.SetToken(token)
	{
		got, err := client.VersionEx(context.Background(), &emptypb.Empty{})
		require.NoError(t, err)
		require.Equal(t, "v1alpha1.ex", got.Value)
	}
}

type TokenAuth struct {
	token string
}

func (t *TokenAuth) GetRequestMetadata(ctx context.Context, in ...string) (map[string]string, error) {
	metadata := map[string]string{}
	if t.token != "" {
		metadata["Authorization"] = "Bearer " + t.token
	}

	return metadata, nil
}

func (t *TokenAuth) RequireTransportSecurity() bool {
	return false
}
