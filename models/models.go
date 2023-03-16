package models

import "gorm.io/gorm"

type Card struct {
	*gorm.Model

	CardNo  uint
	Subject string
}
