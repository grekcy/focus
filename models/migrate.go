package models

import (
	"context"

	"github.com/pkg/errors"
	"gorm.io/gorm"
)

func Migrate(ctx context.Context, db *gorm.DB) error {
	models := [][]any{
		{&Metadata{}, &User{}, &Card{}, &Label{}, &Workspace{}, &UserWorkspace{}},
	}

	for _, m := range models {
		if err := db.WithContext(ctx).AutoMigrate(m...); err != nil {
			return errors.Wrap(err, "migrate failed")
		}
	}

	return nil
}
