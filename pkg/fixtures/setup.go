package fixtures

import (
	"os"
	"time"

	"focus/models"
	"focus/repository"

	"github.com/whitekid/goxp"
	"github.com/whitekid/goxp/fx"
	"gopkg.in/yaml.v3"
	"gorm.io/gorm"
)

// Setup setup test databases
// Setup setup fixture data
func Setup(db *gorm.DB) error {
	if err := db.Migrator().DropTable(&models.User{}, &models.Card{}, &models.Label{}, &models.Metadata{}, &models.UserWorkspace{}, &models.Workspace{}); err != nil {
		return err
	}

	if err := models.Migrate(db); err != nil {
		return err
	}

	f, err := os.Open("fixtures/fixtures.yaml")
	if err != nil {
		return err
	}
	defer f.Close()

	userFixture := &struct {
		Users map[string]*struct {
			Name string
		}
		Workspaces map[string]*struct {
			Users map[string]*struct {
				Role string
			}
			Labels map[string]string
			Cards  []*struct {
				CardNo       uint   `yaml:"cardNo"`
				CardType     string `yaml:"cardType"`
				Creator      string
				Objective    string
				CompletedAt  *time.Duration `yaml:"completedAt"`
				DeferUntil   *time.Duration `yaml:"deferUntil"`
				DeletedAt    *time.Duration `yaml:"deletedAt"`
				Labels       []string
				ParentCardNo *uint `yaml:"parentCardNo"`
			}
		}
	}{}

	if err := yaml.NewDecoder(f).Decode(userFixture); err != nil {
		return err
	}

	userMap := map[string]*models.User{}
	for email, user := range userFixture.Users {
		userMap[email] = &models.User{
			Email: email,
			Name:  user.Name,
		}
		if tx := db.Create(userMap[email]); tx.Error != nil {
			return tx.Error
		}
	}

	for name, workspace := range userFixture.Workspaces {
		ws := &models.Workspace{
			Name: name,
		}
		if tx := db.Create(ws); tx.Error != nil {
			return tx.Error
		}

		// create user
		for email, user := range workspace.Users {
			u, err := repository.UserByEmail(db, email)
			if err != nil {
				return err
			}

			if tx := db.Create(&models.UserWorkspace{
				UserID:      u.ID,
				WorkspaceID: ws.ID,
				Role:        user.Role,
			}); tx.Error != nil {
				return tx.Error
			}
		}

		// create labels
		labelMap := map[string]*models.Label{}
		for label, color := range workspace.Labels {
			labelMap[label] = &models.Label{
				WorkspaceID: ws.ID,
				Label:       label,
				Color:       color,
			}
			if tx := db.Create(labelMap[label]); tx.Error != nil {
				return tx.Error
			}
		}

		// create cards
		for _, card := range workspace.Cards {
			if tx := db.Create(&models.Card{
				CardNo:      card.CardNo,
				CardType:    goxp.Ternary(card.CardType == "", "card", card.CardType),
				WorkspaceID: ws.ID,
				CreatorID:   userMap[card.Creator].ID,
				Objective:   card.Objective,
				CompletedAt: durationToTime(card.CompletedAt),
				DeferUntil:  durationToTime(card.DeferUntil),
				Model: &gorm.Model{
					DeletedAt: goxp.TernaryCF(card.DeletedAt == nil,
						func() gorm.DeletedAt { return gorm.DeletedAt{} },
						func() gorm.DeletedAt {
							return gorm.DeletedAt{
								Time:  time.Now().Add(*card.DeletedAt),
								Valid: true,
							}
						}),
				},
				Labels:       fx.Map(card.Labels, func(l string) int64 { return int64(labelMap[l].ID) }),
				ParentCardNo: card.ParentCardNo,
			}); tx.Error != nil {
				return tx.Error
			}
		}
	}

	return nil
}

func durationToTime(d *time.Duration) *time.Time {
	if d == nil {
		return nil
	}

	v := time.Now().Add(*d)
	return &v
}
