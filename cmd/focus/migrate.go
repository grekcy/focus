package main

import (
	"github.com/spf13/cobra"
	"github.com/whitekid/cobrax"

	"focus/databases"
	"focus/models"
)

func init() {
	cobrax.Add(rootCmd, &cobra.Command{
		Use:   "migrate",
		Short: "migrate database",
		RunE: func(cmd *cobra.Command, args []string) error {
			db, err := databases.Open()
			if err != nil {
				return nil
			}

			return models.Migrate(db)
		},
	}, nil, nil)
}
