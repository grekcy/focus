package models

import (
	"time"

	"gorm.io/gorm"
)

type Card struct {
	*gorm.Model

	CardNo      uint   `gorm:"not null,index"`
	Rank        uint   `gorm:"not null;index,default:0"`
	Subject     string `gorm:"type:varchar(500);not null;default:''"`
	CompletedAt *time.Time
}
