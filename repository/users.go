package repository

import (
	"github.com/whitekid/gormx"
	"gorm.io/gorm"

	"focus/models"
)

func UserByEmail(db *gorm.DB, email string) (*models.User, error) {
	return gormx.Get[models.User](db.Where(&models.User{Email: email}))
}

func UserByUID(db *gorm.DB, uid string) (*models.User, error) {
	return gormx.Get[models.User](db.Where(&models.User{UID: uid}))
}

func User(db *gorm.DB, id uint) (*models.User, error) {
	return gormx.Get[models.User](db.Where(&models.User{Model: &gorm.Model{ID: id}}))
}
