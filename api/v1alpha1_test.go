package api

import (
	"context"
	"testing"

	"github.com/stretchr/testify/require"

	"focus/databases"
	"focus/helper"
	"focus/proto"
)

func TestQuickAdd(t *testing.T) {
	type args struct {
		card *proto.Card
	}
	tests := [...]struct {
		name    string
		args    args
		wantErr bool
	}{
		{"default", args{&proto.Card{Subject: "test subject"}}, false},
	}
	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			ctx, cancel := context.WithCancel(context.Background())
			defer cancel()

			db, err := databases.Open("pgsql://focus:focus-pass@localhost/focus_dev")
			require.NoError(t, err)

			service := newV1Alpha1Service(db).(*v1alpha1ServiceImpl)
			got, err := service.QuickAddCard(ctx, tt.args.card)
			require.Truef(t, (err != nil) == tt.wantErr, `Entries.List() failed: error = %+v, wantErr = %v`, err, tt.wantErr)
			if tt.wantErr {
				return
			}
			require.NotEqual(t, uint64(0), got.No)
			require.Equal(t, tt.args.card.Subject, got.Subject)

			_, err =service.DeleteCard(ctx, helper.UInt64(got.No))
			require.NoError(t, err)
		})
	}
}
