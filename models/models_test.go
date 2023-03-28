package models

import (
	"os"
	"testing"

	"github.com/stretchr/testify/require"
	"github.com/whitekid/gormx"
	"gorm.io/gorm"
)

var _db *gorm.DB

func TestMain(m *testing.M) {
	db, err := gormx.Open("pgsql://focus:focus-pass@localhost/focus_dev")
	if err != nil {
		panic(err)
	}

	_db = db

	os.Exit(m.Run())
}

func TestMigrate(t *testing.T) {
	require.NoError(t, Migrate(_db))
}

func TestCardLabels(t *testing.T) {
	_db.Unscoped().Where("card_no = 0").Delete(&Card{})

	card := &Card{
		CreatorID:   1,
		WorkspaceID: 1,
		Subject:     "test for label",
		Labels:      []int64{1, 6, 4},
	}
	require.NoError(t, _db.Save(card).Error)
	defer func() {
		require.NoError(t, _db.Delete(card).Error)
	}()

	cards := []Card{}
	require.NoError(t, _db.Model(&Card{}).Where("labels IS NOT NULL").Find(&cards).Error)
	require.NotEmpty(t, cards, "")
	require.Equal(t, card.Labels, cards[0].Labels)
}

// TODO transaction/ rollback 제대로 테스트 필요하겠네
