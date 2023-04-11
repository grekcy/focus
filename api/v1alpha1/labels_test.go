package v1alpha1

import (
	"context"
	"testing"

	"github.com/stretchr/testify/require"

	"focus/models"
)

func TestLabelList(t *testing.T) {
	ctx, cancel := context.WithCancel(context.Background())
	defer cancel()

	client := newTestClient(ctx, t)
	got, err := client.service.listLabels(ctx, nil)
	require.NoError(t, err)

	require.NotEmpty(t, got)
}

func TestLabelCreate(t *testing.T) {
	ctx, cancel := context.WithCancel(context.Background())
	defer cancel()

	client := newTestClient(ctx, t)

	type args struct {
		label *models.Label
	}
	tests := [...]struct {
		name    string
		args    args
		wantErr bool
	}{
		{`empty label`, args{&models.Label{
			WorkspaceID: client.service.currentWorkspace(ctx).ID,
		}}, true},
		{`default`, args{&models.Label{
			WorkspaceID: client.service.currentWorkspace(ctx).ID,
			Label:       "hello world",
		}}, false},
	}
	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			err := client.service.db.Save(tt.args.label).Error

			require.Truef(t, (err != nil) == tt.wantErr, `createLabel() failed: error = %+v, wantErr = %v`, err, tt.wantErr)
			if tt.wantErr {
				return
			}
		})
	}
}
