package main

import (
	"fmt"

	"github.com/spf13/cobra"
	"github.com/whitekid/cobrax"

	"focus/config"
	"focus/databases"
	"focus/models"
)

func init() {
	cobrax.Add(rootCmd, &cobra.Command{
		Use:   "migrate",
		Short: "migrate database",
		RunE: func(cmd *cobra.Command, args []string) error {
			db, err := databases.Open(fmt.Sprintf("pgsql://%s:%s@%s/%s", config.DBUser(), config.DBPassword(), config.DBHostname(), config.DBName()))
			if err != nil {
				return nil
			}

			return models.Migrate(db)
		},
	}, nil, nil)
}
