package v1alpha1

import (
	"context"

	"focus/models"
	proto "focus/proto/v1alpha1"

	"github.com/whitekid/goxp/fx"
	"google.golang.org/protobuf/types/known/wrapperspb"
)

func cardModelToChallenge(in *CardWithDepth) *proto.Challenge {
	return &proto.Challenge{
		Card:           cardModelToProto(in),
		TotalCards:     0,
		CompletedCards: 0,
	}
}

func (s *v1alpha1ServiceImpl) ListChallenges(ctx context.Context, req *proto.ListChallengesReq) (*proto.ListChallengesResp, error) {
	r, err := s.listCards(ctx,
		&models.Card{
			CardType: models.CardTypeChallenge.String(),
		},
		&models.Card{
			CardType: models.CardTypeChallenge.String(),
		},
		ListOpt{
			excludeCompleted: true,
		})
	if err != nil {
		return nil, err
	}

	return &proto.ListChallengesResp{
		Items: fx.Map(r, func(c *CardWithDepth) *proto.Challenge {
			ch := cardModelToChallenge(c)

			ch.TotalCards, ch.CompletedCards = s.getCardProgressSummary(ctx, c.CardNo)
			return ch
		}),
	}, nil
}

func (s *v1alpha1ServiceImpl) GetChallenge(ctx context.Context, req *wrapperspb.UInt64Value) (*proto.Challenge, error) {
	challenge, err := s.getCard(ctx, uint(req.Value))
	if err != nil {
		return nil, err
	}
	ch := cardModelToChallenge(challenge)
	ch.TotalCards, ch.CompletedCards = s.getCardProgressSummary(ctx, uint(req.Value))
	return ch, nil
}
