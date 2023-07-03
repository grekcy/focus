package v1alpha1

import (
	"bytes"
	"context"
	"net"
	"testing"
	"time"

	"github.com/stretchr/testify/require"
	"github.com/whitekid/gormx"
	"github.com/whitekid/grpcx"
	"google.golang.org/grpc"
	"google.golang.org/grpc/codes"
	"google.golang.org/grpc/credentials/insecure"
	"google.golang.org/grpc/status"
	"google.golang.org/protobuf/types/known/emptypb"
	"gopkg.in/yaml.v3"
	"gorm.io/gorm"

	"focus/databases"
	"focus/helper"
	"focus/models"
	"focus/pkg/fixtures"
	proto "focus/proto/v1alpha1"
	"focus/repository"
)

func prepareFixture(t *testing.T, fixturePath string) *gorm.DB {
	db, err := databases.Open()
	require.NoError(t, err)

	sqlDB, err := db.DB()
	require.NoError(t, err)

	require.NoError(t, models.Migrate(db))
	require.NoError(t, fixtures.Load(sqlDB, fixturePath))

	return db
}

func newTestClientWithEmail(ctx context.Context, t *testing.T, email string) (context.Context, *TestClient) {
	db, err := databases.Open()
	require.NoError(t, err)

	// get test user
	token := ""
	var user *models.User
	if email != "" {
		user, err = gormx.Get[models.User](db.Where(&models.User{Email: email}))
		require.NoError(t, err)
		require.NotEqual(t, uint(0), user.ID)

		// set user info to context to test
		ctx = context.WithValue(ctx, keyUser, user)

		ws, err := repository.UserDefaultWorkspace(db, user.ID)
		require.NoError(t, err)
		ctx = context.WithValue(ctx, keyUserWorkspace, ws)

		// generate jwt token
		token, err = signAPIKey(user.UID, time.Now().AddDate(0, 1, 0))
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

	tokenAuth := grpcx.NewTokenAuth(token)
	conn, err := grpc.DialContext(ctx, ln.Addr().String(),
		grpc.WithTransportCredentials(insecure.NewCredentials()),
		grpc.WithPerRPCCredentials(tokenAuth),
	)
	require.NoError(t, err)

	return ctx, &TestClient{
		FocusClient: proto.NewFocusClient(conn),
		tokenAuth:   tokenAuth,
		service:     service,
		db:          db,
		user:        user,
	}
}

func newTestClient(ctx context.Context, t *testing.T) (context.Context, *TestClient) {
	return newTestClientWithEmail(ctx, t, "user1@focus.app")
}

func newUnauthenticatedTestClient(ctx context.Context, t *testing.T) (context.Context, *TestClient) {
	return newTestClientWithEmail(ctx, t, "")
}

// TestClient client for test
type TestClient struct {
	proto.FocusClient
	tokenAuth *grpcx.TokenAuth
	service   *v1alpha1ServiceImpl
	db        *gorm.DB
	user      *models.User // current user
}

func (t *TestClient) SetToken(token string) { t.tokenAuth.SetToken(token) }

func TestVersion(t *testing.T) {
	ctx, cancel := context.WithCancel(context.Background())
	defer cancel()

	ctx, client := newUnauthenticatedTestClient(ctx, t)

	got, err := client.Version(ctx, &emptypb.Empty{})
	require.NoError(t, err)
	require.Equal(t, "v1alpha1", got.Value)
}

func TestVersionEx(t *testing.T) {
	ctx, cancel := context.WithCancel(context.Background())
	defer cancel()

	prepareFixture(t, "../..")

	ctx, client := newUnauthenticatedTestClient(ctx, t)

	user, err := gormx.Get[models.User](client.db.Where("email = ?", "user1@focus.app"))
	require.NoError(t, err)

	userToken, err := signAPIKey(user.UID, time.Now().Add(time.Minute))
	require.NoError(t, err)

	notExistingToken, err := signAPIKey("not-existing-uid", time.Now().Add(time.Minute))
	require.NoError(t, err)

	type args struct {
		token string
	}
	tests := [...]struct {
		name     string
		args     args
		wantCode codes.Code
	}{
		{`no auth header`, args{}, codes.Unauthenticated},
		{`invalid token`, args{token: "invalid token"}, codes.InvalidArgument},
		{`user not found`, args{token: notExistingToken}, codes.Unauthenticated},
		{`valid`, args{token: userToken}, codes.OK},
	}
	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			client.SetToken(tt.args.token)

			got, err := client.VersionEx(ctx, &emptypb.Empty{})
			if tt.wantCode == codes.OK {
				require.NoError(t, err)
				require.Equal(t, "v1alpha1.ex", got.Value)
				return
			}

			require.Error(t, err)
			e, _ := status.FromError(err)
			require.Equal(t, tt.wantCode, e.Code(), "want %v but got %v: %v", tt.wantCode.String(), e.Code(), e)
		})
	}
}

func TestYamlDump(t *testing.T) {
	type T struct {
		CompletedAt time.Time      // 2023-06-30T17:50:39.473+09:00
		TimeSpan    *time.Duration // -1s
	}

	v := &T{
		CompletedAt: time.Now().UTC().Truncate(time.Millisecond),
		TimeSpan:    helper.P[time.Duration, time.Duration](-time.Second),
	}

	buf := &bytes.Buffer{}
	require.NoError(t, yaml.NewEncoder(buf).Encode(v))
	t.Logf("buf: %v", buf.String())

	got := &T{}
	require.NoError(t, yaml.NewDecoder(buf).Decode(got))
	require.Equal(t, v.CompletedAt, got.CompletedAt)
}
