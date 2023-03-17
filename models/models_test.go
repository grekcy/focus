package models

import (
	"testing"

	"github.com/stretchr/testify/require"
	"github.com/whitekid/gormx"
)

func TestModel(t *testing.T) {
	db, err := gormx.Open("pgsql://focus:focus-pass@localhost/focus_dev")
	require.NoError(t, err)

	require.NoError(t, Migrate(db))
}
