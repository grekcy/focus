package models

import (
	"time"

	"github.com/lib/pq"
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
	DeferUntil   *time.Time `gorm:"index"`
	CompletedAt  *time.Time `gorm:"index"`
	Subject      string     `gorm:"type:varchar(500);not null;default:''"`
	Content      string     `gorm:"type:text;not null;default:''"`

	Creator   *User      `gorm:"foreignKey:CreatorID"`
	Workspace *Workspace `gorm:"foreignKey:WorkspaceID"`

	//
	// alter table cards add labels bigint[];
	// create index idx_cards_labels ON cards using gin(labels)
	// LIMIT: 각 element에 대한 fk는 되지 않음
	//
	// update cards set labels = '{1,4,6}' where card_no = 5;
	// SELECT card_no, subject, labels FROM cards WHERE ARRAY[1,6]::bigint[] <@ labels
	//
	Labels pq.Int64Array `gorm:"type:bigint[];index:,type:gin"`
}

type Label struct {
	*gorm.Model

	WorkspaceID uint   `gorm:"not null"`
	Label       string `gorm:"type:varchar(50);index;not null;check:label<>''"`
	Description string `gorm:"type:varchar(100);not null;default:''"`
	Color       string `gorm:"type:varchar(20);not null;default:''"`

	Workspace *Workspace `gorm:"foreignKey:WorkspaceID"`
}
