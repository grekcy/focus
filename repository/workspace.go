package repository

import (
	"errors"

	"github.com/whitekid/gormx"
	"gorm.io/gorm"

	"focus/models"
)

func UserDefaultWorkspace(db *gorm.DB, userID uint) (*models.Workspace, error) {
	userWorkspace, err := gormx.Get[models.UserWorkspace](
		db.Preload("Workspace").Where(&models.UserWorkspace{
			UserID: userID,
			Role:   models.RoleDefault,
		}))
	if err != nil {
		return nil, errors.New("user workspace not found")
	}

	return userWorkspace.Workspace, nil
}
