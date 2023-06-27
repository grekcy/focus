package models

import (
	"time"

	"github.com/lib/pq"
	"github.com/whitekid/gormx"
	"gorm.io/gorm"
)

type Metadata struct {
	*gorm.Model

	Key   string `gorm:"not null;check:key<>''"`
	Value string
}

type User struct {
	*gorm.Model

	UID   string `gorm:"type:varchar(22);not null;uniqueIndex;check:uid<>''"`
	Email string `gorm:"type:varchar(100);not null;uniqueIndex:,where:deleted_at IS NULL;check:email<>''"`
	Name  string `gorm:"type:varchar(50);not null;check:name<>''"`
}

func (u *User) BeforeCreate(tx *gorm.DB) error {
	u.UID = gormx.GenerateID()
	return nil
}

type Workspace struct {
	*gorm.Model

	UID  string `gorm:"type:varchar(22);not null;uniqueIndex;check:uid<>''"`
	Name string `gorm:"type:varchar(100);not null;uniqueIndex:,where:deleted_at IS NULL;check:name<>''"`
}

func (w *Workspace) BeforeCreate(tx *gorm.DB) error {
	w.UID = gormx.GenerateID()
	return nil
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

type CardType string

const (
	CardTypeCard      CardType = "card"
	CardTypeChallenge CardType = "challenge"
)

func (s CardType) String() string { return string(s) }

type Card struct {
	*gorm.Model

	UID              string     `gorm:"type:varchar(22);not null;uniqueIndex;check:uid<>''"`
	WorkspaceID      uint       `gorm:"not null;uniqueIndex:idx_card_no"`
	CreatorID        uint       `gorm:"not null;index"`
	ResponsibilityID *uint      `gorm:"index"`
	CardNo           uint       `gorm:"not null;uniqueIndex:idx_card_no"`
	Rank             uint       `gorm:"not null;default:0"`
	ParentCardNo     *uint      `grom:"index"`
	DeferUntil       *time.Time `gorm:"index"`
	DueDate          *time.Time `gorm:"index"`
	CompletedAt      *time.Time `gorm:"index"`
	CardType         string     `gorm:"type:varchar(50);not null;default:'card';check:card_type in ('card','challenge')"`
	Status           string     `gorm:"type:varchar(20)"`
	Objective        string     `gorm:"type:varchar(500);not null;default:''"`
	Content          string     `gorm:"type:text;not null;default:''"`
	//
	// alter table cards add labels bigint[];
	// create index idx_cards_labels ON cards using gin(labels)
	// LIMIT: 각 element에 대한 fk는 되지 않음
	//
	// update cards set labels = '{1,4,6}' where card_no = 5;
	// SELECT card_no, objective, labels FROM cards WHERE ARRAY[1,6]::bigint[] <@ labels
	//
	Labels pq.Int64Array `gorm:"type:bigint[];index:,type:gin"`

	Creator        *User      `gorm:"foreignKey:CreatorID"`
	Responsibility *User      `gorm:"foreignKey:ResponsibilityID"`
	Workspace      *Workspace `gorm:"foreignKey:WorkspaceID"`
}

func (c *Card) BeforeCreate(tx *gorm.DB) error {
	c.UID = gormx.GenerateID()
	return nil
}

type Label struct {
	*gorm.Model

	UID         string `gorm:"type:varchar(22);not null;uniqueIndex;check:uid<>''"`
	WorkspaceID uint   `gorm:"not null"`
	Label       string `gorm:"type:varchar(50);index;not null;check:label<>''"`
	Description string `gorm:"type:varchar(100);not null;default:''"`
	Color       string `gorm:"type:varchar(20);not null;default:''"`

	Workspace *Workspace `gorm:"foreignKey:WorkspaceID"`
}

func (l *Label) BeforeCreate(tx *gorm.DB) error {
	l.UID = gormx.GenerateID()
	return nil
}
