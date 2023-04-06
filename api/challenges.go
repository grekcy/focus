package api

import (
	"context"

	"focus/models"
	"focus/proto"

	"github.com/whitekid/goxp/fx"
	"google.golang.org/protobuf/types/known/wrapperspb"
)

func cardModelToChallenge(in *CardWithDepth) *proto.Challenge {
	return &proto.Challenge{
		Card:            cardModelToProto(in),
		TotalCards:      0,
		CompletedCards:  0,
		InprogressCards: 0,
	}
}

func (s *v1alpha1ServiceImpl) ListChallenges(ctx context.Context, req *proto.ListChallengesReq) (*proto.ListChallengesResp, error) {
	r, err := s.listCards(ctx, &models.Card{CardType: "challenge"}, ListOpt{})
	if err != nil {
		return nil, err
	}

	return &proto.ListChallengesResp{
		Items: fx.Map(r, func(c *CardWithDepth) *proto.Challenge { return cardModelToChallenge(c) }),
	}, nil
}

func (s *v1alpha1ServiceImpl) GetChallenge(ctx context.Context, req *wrapperspb.UInt64Value) (*proto.Challenge, error) {
	challenge, err := s.getCard(ctx, uint(req.Value))
	if err != nil {
		return nil, err
	}
	return cardModelToChallenge(challenge), nil
}
