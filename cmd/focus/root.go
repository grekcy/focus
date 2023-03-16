package main

import (
	"github.com/spf13/cobra"
)

var (
	rootCmd = &cobra.Command{
		Use:   "grekcy",
		Short: "grekcy",
	}
)

func init() {
	// config.InitFlagSet(rootCmd.Use, rootCmd)
}
