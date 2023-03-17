package models

import "gorm.io/gorm"

type Card struct {
	*gorm.Model

	CardNo  uint   `gorm:"not null"`
	Rank    uint   `gorm:"not null;default:0"`
	Subject string `gorm:"type:varchar(500);not null;default:''" validate:"required"`
}
