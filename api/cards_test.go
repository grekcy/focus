package api

import (
	"context"
	"testing"
	"time"

	"github.com/stretchr/testify/require"
	"github.com/whitekid/goxp/fixtures"
	"github.com/whitekid/goxp/fx"
	timestamppb "google.golang.org/protobuf/types/known/timestamppb"
	"google.golang.org/protobuf/types/known/wrapperspb"

	"focus/helper"
	"focus/models"
	"focus/proto"
)

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
			require.Truef(t, (err != nil) == tt.wantErr, `QuickAddCard() failed: error = %+v, wantErr = %v`, err, tt.wantErr)
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

func TestListCards(t *testing.T) {
	ctx, cancel := context.WithCancel(context.Background())
	defer cancel()

	ctx, service := newTestClient(ctx, t)

	// set deferred cards
	deferredCard, err := service.QuickAddCard(ctx, wrapperspb.String("test deferred card"))
	require.NoError(t, err)
	service.PatchCard(ctx, &proto.PatchCardReq{Card: &proto.Card{
		CardNo:        deferredCard.CardNo,
		DeferredUntil: timestamppb.New(time.Now().AddDate(0, 0, 1)),
	}, Fields: []proto.CardField{proto.CardField_DEFER_UNTIL}})

	defer func() {
		service.DeleteCard(ctx, wrapperspb.UInt64(deferredCard.CardNo))
	}()

	type args struct {
		where *models.Card
		opts  ListOpt
	}
	tests := [...]struct {
		name    string
		args    args
		wantErr bool
	}{
		{`exclude completed`, args{where: nil, opts: ListOpt{excludeCompleted: true}}, false},
		{`include deferred`, args{where: nil, opts: ListOpt{excludeDeferred: false}}, false},
		{`exclude deferred`, args{where: nil, opts: ListOpt{excludeDeferred: true}}, false},
		{`with label`, args{
			where: &models.Card{Labels: helper.ToArray(fx.Of(1))},
			opts:  ListOpt{excludeCompleted: true}}, false},
	}
	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			got, err := service.listCards(ctx, tt.args.where, tt.args.opts)
			require.Truef(t, (err != nil) == tt.wantErr, `listCards() failed: error = %+v, wantErr = %v`, err, tt.wantErr)
			if tt.wantErr {
				return
			}

			require.NotEmpty(t, got)

			if tt.args.opts.excludeCompleted {
				fx.Each(got, func(_ int, c *CardWithDepth) { require.Nil(t, c.CompletedAt) })
			}

			if !tt.args.opts.excludeDeferred && tt.args.where == nil {
				require.NotEmpty(t, got)
				require.Contains(t,
					fx.Map(got, func(e *CardWithDepth) uint64 { return uint64(e.CardNo) }), deferredCard.CardNo)
				fx.Each(got, func(_ int, c *CardWithDepth) {
					if c.DeferredUntil != nil {
						require.True(t, c.DeferredUntil.After(time.Now()))
					}
				})
			} else {
				fx.Each(got, func(_ int, c *CardWithDepth) {
					require.Nil(t, c.DeferredUntil)
				})
			}

			if tt.args.where != nil && len(tt.args.where.Labels) > 0 {
				fx.Each(got, func(_ int, c *CardWithDepth) {
					for _, label := range tt.args.where.Labels {
						require.Containsf(t, c.Labels, label, "card=%d, labels=%v", c.CardNo, c.Labels)
					}
				})
			}
		})
	}
}

func TestGetCard(t *testing.T) {
	ctx, cancel := context.WithCancel(context.Background())
	defer cancel()

	ctx, service := newTestClient(ctx, t)

	_, err := service.GetCards(ctx, &proto.GetCardReq{})
	require.Error(t, err, "empty request")

	_, err = service.GetCards(ctx, &proto.GetCardReq{CardNos: []uint64{1, 9999999999999999999}})
	require.Error(t, err, "not exists")

	items, err := service.listCards(ctx, nil, ListOpt{excludeCompleted: true})
	require.NoError(t, err)
	require.NotEmpty(t, items)
	cardNo := fx.Map(items, func(x *CardWithDepth) uint64 { return uint64(x.CardNo) })

	got, err := service.GetCards(ctx, &proto.GetCardReq{CardNos: cardNo})
	require.NoError(t, err)
	require.Equal(t, len(items), len(got.Items))
}

func TestCompleteCard(t *testing.T) {
	ctx, cancel := context.WithCancel(context.Background())
	defer cancel()

	ctx, service := newTestClient(ctx, t)
	card, teardown := newCardForTest(ctx, t, service, "test card for complete card")
	defer teardown()

	require.Nil(t, card.CompletedAt)

	// set completed
	{
		_, err := service.PatchCard(ctx, &proto.PatchCardReq{
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
		_, err := service.PatchCard(ctx, &proto.PatchCardReq{
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
		_, err := service.PatchCard(ctx, &proto.PatchCardReq{
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

func newCardForTest(ctx context.Context, t *testing.T, service *v1alpha1ServiceImpl, subject string) (*proto.Card, fixtures.Teardown) {
	card, err := service.QuickAddCard(ctx, wrapperspb.String(subject))
	require.NoError(t, err, "fail to create card")

	return card, func() {
		_, err = service.DeleteCard(ctx, helper.UInt64(card.CardNo))
		require.NoError(t, err)
	}
}

func TestRankDown(t *testing.T) {
	ctx, cancel := context.WithCancel(context.Background())
	defer cancel()

	ctx, service := newTestClient(ctx, t)
	card1, teardown := newCardForTest(ctx, t, service, "test subject for rank #1")
	defer teardown()

	card2, teardown := newCardForTest(ctx, t, service, "test subject for rank #2")
	defer teardown()

	card3, teardown := newCardForTest(ctx, t, service, "test subject for rank #3")
	defer teardown()

	_ = card2
	_, err := service.RerankCard(ctx, &proto.RankCardReq{
		CardNo:       card1.CardNo,
		TargetCardNo: card3.CardNo,
	})
	require.NoError(t, err)
}
