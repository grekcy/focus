package api

import (
	"context"
	"testing"
	"time"

	"github.com/stretchr/testify/require"

	"focus/databases"
	"focus/helper"
	"focus/proto"
)

func newTestClient(ctx context.Context, t *testing.T) *v1alpha1ServiceImpl {
	db, err := databases.Open("pgsql://focus:focus-pass@localhost/focus_dev")
	require.NoError(t, err)

	return newV1Alpha1Service(db).(*v1alpha1ServiceImpl)
}

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
			require.NotEqual(t, uint64(0), got.CardNo)
			require.Equal(t, tt.args.card.Subject, got.Subject)

			_, err = service.DeleteCard(ctx, helper.UInt64(got.CardNo))
			require.NoError(t, err)
		})
	}
}

func TestCompleteCard(t *testing.T) {
	ctx, cancel := context.WithCancel(context.Background())
	defer cancel()

	service := newTestClient(ctx, t)
	card, err := service.QuickAddCard(ctx, &proto.Card{Subject: "test subject"})
	require.NoError(t, err)
	defer func() {
		_, err = service.DeleteCard(ctx, helper.UInt64(card.CardNo))
		require.NoError(t, err)
	}()

	require.Nil(t, card.CompletedAt)

	// set completed
	{
		_, err = service.CompleteCard(ctx, &proto.CompleteCardReq{
			CardNo:   card.CardNo,
			Complted: true,
		})
		require.NoError(t, err)

		updated, err := service.GetCard(ctx, helper.UInt64(card.CardNo))
		require.NoError(t, err)
		require.NotNil(t, updated.CompletedAt)
		require.Less(t, time.Since(updated.CompletedAt.AsTime()), time.Second)
	}

	// undo completed
	{
		_, err = service.CompleteCard(ctx, &proto.CompleteCardReq{
			CardNo:   card.CardNo,
			Complted: false,
		})
		require.NoError(t, err)

		updated, err := service.GetCard(ctx, helper.UInt64(card.CardNo))
		require.NoError(t, err)
		require.Nil(t, updated.CompletedAt)
	}
}
