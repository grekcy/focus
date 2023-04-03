package api

import (
	"context"
	"fmt"
	"testing"

	"github.com/stretchr/testify/require"

	"focus/config"
	"focus/databases"
)

func newTestClient(ctx context.Context, t *testing.T) (context.Context, *v1alpha1ServiceImpl) {
	db, err := databases.Open(fmt.Sprintf("pgsql://%s:%s@%s/%s", config.DBUser(), config.DBPassword(), config.DBHostname(), config.DBName()))
	require.NoError(t, err)

	ctx = context.WithValue(ctx, keyToken, "whitekid@gmail.com")
	ctx = context.WithValue(ctx, keyDB, db)
	ctx, err = extractUserInfo(ctx)
	require.NoError(t, err)

	return ctx, newV1Alpha1Service(db).(*v1alpha1ServiceImpl)
}
