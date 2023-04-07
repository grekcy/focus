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

	ctx, service := newTestClient(ctx, t)
	got, err := service.listLabels(ctx, nil)
	require.NoError(t, err)

	require.NotEmpty(t, got)
}

func TestLabelCreate(t *testing.T) {
	ctx, cancel := context.WithCancel(context.Background())
	defer cancel()

	ctx, service := newTestClient(ctx, t)

	type args struct {
		label *models.Label
	}
	tests := [...]struct {
		name    string
		args    args
		wantErr bool
	}{
		{`empty label`, args{&models.Label{
			WorkspaceID: service.defaultWorkspace(ctx).ID,
		}}, true},
		{`default`, args{&models.Label{
			WorkspaceID: service.defaultWorkspace(ctx).ID,
			Label:       "hello world",
		}}, false},
	}
	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			err := service.db.Save(tt.args.label).Error

			require.Truef(t, (err != nil) == tt.wantErr, `createLabel() failed: error = %+v, wantErr = %v`, err, tt.wantErr)
			if tt.wantErr {
				return
			}
		})
	}
}
