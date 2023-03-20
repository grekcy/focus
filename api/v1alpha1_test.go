package api

import (
	"context"
	"testing"
	"time"

	"github.com/stretchr/testify/require"
	"google.golang.org/protobuf/types/known/timestamppb"
	"google.golang.org/protobuf/types/known/wrapperspb"

	"focus/databases"
	"focus/helper"
	"focus/proto"
)

func newTestClient(ctx context.Context, t *testing.T) (context.Context, *v1alpha1ServiceImpl) {
	db, err := databases.Open("pgsql://focus:focus-pass@localhost/focus_dev")
	require.NoError(t, err)

	ctx = context.WithValue(ctx, keyDB, db)
	ctx, err = extractUserInfo(ctx)
	require.NoError(t, err)

	return ctx, newV1Alpha1Service(db).(*v1alpha1ServiceImpl)
}

func TestQuickAdd(t *testing.T) {
	type args struct {
		subject string
	}
	tests := [...]struct {
		name    string
		args    args
		wantErr bool
	}{
		{"default", args{subject: "test subject"}, false},
	}
	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			ctx, cancel := context.WithCancel(context.Background())
			defer cancel()

			ctx, service := newTestClient(ctx, t)

			got, err := service.QuickAddCard(ctx, wrapperspb.String(tt.args.subject))
			require.Truef(t, (err != nil) == tt.wantErr, `Entries.List() failed: error = %+v, wantErr = %v`, err, tt.wantErr)
			if tt.wantErr {
				return
			}
			defer func() {
				_, err = service.DeleteCard(ctx, helper.UInt64(got.CardNo))
				require.NoError(t, err)
			}()

			require.NotEqual(t, uint64(0), got.CardNo)
			require.Equal(t, tt.args.subject, got.Subject)

			got1, err := service.GetCard(ctx, helper.UInt64(got.CardNo))
			require.NoError(t, err)
			require.Equal(t, got, got1)
		})
	}
}

func TestCompleteCard(t *testing.T) {
	ctx, cancel := context.WithCancel(context.Background())
	defer cancel()

	ctx, service := newTestClient(ctx, t)
	card, err := service.QuickAddCard(ctx, wrapperspb.String("test subject"))
	require.NoError(t, err)
	defer func() {
		_, err = service.DeleteCard(ctx, helper.UInt64(card.CardNo))
		require.NoError(t, err)
	}()

	require.Nil(t, card.CompletedAt)

	// set completed
	{
		_, err = service.PatchCard(ctx, &proto.PatchCardReq{
			Fields: []proto.CardField{proto.CardField_COMPLETED_AT},
			Card: &proto.Card{
				CardNo:      card.CardNo,
				CompletedAt: timestamppb.Now(),
			},
		})
		require.NoError(t, err)

		updated, err := service.GetCard(ctx, helper.UInt64(card.CardNo))
		require.NoError(t, err)
		require.NotNil(t, updated.CompletedAt)
		require.Less(t, time.Since(updated.CompletedAt.AsTime()), time.Second)
	}

	// set again will be failed
	{
		_, err = service.PatchCard(ctx, &proto.PatchCardReq{
			Fields: []proto.CardField{proto.CardField_COMPLETED_AT},
			Card: &proto.Card{
				CardNo:      card.CardNo,
				CompletedAt: timestamppb.Now(),
			},
		})
		require.Error(t, err)
	}

	// turn to in-progress
	{
		_, err = service.PatchCard(ctx, &proto.PatchCardReq{
			Fields: []proto.CardField{proto.CardField_COMPLETED_AT},
			Card: &proto.Card{
				CardNo:      card.CardNo,
				CompletedAt: nil,
			},
		})
		require.NoError(t, err)

		updated, err := service.GetCard(ctx, helper.UInt64(card.CardNo))
		require.NoError(t, err)
		require.Nil(t, updated.CompletedAt)
	}
}
