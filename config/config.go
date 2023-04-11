package config

import (
	"strings"
	"time"

	"github.com/spf13/viper"
)

var v = viper.New()

func init() {
	initConfig()

	for key, value := range defaults {
		v.SetDefault(key, value)
	}
}

var defaults = map[string]any{
	"apiserver.bind_addr":         "127.0.0.1:9090",
	"database.hostname":           "localhost",
	"database.name":               "focus_dev",
	"database.user":               "focus",
	"database.passwd":             "passwd-pass",
	"database.max_idle_conns":     10,
	"database.max_open_conns":     100,
	"database.conn_max_life_time": time.Hour,
	"database.log_sql":            true,
	"auth.signing_key":            "auth-signing-key",
}

func ApiServerBindAddr() string        { return v.GetString("apiserver.bind_addr") }
func DBHostname() string               { return v.GetString("database.hostname") }
func DBName() string                   { return v.GetString("database.name") }
func DBUser() string                   { return v.GetString("database.user") }
func DBPassword() string               { return v.GetString("database.passwd") }
func DBMaxIdleConns() int              { return v.GetInt("database.max_idle_conns") }
func DBMaxOpenConns() int              { return v.GetInt("database.max_open_conns") }
func DBConnMaxLifeTime() time.Duration { return v.GetDuration("database.conn_max_life_time") }
func DBLogSQL() bool                   { return v.GetBool("database.log_sql") }
func AuthSigningKey() []byte           { return []byte(v.GetString("auth.signing_key")) }

const envPrefix = "FC"

var envReplacer = []string{"-", "_", ".", "_"}

func initConfig() {
	v.SetEnvPrefix(envPrefix)
	v.SetEnvKeyReplacer(strings.NewReplacer(envReplacer...))
	v.AutomaticEnv()
}
