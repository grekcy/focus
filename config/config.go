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
}

func ApiServerBindAddr() string { return v.GetString("apiserver.bind_addr") }

const envPrefix = "FC"

var envReplacer = []string{"-", "_", ".", "_"}

func initConfig() {
	v.SetEnvPrefix(envPrefix)
	v.SetEnvKeyReplacer(strings.NewReplacer(envReplacer...))
	v.AutomaticEnv()
}
