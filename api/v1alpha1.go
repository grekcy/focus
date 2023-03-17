package api

import (
	"context"

	"github.com/pkg/errors"
	"github.com/whitekid/goxp/fx"
	"github.com/whitekid/goxp/log"
	"github.com/whitekid/goxp/validate"
	"google.golang.org/grpc/codes"
	status "google.golang.org/grpc/status"
	"google.golang.org/protobuf/types/known/emptypb"
	timestamppb "google.golang.org/protobuf/types/known/timestamppb"
	"google.golang.org/protobuf/types/known/wrapperspb"
	"gorm.io/gorm"

	"focus/helper"
	"focus/models"
	"focus/proto"
)

type v1alpha1ServiceImpl struct {
	proto.UnimplementedV1Alpha1Server

	db *gorm.DB
}

func newV1Alpha1Service(db *gorm.DB) proto.V1Alpha1Server {
	return &v1alpha1ServiceImpl{
		db: db,
	}
}

func (s *v1alpha1ServiceImpl) Version(context.Context, *emptypb.Empty) (*wrapperspb.StringValue, error) {
	return &wrapperspb.StringValue{Value: "v1alpha1"}, nil
}

func (s *v1alpha1ServiceImpl) QuickAddCard(ctx context.Context, in *proto.Card) (*proto.Card, error) {
	newCard := &models.Card{
		Subject: in.Subject,
	}

	if err := validate.Struct(newCard); err != nil {
		return nil, status.Error(codes.InvalidArgument, err.Error())
	}

	log.Debugf("quickAdd: subject=%v", newCard.Subject)

	if err := s.db.Transaction(func(tx *gorm.DB) error {
		// TODO workspace 별로 card_no를 계산해야 할 것임
		cardNo := int64(0)
		if tx := s.db.Model(&models.Card{}).Unscoped().Count(&cardNo); tx.Error != nil {
			return status.Error(codes.Internal, "fail to get card count")
		}

		if cardNo != 0 {
			if err := s.db.Model(&models.Card{}).Unscoped().Select("max(card_no)").Row().Scan(&cardNo); err != nil {
				log.Errorf("%v", err)
				return status.Errorf(codes.Internal, "fail to get card_no")
			}
		}

		newCard.CardNo = uint(cardNo) + 1

		if tx := s.db.Save(newCard); tx.Error != nil {
			return status.Errorf(codes.Internal, "fail to save card")
		}

		return nil
	}); err != nil {
		return nil, err
	}

	return modelToProto(newCard), nil
}

func (s *v1alpha1ServiceImpl) DeleteCard(ctx context.Context, in *wrapperspb.UInt64Value) (*emptypb.Empty, error) {
	// TODO cardNo는 key가 아님... 따라서 workspace 정보와 같이 지워야하겠음.
	if err := s.db.Transaction(func(tx *gorm.DB) error {
		return s.db.Delete(&models.Card{}, &models.Card{CardNo: uint(in.Value)}).Error
	}); err != nil {
		return helper.Empty(), status.Errorf(codes.Internal, "delete failed: %v", err.Error())
	}

	return helper.Empty(), nil
}

func modelToProto(in *models.Card) *proto.Card {
	return &proto.Card{
		No:        uint64(in.CardNo),
		Subject:   in.Subject,
		CreatedAt: timestamppb.New(in.CreatedAt),
	}
}

func (s *v1alpha1ServiceImpl) ListCards(context.Context, *emptypb.Empty) (*proto.CardListResp, error) {
	r := make([]*models.Card, 0)
	if tx := s.db.Order("rank DESC, created_at").Find(&r); tx.Error != nil {
		return nil, errors.Wrap(tx.Error, "fail to find cards")
	}

	return &proto.CardListResp{
		Items: fx.Map(r, func(c *models.Card) *proto.Card { return modelToProto(c) }),
	}, nil
}
