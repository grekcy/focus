package fixtures

import (
	"database/sql"
	"path"

	"github.com/go-testfixtures/testfixtures/v3"
)

func Dump(db *sql.DB) error {
	dumper, err := testfixtures.NewDumper(
		testfixtures.DumpDatabase(db),
		testfixtures.DumpDialect("postgres"),
		testfixtures.DumpDirectory("fixtures/testdata"),
	)
	if err != nil {
		return err
	}

	if err := dumper.Dump(); err != nil {
		return err
	}

	return nil
}

func Load(db *sql.DB, dir string) error {
	fixtures, err := testfixtures.New(
		testfixtures.Database(db),
		testfixtures.Dialect("postgres"),
		testfixtures.UseAlterConstraint(),
		testfixtures.Directory(path.Join(dir, "fixtures/testdata")),
	)
	if err != nil {
		return err
	}

	if err := fixtures.Load(); err != nil {
		return err
	}

	return nil
}
