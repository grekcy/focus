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

	WorkspaceID  uint `gorm:"not null"`
	CreatorID    uint `gorm:"not null"`
	CardNo       uint `gorm:"not null;index"`
	Rank         uint `gorm:"not null;index;default:0"`
	ParentCardNo *uint
	Depth        uint `gorm:"not null;default:0"`
	CompletedAt  *time.Time
	Subject      string `gorm:"type:varchar(500);not null;default:''"`
	Content      string `gorm:"type:text;not null;default:''"`

	Creator   *User      `gorm:"foreignKey:CreatorID"`
	Workspace *Workspace `gorm:"foreignKey:WorkspaceID"`
}

type Challenge struct {
	*gorm.Model

	WorkspaceID uint   `gorm:"not null"`
	CreatorID   uint   `gorm:"not null"`
	OwnerID     uint   `gorm:"not null"`
	Name        string `gorm:"type:varchar(100);not null;check:name<>''"`

	Creator   *User      `gorm:"foreignkey:CreatorID"`
	Owner     *User      `gorm:"foreignkey:OwnerID"`
	Cards     []*Card    `gorm:"many2many:challenge_cards"`
	Workspace *Workspace `gorm:"foreignKey:WorkspaceID"`
}

type Labels struct {
	*gorm.Model

	WorkspaceID uint   `gorm:"not null"`
	Label       string `gorm:"varchar(50);index;not null;lable<>''"`
	Name        string `gorm:"varchar(50);not null;check:name<>''"`

	Workspace *Workspace `gorm:"foreignKey:WorkspaceID"`
}
