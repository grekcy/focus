package models

import (
	"time"

	"gorm.io/gorm"
)

type Metadata struct {
	*gorm.Model

	Key   string `gorm:"not null;check:key<>''"`
	Value string
}

type User struct {
	*gorm.Model

	Email string `gorm:"type:varchar(100);not null;index;check:email<>''"`
}

type Workspace struct {
	*gorm.Model

	Name string `gorm:"type:varchar(100);not null;uniqueIndex;check:name<>''"`
}

const (
	RoleDefault = "default"
)

type UserWorkspace struct {
	*gorm.Model

	UserID      uint `gorm:"not null"`
	WorkspaceID uint `gorm:"not null"`
	// default: default workspace for user
	Role string `gorm:"not null;index"`

	User      *User      `gorm:"foreignKey:UserID"`
	Workspace *Workspace `gorm:"foreignKey:WorkspaceID"`
}

type Card struct {
	*gorm.Model

	WorkspaceID  uint       `gorm:"not null;uniqueIndex:idx_card_no"`
	CreatorID    uint       `gorm:"not null"`
	CardNo       uint       `gorm:"not null;uniqueIndex:idx_card_no"`
	Rank         uint       `gorm:"not null;default:0"`
	ParentCardNo *uint      `grom:"index"`
	CompletedAt  *time.Time `gorm:"index"`
	Subject      string     `gorm:"type:varchar(500);not null;default:''"`
	Content      string     `gorm:"type:text;not null;default:''"`

	Creator   *User      `gorm:"foreignKey:CreatorID"`
	Workspace *Workspace `gorm:"foreignKey:WorkspaceID"`
	Laebels   []*Labels  `gorm:"many2many:card_labels"`
}

type Labels struct {
	*gorm.Model

	WorkspaceID uint   `gorm:"not null"`
	Label       string `gorm:"varchar(50);index;not null;lable<>''"`
	Name        string `gorm:"varchar(50);not null;check:name<>''"`

	Workspace *Workspace `gorm:"foreignKey:WorkspaceID"`
}
