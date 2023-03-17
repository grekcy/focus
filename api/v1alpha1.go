package api

import (
	"context"
	"time"

	"github.com/whitekid/goxp"
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

func (s *v1alpha1ServiceImpl) QuickAddCard(ctx context.Context, req *proto.Card) (*proto.Card, error) {
	log.Debugf("quickAdd: subject=%v", req)

	if err := validate.Struct(&struct {
		Subject string `validate:"required"`
	}{
		Subject: req.Subject,
	}); err != nil {
		return nil, status.Error(codes.InvalidArgument, err.Error())
	}

	newCard := &models.Card{
		Subject: req.Subject,
	}

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

func (s *v1alpha1ServiceImpl) DeleteCard(ctx context.Context, req *wrapperspb.UInt64Value) (*emptypb.Empty, error) {
	log.Debugf("deleteCard(): no=%+v", req.Value)

	if err := validate.Struct(&struct {
		CardNo uint64 `validate:"required"`
	}{
		CardNo: req.Value,
	}); err != nil {
		return nil, status.Error(codes.InvalidArgument, err.Error())
	}

	// TODO cardNo는 key가 아님... 따라서 workspace 정보와 같이 지워야하겠음.
	if err := s.db.Transaction(func(tx *gorm.DB) error {
		return s.db.Delete(&models.Card{}, &models.Card{CardNo: uint(req.Value)}).Error
	}); err != nil {
		return helper.Empty(), status.Errorf(codes.Internal, "delete failed: %v", err.Error())
	}

	return helper.Empty(), nil
}

func modelToProto(in *models.Card) *proto.Card {
	return &proto.Card{
		CardNo:    uint64(in.CardNo),
		Subject:   in.Subject,
		CreatedAt: timestamppb.New(in.CreatedAt),
		CompletedAt: goxp.TernaryCF(in.CompletedAt == nil,
			func() *timestamppb.Timestamp { return nil },
			func() *timestamppb.Timestamp { return timestamppb.New(*in.CompletedAt) },
		),
	}
}

func (s *v1alpha1ServiceImpl) ListCards(ctx context.Context, _ *emptypb.Empty) (*proto.CardListResp, error) {
	r, err := s.listCards(ctx, nil, ListOpt{excludeCompleted: true})
	if err != nil {
		return nil, err
	}

	return &proto.CardListResp{
		Items: fx.Map(r, func(c *models.Card) *proto.Card { return modelToProto(c) }),
	}, nil
}

type ListOpt struct {
	excludeCompleted bool
}

func (s *v1alpha1ServiceImpl) listCards(ctx context.Context, where *models.Card, opt ListOpt) ([]*models.Card, error) {
	log.Debugf("listCards(): where=%v", where)

	tx := s.db
	if opt.excludeCompleted {
		tx = tx.Where("completed_at IS NULL")
	}

	r := make([]*models.Card, 0)
	if tx := tx.Order("rank DESC, created_at").Where(where).Find(&r); tx.Error != nil {
		return nil, status.Errorf(codes.Internal, "fail to find cards: %+v", tx.Error)
	}

	return r, nil
}

func (s *v1alpha1ServiceImpl) GetCard(ctx context.Context, cardNo *wrapperspb.UInt64Value) (*proto.Card, error) {
	if err := validate.Struct(&struct {
		CardNo uint64 `validate:"required"`
	}{
		CardNo: cardNo.Value,
	}); err != nil {
		return nil, status.Error(codes.InvalidArgument, err.Error())
	}

	card, err := s.getCard(ctx, uint(cardNo.Value))
	if err != nil {
		return nil, err
	}

	return modelToProto(card), nil
}

func (s *v1alpha1ServiceImpl) getCard(ctx context.Context, cardNo uint) (*models.Card, error) {
	r, err := s.listCards(ctx, &models.Card{CardNo: cardNo}, ListOpt{})
	if err != nil {
		return nil, err
	}

	switch len(r) {
	case 0:
		return nil, status.Errorf(codes.NotFound, "card not found: %v", cardNo)
	case 1:
		return r[0], nil
	default:
		return nil, status.Errorf(codes.Internal, "multiple card found: %v, count=%d", cardNo, len(r))
	}
}

func (s *v1alpha1ServiceImpl) CompleteCard(ctx context.Context, req *proto.CompleteCardReq) (*emptypb.Empty, error) {
	if err := validate.Struct(&struct {
		CardNo uint64 `validate:"required"`
	}{
		CardNo: req.CardNo,
	}); err != nil {
		return nil, status.Error(codes.InvalidArgument, err.Error())
	}

	card, err := s.getCard(ctx, uint(req.CardNo))
	if err != nil {
		return nil, err
	}

	if req.Complted {
		if card.CompletedAt != nil {

			return nil, status.Errorf(codes.AlreadyExists, "already completed at %v", card.CreatedAt.String())
		}
	} else {
		if card.CompletedAt == nil {

			return nil, status.Errorf(codes.AlreadyExists, "already not completed")
		}
	}

	if err := s.db.Transaction(func(tx *gorm.DB) error {
		if req.Complted {
			tx = tx.Model(card).Update("completed_at", time.Now())
		} else {
			tx = tx.Model(card).Update("completed_at", gorm.Expr("NULL"))
		}

		if tx.RowsAffected != 1 {

			return status.Error(codes.Internal, "updates but multiple record affected.")
		}
		return nil
	}); err != nil {
		return nil, err
	}

	return helper.Empty(), nil
}
