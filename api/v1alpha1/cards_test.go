package v1alpha1

import (
	"context"
	"math"
	"testing"
	"time"

	"github.com/stretchr/testify/require"
	"github.com/whitekid/goxp/fixtures"
	"github.com/whitekid/goxp/fx"
	"google.golang.org/protobuf/types/known/timestamppb"
	"google.golang.org/protobuf/types/known/wrapperspb"

	"focus/helper"
	"focus/models"
	proto "focus/proto/v1alpha1"
)

func TestAddCard(t *testing.T) {
	type args struct {
		objective string
	}
	tests := [...]struct {
		name    string
		args    args
		wantErr bool
	}{
		{"default", args{objective: "test objective"}, false},
	}
	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			ctx, cancel := context.WithCancel(context.Background())
			defer cancel()

			client := newTestClient(ctx, t)

			got, err := client.AddCard(ctx, &proto.AddCardReq{Objective: tt.args.objective})
			require.Truef(t, (err != nil) == tt.wantErr, `AddCardReq() failed: error = %+v, wantErr = %v`, err, tt.wantErr)
			if tt.wantErr {
				return
			}
			defer func() {
				_, err = client.DeleteCard(ctx, helper.UInt64(got.CardNo))
				require.NoError(t, err)
			}()

			require.NotEqual(t, uint64(0), got.CardNo)
			require.Equal(t, tt.args.objective, got.Objective)

			got1, err := client.GetCard(ctx, helper.UInt64(got.CardNo))
			require.NoError(t, err)
			require.Equal(t, got, got1)
		})
	}
}

func TestListCards(t *testing.T) {
	ctx, cancel := context.WithCancel(context.Background())
	defer cancel()

	client := newTestClient(ctx, t)

	// set deferred cards
	deferredCard, err := client.AddCard(ctx, &proto.AddCardReq{Objective: "test defer card"})
	require.NoError(t, err)
	client.PatchCard(ctx, &proto.PatchCardReq{Card: &proto.Card{
		CardNo:     deferredCard.CardNo,
		DeferUntil: timestamppb.New(time.Now().AddDate(0, 0, 1)),
	}, Fields: []proto.PatchCardReq_Field{proto.PatchCardReq_DEFER_UNTIL}})

	defer func() {
		client.DeleteCard(ctx, wrapperspb.UInt64(deferredCard.CardNo))
	}()

	type args struct {
		startWhere *models.Card
		where      *models.Card
		opts       ListOpt
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
		{`inbox`, args{&models.Card{CardType: models.CardTypeCard.String()}, &models.Card{}, ListOpt{excludeCompleted: true}}, false},
		{`challenge list`, args{
			&models.Card{CardType: models.CardTypeChallenge.String()},
			&models.Card{CardType: models.CardTypeChallenge.String()}, ListOpt{excludeCompleted: true}}, false},
		{`today`, args{&models.Card{}, &models.Card{}, ListOpt{excludeCompleted: true, excludeDeferred: true}}, false},
	}
	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			got, err := client.service.listCards(ctx, tt.args.startWhere, tt.args.where, tt.args.opts)
			require.Truef(t, (err != nil) == tt.wantErr, `listCards() failed: error = %+v, wantErr = %v`, err, tt.wantErr)
			if tt.wantErr {
				return
			}

			require.NotEmpty(t, got)

			if tt.args.opts.excludeCompleted {
				fx.Each(got, func(_ int, c *CardWithDepth) { require.Nil(t, c.CompletedAt) })
			}

			if tt.args.opts.excludeDeferred && tt.args.where == nil {
				require.NotEmpty(t, got)
				require.NotContains(t,
					fx.Map(got, func(e *CardWithDepth) uint64 { return uint64(e.CardNo) }), deferredCard.CardNo)
				fx.Each(got, func(_ int, c *CardWithDepth) {
					if c.DeferUntil != nil {
						require.True(t, c.DeferUntil.Before(time.Now()))
					}
				})
			}

			if tt.args.where != nil && len(tt.args.where.Labels) > 0 {
				fx.Each(got, func(_ int, c *CardWithDepth) {
					for _, label := range tt.args.where.Labels {
						require.Containsf(t, c.Labels, label, "card=%d, labels=%v", c.CardNo, c.Labels)
					}
				})
			}

			if tt.args.startWhere != nil && tt.args.startWhere.CardType != "" {
				fx.Each(got, func(_ int, card *CardWithDepth) {
					if card.Depth == 0 {
						require.Equalf(t, tt.args.startWhere.CardType, card.CardType, "start with type %s, but got %v", tt.args.startWhere.CardType, card.CardType)
					}
				})
			}

			if tt.args.where != nil && tt.args.where.CardType != "" {
				fx.Each(got, func(_ int, card *CardWithDepth) {
					require.Equalf(t, tt.args.startWhere.CardType, card.CardType, "limit to type %s, but got %v", tt.args.startWhere.CardType, card.CardType)
				})
			}

		})
	}
}

func TestGetCard(t *testing.T) {
	ctx, cancel := context.WithCancel(context.Background())
	defer cancel()

	client := newTestClient(ctx, t)

	inProgressCard := &models.Card{}
	require.NoError(t, client.service.db.WithContext(ctx).Where("defer_until IS NULL AND completed_at IS NULL").Take(inProgressCard).Error)
	require.NotEqual(t, uint(0), inProgressCard.ID)

	deletedCard := &models.Card{}
	require.NoError(t, client.service.db.WithContext(ctx).Unscoped().Where("deleted_at IS NOT NULL").Take(deletedCard).Error)
	require.NotEqual(t, uint(0), deletedCard.ID)

	completedCard := &models.Card{}
	require.NoError(t, client.service.db.WithContext(ctx).Where("completed_at IS NOT NULL").Take(completedCard).Error)
	require.NotEqual(t, uint(0), completedCard.ID)

	deferredCard := &models.Card{}
	require.NoError(t, client.service.db.WithContext(ctx).Where("defer_until IS NULL OR defer_until < now() AND completed_at IS NOT NULL").Take(deferredCard).Error)
	require.NotEqual(t, uint(0), deferredCard.ID)

	type args struct {
		cardNo uint
	}
	tests := [...]struct {
		name    string
		args    args
		wantErr bool
	}{
		{`not exists`, args{math.MaxUint}, true},
		{`default`, args{inProgressCard.CardNo}, false},
		{`completed`, args{completedCard.CardNo}, false},
		{`deferred`, args{deferredCard.CardNo}, false},
		{`deleted`, args{deletedCard.CardNo}, true},
	}
	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			got, err := client.service.getCard(ctx, tt.args.cardNo)
			require.Truef(t, (err != nil) == tt.wantErr, `getCard() failed: error = %+v, wantErr = %v`, err, tt.wantErr)
			if tt.wantErr {
				return
			}
			_ = got
		})
	}
}

func TestCompleteCard(t *testing.T) {
	ctx, cancel := context.WithCancel(context.Background())
	defer cancel()

	client := newTestClient(ctx, t)
	card, teardown := newCardForTest(ctx, t, client.service, "test card for complete card")
	defer teardown()

	require.Nil(t, card.CompletedAt)

	// set completed
	{
		_, err := client.PatchCard(ctx, &proto.PatchCardReq{
			Fields: []proto.PatchCardReq_Field{proto.PatchCardReq_COMPLETED_AT},
			Card: &proto.Card{
				CardNo:      card.CardNo,
				CompletedAt: timestamppb.Now(),
			},
		})
		require.NoError(t, err)

		updated, err := client.GetCard(ctx, helper.UInt64(card.CardNo))
		require.NoError(t, err)
		require.NotNil(t, updated.CompletedAt)
		require.Less(t, time.Since(updated.CompletedAt.AsTime()), time.Second)
	}

	// set again will be failed
	{
		_, err := client.PatchCard(ctx, &proto.PatchCardReq{
			Fields: []proto.PatchCardReq_Field{proto.PatchCardReq_COMPLETED_AT},
			Card: &proto.Card{
				CardNo:      card.CardNo,
				CompletedAt: timestamppb.Now(),
			},
		})
		require.Error(t, err)
	}

	// turn to in-progress
	{
		_, err := client.PatchCard(ctx, &proto.PatchCardReq{
			Fields: []proto.PatchCardReq_Field{proto.PatchCardReq_COMPLETED_AT},
			Card: &proto.Card{
				CardNo:      card.CardNo,
				CompletedAt: nil,
			},
		})
		require.NoError(t, err)

		updated, err := client.GetCard(ctx, helper.UInt64(card.CardNo))
		require.NoError(t, err)
		require.Nil(t, updated.CompletedAt)
	}
}

func newCardForTest(ctx context.Context, t *testing.T, service *v1alpha1ServiceImpl, objective string) (*proto.Card, fixtures.Teardown) {
	card, err := service.AddCard(ctx, &proto.AddCardReq{Objective: objective})
	require.NoError(t, err, "fail to create card")

	return card, func() {
		_, err = service.DeleteCard(ctx, helper.UInt64(card.CardNo))
		require.NoError(t, err)
	}
}

func TestRankDown(t *testing.T) {
	ctx, cancel := context.WithCancel(context.Background())
	defer cancel()

	client := newTestClient(ctx, t)
	card1, teardown := newCardForTest(ctx, t, client.service, "test objective for rank #1")
	defer teardown()

	card2, teardown := newCardForTest(ctx, t, client.service, "test objective for rank #2")
	defer teardown()

	card3, teardown := newCardForTest(ctx, t, client.service, "test objective for rank #3")
	defer teardown()

	_ = card2
	_, err := client.RerankCard(ctx, &proto.RankCardReq{
		CardNo:       card1.CardNo,
		TargetCardNo: card3.CardNo,
	})
	require.NoError(t, err)
}

func TestGetParentChallenge(t *testing.T) {
	ctx, cancel := context.WithCancel(context.Background())
	defer cancel()

	client := newTestClient(ctx, t)

	type args struct {
		cardNo uint
	}
	tests := [...]struct {
		name     string
		args     args
		wantCard uint
		wantErr  bool
	}{
		{`valid`, args{cardNo: 2141}, 2107, false},
		{`valid`, args{cardNo: 2107}, 0, false},
	}
	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			got, err := client.service.getParentChallenge(ctx, tt.args.cardNo)
			require.Truef(t, (err != nil) == tt.wantErr, `getParentChallenge() failed: error = %+v, wantErr = %v`, err, tt.wantErr)
			if tt.wantErr {
				return
			}
			require.Equal(t, tt.wantCard, got)
		})
	}

}
