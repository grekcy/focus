package models

import (
	"github.com/pkg/errors"
	"gorm.io/gorm"
)

func Migrate(db *gorm.DB) error {
	models := [][]any{
		{&Metadata{}, &User{}, &Card{}, &Challenge{}, &Workspace{}, &UserWorkspace{}},
	}

	for _, m := range models {
		if err := db.AutoMigrate(m...); err != nil {
			return errors.Wrap(err, "migrate failed")
		}
	}

	return nil
}
