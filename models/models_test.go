package models

import (
	"os"
	"testing"

	"github.com/stretchr/testify/require"
	"github.com/whitekid/gormx"
	"github.com/whitekid/goxp/fx"
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

func TestUID(t *testing.T) {
	users := []*User{}
	require.NoError(t, _db.Unscoped().Where("uid IS NULL").Find(&users).Error)
	fillUID(t, &User{}, fx.Map(users, func(u *User) uint { return u.ID }))

	workspaces := []*Workspace{}
	require.NoError(t, _db.Unscoped().Where("uid IS NULL").Find(&workspaces).Error)
	fillUID(t, &Workspace{}, fx.Map(workspaces, func(u *Workspace) uint { return u.ID }))

	cards := []*Card{}
	require.NoError(t, _db.Unscoped().Where("uid IS NULL").Find(&cards).Error)
	fillUID(t, &Card{}, fx.Map(cards, func(u *Card) uint { return u.ID }))

	labels := []*Label{}
	require.NoError(t, _db.Unscoped().Where("uid IS NULL").Find(&labels).Error)
	fillUID(t, &Label{}, fx.Map(labels, func(u *Label) uint { return u.ID }))
}

func fillUID(t *testing.T, model any, ids []uint) {
	for _, id := range ids {
		tx := _db.Unscoped().Model(model).Where("id = ?", id).Updates(map[string]any{"uid": gormx.GenerateID()})
		require.NoError(t, tx.Error)
		require.NotEqual(t, int64(0), tx.RowsAffected)
	}
}

func TestCardLabels(t *testing.T) {
	_db.Unscoped().Where("card_no = 0").Delete(&Card{})

	card := &Card{
		CreatorID:   1,
		WorkspaceID: 1,
		Objective:   "test for label",
		Labels:      []int64{1, 6, 4},
	}
	require.NoError(t, _db.Create(card).Error)
	defer func() {
		require.NoError(t, _db.Delete(card).Error)
	}()

	cards := []Card{}
	require.NoError(t, _db.Model(&Card{}).Where("labels IS NOT NULL").Find(&cards).Error)
	require.NotEmpty(t, cards, "")
	require.Equal(t, card.Labels, cards[0].Labels)
}

// TODO transaction/ rollback 제대로 테스트 필요하겠네
