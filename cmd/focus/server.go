package main

import (
	"github.com/spf13/cobra"
	"github.com/whitekid/cobrax"

	"focus/api"
)

func init() {
	cobrax.Add(rootCmd, &cobra.Command{
		Use:   "apiserver",
		Short: "start focus api server",
		RunE: func(cmd *cobra.Command, args []string) error {
			return api.Serve(cmd.Context())
		},
	}, nil, nil)
}
