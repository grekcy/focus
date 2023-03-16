package api

import (
	"context"
	"time"

	"github.com/whitekid/goxp/fx"
	"google.golang.org/grpc/codes"
	status "google.golang.org/grpc/status"
	"google.golang.org/protobuf/types/known/emptypb"
	timestamppb "google.golang.org/protobuf/types/known/timestamppb"
	"google.golang.org/protobuf/types/known/wrapperspb"
	"gorm.io/gorm"

	"focus/models"
	"focus/proto"
)

type v1alpha1ServiceImpl struct {
	proto.UnimplementedV1Alpha1Server

	cards []*models.Card // TODO store to database
}

func newV1Alpha1Service() proto.V1Alpha1Server {
	return &v1alpha1ServiceImpl{
		cards: make([]*models.Card, 0),
	}
}

func (s *v1alpha1ServiceImpl) Version(context.Context, *emptypb.Empty) (*wrapperspb.StringValue, error) {
	return &wrapperspb.StringValue{Value: "v1alpha1"}, nil
}

func (s *v1alpha1ServiceImpl) QuickAddCard(ctx context.Context, in *proto.Card) (*proto.Card, error) {
	if in.Subject == "" {
		return nil, status.Errorf(codes.InvalidArgument, "subject required")
	}

	newCard := &models.Card{
		Model: &gorm.Model{
			ID:        uint(len(s.cards) + 1),
			CreatedAt: time.Now(),
		},
		CardNo:  uint(len(s.cards) + 1),
		Subject: in.Subject,
	}
	s.cards = append(s.cards, newCard)

	return modelToProto(newCard), nil
}

func modelToProto(in *models.Card) *proto.Card {
	return &proto.Card{
		No:        int64(in.CardNo),
		Subject:   in.Subject,
		CreatedAt: timestamppb.New(in.CreatedAt),
	}
}

func (s *v1alpha1ServiceImpl) ListCards(context.Context, *emptypb.Empty) (*proto.CardListResp, error) {
	return &proto.CardListResp{
		Items: fx.Map(s.cards, func(c *models.Card) *proto.Card { return modelToProto(c) }),
	}, nil
}
