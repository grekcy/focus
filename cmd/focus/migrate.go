package main

import (
	"github.com/spf13/cobra"
	"github.com/whitekid/cobrax"

	"focus/models"
)

func init() {
	cobrax.Add(rootCmd, &cobra.Command{
		Use:   "migrate",
		Short: "migrate database",
		RunE: func(cmd *cobra.Command, args []string) error {
			return models.Migrate(db.WithContext(cmd.Context()))
		},
	}, nil, nil)
}
