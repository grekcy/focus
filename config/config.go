package config

import (
	"strings"

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
	"apiserver.bind_addr": "127.0.0.1:9090",
	"database.hostname":   "localhost",
	"database.name":       "focus_dev",
	"database.user":       "focus",
	"database.passwd":     "passwd-pass",
}

func ApiServerBindAddr() string { return v.GetString("apiserver.bind_addr") }
func DBHostname() string        { return v.GetString("database.hostname") }
func DBName() string            { return v.GetString("database.name") }
func DBUser() string            { return v.GetString("database.user") }
func DBPassword() string        { return v.GetString("database.passwd") }

const envPrefix = "FC"

var envReplacer = []string{"-", "_", ".", "_"}

func initConfig() {
	v.SetEnvPrefix(envPrefix)
	v.SetEnvKeyReplacer(strings.NewReplacer(envReplacer...))
	v.AutomaticEnv()
}
