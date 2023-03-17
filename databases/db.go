package databases

import (
	"time"

	"github.com/pkg/errors"
	"github.com/whitekid/gormx"
	"github.com/whitekid/goxp/log"
	"gorm.io/gorm"
	"gorm.io/gorm/logger"

	"focus/models"
)

func Open(dburl string) (*gorm.DB, error) {
	sqlLogger := logger.New(&gormLogger{},
		logger.Config{
			SlowThreshold:             200 * time.Millisecond,
			LogLevel:                  logger.Info,
			IgnoreRecordNotFoundError: true,
		})

	db, err := gormx.Open(dburl, &gorm.Config{
		SkipDefaultTransaction: true,
		PrepareStmt:            true,
		Logger:                 sqlLogger,
	})
	if err != nil {
		return nil, errors.Wrap(err, "fail to open dataase")
	}

	return db, nil
}

type gormLogger struct{}

func (l *gormLogger) Printf(s string, args ...any) { log.Debugf(s, args...) }

func Migrate(db *gorm.DB) error {
	return models.Migrate(db)
}