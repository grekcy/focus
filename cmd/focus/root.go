package main

import (
	"github.com/spf13/cobra"
	"gorm.io/gorm"

	"focus/databases"
)

var (
	db      *gorm.DB
	rootCmd = &cobra.Command{
		Use:   "grekcy",
		Short: "grekcy",
		PersistentPreRunE: func(cmd *cobra.Command, args []string) (err error) {
			db, err = databases.Open()
			if err != nil {
				return err
			}

			return nil
		},
	}
)

func init() {
	// config.InitFlagSet(rootCmd.Use, rootCmd)
}
