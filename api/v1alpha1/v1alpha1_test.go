package v1alpha1

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

	ctx = context.WithValue(ctx, KeyToken, "whitekid@gmail.com")
	ctx = context.WithValue(ctx, KeyDB, db)
	ctx, err = ExtractUserInfo(ctx)
	require.NoError(t, err)

	return ctx, New(db).(*v1alpha1ServiceImpl)
}
