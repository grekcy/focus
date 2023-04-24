package sample

import (
	"context"
	"crypto/rand"
	"crypto/tls"
	"crypto/x509"
	"crypto/x509/pkix"
	"fmt"
	"math/big"
	"net"
	"testing"
	"time"

	"github.com/stretchr/testify/require"
	"github.com/whitekid/x509x"
	"google.golang.org/grpc"
	"google.golang.org/grpc/credentials"
	"google.golang.org/protobuf/types/known/wrapperspb"

	proto "focus/proto/sample/v1alpha1"
)

// generateKeyPair generate certificate and returns cert and private key as PEM format
func generateKeyPair(t *testing.T, commonName string, ipAddr string) ([]byte, []byte) {
	privKey, err := x509x.GenerateKey(x509.ECDSAWithSHA512)
	require.NoError(t, err)

	template := &x509.Certificate{
		SerialNumber: big.NewInt(1),
		Subject:      pkix.Name{CommonName: commonName},
		NotAfter:     time.Now().Add(30 * time.Minute),
		IPAddresses:  []net.IP{net.ParseIP(ipAddr)},
	}

	derBytes, err := x509.CreateCertificate(rand.Reader, template, template, privKey.Public(), privKey)
	require.NoError(t, err)

	certPEM := x509x.EncodeCertificateToPEM(derBytes)
	privKeyPEM, err := x509x.EncodePrivateKeyToPEM(privKey)
	require.NoError(t, err)

	return certPEM, privKeyPEM
}

func serve(ctx context.Context, ln net.Listener, opt ...grpc.ServerOption) {
	g := grpc.NewServer(opt...)
	proto.RegisterSampleServer(g, New())

	go func() {
		<-ctx.Done()
		ln.Close()
	}()

	go g.Serve(ln)
}

func testEcho(ctx context.Context, t *testing.T, conn *grpc.ClientConn) {
	client := proto.NewSampleClient(conn)
	resp, err := client.Echo(ctx, wrapperspb.String("hello"))
	require.NoError(t, err)
	require.Equal(t, "hello", resp.Value)
}

func TestServerSideTLS(t *testing.T) {
	ctx, cancel := context.WithCancel(context.Background())
	defer cancel()

	ln, err := net.Listen("tcp", "127.0.0.1:0")
	require.NoError(t, err)

	certPEM, privKeyPEM := generateKeyPair(t, "server", ln.Addr().(*net.TCPAddr).IP.String())

	tlsCert, err := tls.X509KeyPair(certPEM, privKeyPEM)
	require.NoError(t, err)

	serverCreds := credentials.NewServerTLSFromCert(&tlsCert)

	serve(ctx, ln, grpc.Creds(serverCreds))

	certPool := x509.NewCertPool()
	certPool.AppendCertsFromPEM(certPEM)

	clientCreds := credentials.NewClientTLSFromCert(certPool, "")
	conn, err := grpc.Dial(ln.Addr().String(), grpc.WithTransportCredentials(clientCreds))
	require.NoError(t, err)

	testEcho(ctx, t, conn)
}

// https://dev.to/techschoolguru/how-to-secure-grpc-connection-with-ssl-tls-in-go-4ph
func TestWithMutualTLS(t *testing.T) {
	ctx, cancel := context.WithCancel(context.Background())
	defer cancel()

	ln, err := net.Listen("tcp", "127.0.0.1:0")
	require.NoError(t, err)

	serverCertPEM, serverPrivKeyPEM := generateKeyPair(t, "server", ln.Addr().(*net.TCPAddr).IP.String())

	certServer, err := tls.X509KeyPair(serverCertPEM, serverPrivKeyPEM)
	require.NoError(t, err)

	clientCerts := make([]tls.Certificate, 10)
	serverCertPool := x509.NewCertPool()
	for i := 0; i < len(clientCerts); i++ {
		clientCertPEM, clientPrivKeyPEM := generateKeyPair(t, fmt.Sprintf("client %d", i+1), ln.Addr().(*net.TCPAddr).IP.String())
		clientCerts[i], err = tls.X509KeyPair(clientCertPEM, clientPrivKeyPEM)
		require.NoError(t, err)

		require.True(t, serverCertPool.AppendCertsFromPEM(clientCertPEM))
	}

	serverCreds := credentials.NewTLS(&tls.Config{
		Certificates: []tls.Certificate{certServer},
		ClientAuth:   tls.RequireAndVerifyClientCert, // NOTE: need to mtls
		ClientCAs:    serverCertPool,
	})

	serve(ctx, ln, grpc.Creds(serverCreds))

	for i := 0; i < len(clientCerts); i++ {
		certPool := x509.NewCertPool()
		require.True(t, certPool.AppendCertsFromPEM(serverCertPEM))

		clientCreds := credentials.NewTLS(&tls.Config{
			Certificates: []tls.Certificate{clientCerts[i]},
			RootCAs:      certPool,
		})

		conn, err := grpc.Dial(ln.Addr().String(), grpc.WithTransportCredentials(clientCreds))
		require.NoError(t, err)

		testEcho(ctx, t, conn)
	}
}
