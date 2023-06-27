package main

import (
	"github.com/spf13/cobra"
	"github.com/whitekid/cobrax"

	"focus/pkg/fixtures"
)

func init() {
	cmd := cobrax.Add(rootCmd, &cobra.Command{
		Use: "fixtures",
	}, nil, nil)

	cobrax.Add(cmd, &cobra.Command{
		Use:   "setup",
		Short: "setup fixture database and dump to fixture",
		RunE: func(cmd *cobra.Command, args []string) error {
			sqlDB, err := db.DB()
			if err != nil {
				return nil
			}

			if err := fixtures.Setup(db.WithContext(cmd.Context())); err != nil {
				return err
			}

			if err := fixtures.Dump(sqlDB); err != nil {
				return err
			}
			return nil
		},
	}, nil, nil)

	cobrax.Add(cmd, &cobra.Command{
		Use:   "load",
		Short: "load fixture data",
		RunE: func(cmd *cobra.Command, args []string) error {
			sqlDB, err := db.DB()
			if err != nil {
				return nil
			}

			if err := fixtures.Load(sqlDB, "."); err != nil {
				return err
			}

			return nil
		},
	}, nil, nil)
}
