package databases

import (
	"fmt"
	"strings"
	"time"

	"github.com/pkg/errors"
	"github.com/whitekid/gormx"
	"github.com/whitekid/goxp/log"
	"gorm.io/gorm"
	"gorm.io/gorm/logger"

	"focus/config"
	"focus/models"
)

func Open() (*gorm.DB, error) {
	return openURL(fmt.Sprintf("pgsql://%s:%s@%s:%s/%s",
		config.DBUser(),
		config.DBPassword(),
		config.DBHostname(),
		config.DBPort(),
		config.DBName(),
	))
}

func openURL(dburl string) (*gorm.DB, error) {
	var sqlLogger logger.Interface
	if config.DBLogSQL() {
		sqlLogger = logger.New(&gormLogger{},
			logger.Config{
				SlowThreshold:             200 * time.Millisecond,
				LogLevel:                  logger.Info,
				IgnoreRecordNotFoundError: true,
			})
	}

	log.Debugf("opening database %v", strings.ReplaceAll(dburl, config.DBPassword(), "*****"))
	db, err := gormx.Open(dburl, &gorm.Config{
		SkipDefaultTransaction: true,
		PrepareStmt:            true,
		Logger:                 sqlLogger,
	})
	if err != nil {
		return nil, errors.Wrap(err, "fail to open dataase")
	}

	sqlDB, err := db.DB()
	if err != nil {
		return nil, errors.Wrapf(err, "fail to get sqlDB")
	}
	sqlDB.SetMaxIdleConns(config.DBMaxIdleConns())
	sqlDB.SetMaxOpenConns(config.DBMaxOpenConns())
	sqlDB.SetConnMaxLifetime(config.DBConnMaxLifeTime())

	return db, nil
}

type gormLogger struct{}

func (l *gormLogger) Printf(s string, args ...any) { log.Debugf(s, args...) }

func Migrate(db *gorm.DB) error { return models.Migrate(db) }
