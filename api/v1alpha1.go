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

func (s *v1alpha1ServiceImpl) Version(ctx context.Context, _ *emptypb.Empty) (*wrapperspb.StringValue, error) {
	return &wrapperspb.StringValue{Value: "v1alpha1"}, nil
}

// user return current user
func (s *v1alpha1ServiceImpl) user(ctx context.Context) *models.User {
	user, _ := ctx.Value(keyUser).(*models.User)
	return user
}

// defaultWorkspace returns current user's default workspace
func (s *v1alpha1ServiceImpl) defaultWorkspace(ctx context.Context) *models.Workspace {
	ws, _ := ctx.Value(keyUserWorkspace).(*models.Workspace)
	return ws
}

func (s *v1alpha1ServiceImpl) QuickAddCard(ctx context.Context, in *wrapperspb.StringValue) (*proto.Card, error) {
	log.Debugf("quickAdd: subject=%v", in)

	if err := validate.Struct(&struct {
		Subject string `validate:"required"`
	}{
		Subject: in.Value,
	}); err != nil {
		return nil, status.Error(codes.InvalidArgument, err.Error())
	}

	newCard := &models.Card{
		Subject:     in.Value,
		CreatorID:   s.user(ctx).ID,
		WorkspaceID: s.defaultWorkspace(ctx).ID,
	}

	if err := s.db.Transaction(func(tx *gorm.DB) error {
		// TODO workspace 별로 card_no를 계산해야 할 것임
		cardNo := int64(0)
		if tx := s.db.Model(&models.Card{}).Unscoped().
			Where(&models.Card{WorkspaceID: s.defaultWorkspace(ctx).ID}).
			Count(&cardNo); tx.Error != nil {
			return status.Error(codes.Internal, "fail to get card count")
		}

		if cardNo != 0 {
			if err := s.db.Model(&models.Card{}).Unscoped().
				Where(&models.Card{WorkspaceID: s.defaultWorkspace(ctx).ID}).
				Select("max(card_no)").Row().Scan(&cardNo); err != nil {
				log.Errorf("%v", err)
				return status.Errorf(codes.Internal, "fail to get card_no")
			}
		}

		newCard.CardNo = uint(cardNo) + 1

		rank := int64(0)
		if tx := s.db.Model(&models.Card{}).Unscoped().
			Where(&models.Card{WorkspaceID: s.defaultWorkspace(ctx).ID}).
			Count(&rank); tx.Error != nil {
			return status.Error(codes.Internal, "fail to get rank")
		}

		if rank != 0 {
			if err := s.db.Model(&models.Card{}).Unscoped().
				Where(&models.Card{WorkspaceID: s.defaultWorkspace(ctx).ID}).
				Select("max(rank)").Row().Scan(&rank); err != nil {
				log.Errorf("%v", err)
				return status.Errorf(codes.Internal, "fail to get rank")
			}
		}

		newCard.Rank = uint(rank) + 1

		if tx := s.db.Save(newCard); tx.Error != nil {
			return status.Errorf(codes.Internal, "fail to save card")
		}

		return nil
	}); err != nil {
		return nil, err
	}

	return modelToProto(newCard), nil
}

func (s *v1alpha1ServiceImpl) RerankCard(ctx context.Context, req *proto.RankCardReq) (*emptypb.Empty, error) {
	card, err := s.getCard(ctx, uint(req.CardNo))
	if err != nil {
		return nil, status.Errorf(codes.NotFound, "card not found: %v", req.CardNo)
	}

	targetCard, err := s.getCard(ctx, uint(req.TargetCardNo))
	if err != nil {
		return nil, status.Errorf(codes.NotFound, "target card not found: %v", req.TargetCardNo)
	}

	if card.CardNo == targetCard.CardNo {
		return nil, status.Errorf(codes.InvalidArgument, "card and target are equal: %v", card.CardNo)
	}

	if card.Rank > targetCard.Rank { // rank up
		//
		//  1
		//  2   target.rank   <new rank here>
		//  3
		//  4
		//  5   card.rank
		//  6
		if err := s.db.Transaction(func(tx *gorm.DB) error {
			if tx := s.db.Model(&models.Card{}).
				Where("workspace_id = ?", s.defaultWorkspace(ctx).ID).
				Where("rank BETWEEN ? AND ?", targetCard.Rank, card.Rank).
				Update("rank", gorm.Expr("rank + 1")); tx.Error != nil {
				return tx.Error
			}

			if tx := s.db.Model(card).Update("rank", targetCard.Rank); tx.Error != nil {
				return tx.Error
			}

			return nil
		}); err != nil {
			return nil, err
		}
	} else { // rank down
		//
		//  1
		//  2   card.rank
		//  3
		//  4
		//  5   target.rank <new rank here>
		//  6
		//
		if err := s.db.Transaction(func(tx *gorm.DB) error {
			if tx := s.db.Model(&models.Card{}).
				Where("workspace_id = ?", s.defaultWorkspace(ctx).ID).
				Where("rank BETWEEN ? AND ?", card.Rank, targetCard.Rank).
				Update("rank", gorm.Expr("rank - 1")); tx.Error != nil {
				return tx.Error
			}

			if tx := s.db.Model(card).Update("rank", targetCard.Rank); tx.Error != nil {
				return tx.Error
			}

			return nil
		}); err != nil {
			return nil, err
		}
	}
	return helper.Empty(), nil
}

func (s *v1alpha1ServiceImpl) DeleteCard(ctx context.Context, req *wrapperspb.UInt64Value) (*emptypb.Empty, error) {
	log.Debugf("deleteCard(): card_no=%+v", req.Value)

	if err := validate.Struct(&struct {
		CardNo uint64 `validate:"required"`
	}{
		CardNo: req.Value,
	}); err != nil {
		return nil, status.Error(codes.InvalidArgument, err.Error())
	}

	if err := s.db.Transaction(func(tx *gorm.DB) error {
		return s.db.Delete(&models.Card{}, &models.Card{
			WorkspaceID: s.defaultWorkspace(ctx).ID,
			CardNo:      uint(req.Value)}).Error
	}); err != nil {
		return helper.Empty(), status.Errorf(codes.Internal, "delete failed: %v", err.Error())
	}

	return helper.Empty(), nil
}

func modelToProto(in *models.Card) *proto.Card {
	return &proto.Card{
		CardNo:       uint64(in.CardNo),
		ParentCardNo: helper.P(in.ParentCardNo),
		Depth:        uint32(in.Depth),
		CreatedAt:    timestamppb.New(in.CreatedAt),
		UpdatedAt:    timestamppb.New(in.UpdatedAt),
		CompletedAt: goxp.TernaryCF(in.CompletedAt == nil,
			func() *timestamppb.Timestamp { return nil },
			func() *timestamppb.Timestamp { return timestamppb.New(*in.CompletedAt) },
		),
		Subject: in.Subject,
		Content: in.Content,
	}
}

func (s *v1alpha1ServiceImpl) ListCards(ctx context.Context, req *proto.ListCardReq) (*proto.ListCardResp, error) {
	r, err := s.listCards(ctx, nil, ListOpt{excludeCompleted: req.ExcludeCompleted})
	if err != nil {
		return nil, err
	}

	return &proto.ListCardResp{
		Items: fx.Map(r, func(c *models.Card) *proto.Card { return modelToProto(c) }),
	}, nil
}

type ListOpt struct {
	CardNo           []uint
	excludeCompleted bool
}

/*
NOTE Tree 순서대로 쿼리하는 방법은 아래처럼 recursive를 사용하면 된다.
이 경우 depth를 지속적으로 코드상에서 괸리해야할 필요가 있어 코드 복잡도가 증가한다.
따라서 depth가 필요한 경우에 계속 유지하자.

즉 parent_card_no는 트리 관계를 유지, depth는 화면 표시용도

refer: https://www.alibabacloud.com/blog/postgresql-recursive-query-examples-of-depth-first-and-breadth-first-search_599373

WITH RECURSIVE cte AS (

	    SELECT cards.*, 0 as depth
	    FROM cards
	    WHERE parent_card_no IS NULL AND workspace_id = 1 AND completed_at is null and deleted_at is null
	UNION ALL
	    SELECT cards.*, depth + 1 AS depth
	    FROM cards
	    JOIN cte ON cte.card_no = cards.parent_card_no

)
SEARCH DEPTH FIRST BY rank SET ordercol
SELECT card_no, depth, subject FROM cte
ORDER BY ordercol
*/
func (s *v1alpha1ServiceImpl) listCards(ctx context.Context, where *models.Card, opt ListOpt) ([]*models.Card, error) {
	log.Debugf("listCards(): where=%v", where)

	tx := s.db
	if opt.excludeCompleted {
		tx = tx.Where("completed_at IS NULL")
	}

	if len(opt.CardNo) > 0 {
		tx = tx.Where("card_no IN ?", opt.CardNo)
	}

	r := make([]*models.Card, 0)
	if tx := tx.Order("rank, created_at").
		Where(&models.Card{WorkspaceID: s.defaultWorkspace(ctx).ID}).
		Where(where).Find(&r); tx.Error != nil {
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

func (s *v1alpha1ServiceImpl) GetCards(ctx context.Context, req *proto.GetCardReq) (*proto.GetCardResp, error) {
	if err := validate.Struct(&struct {
		IDs []uint64 `validate:"required"`
	}{
		IDs: req.CardNos,
	}); err != nil {
		return nil, status.Error(codes.InvalidArgument, err.Error())
	}

	r, err := s.listCards(ctx, nil, ListOpt{
		CardNo: fx.Map(req.CardNos, func(n uint64) uint { return uint(n) }),
	})
	if err != nil {
		return nil, err
	}
	if len(r) != len(req.CardNos) {
		return nil, status.Errorf(codes.NotFound, "expected %d but got %d", len(req.CardNos), len(r))
	}

	resp := &proto.GetCardResp{
		Items: make(map[uint64]*proto.Card),
	}

	fx.Each(r, func(_ int, c *models.Card) {
		resp.Items[uint64(c.CardNo)] = modelToProto(c)
	})

	return resp, nil
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

func (s *v1alpha1ServiceImpl) PatchCard(ctx context.Context, req *proto.PatchCardReq) (*proto.Card, error) {
	card, err := s.getCard(ctx, uint(req.Card.CardNo))
	if err != nil {
		return nil, err
	}

	updates := map[string]any{}
	for _, field := range req.Fields {
		switch field {
		case proto.CardField_SUBJECT:
			updates["subject"] = req.Card.Subject
		case proto.CardField_CONTENT:
			updates["content"] = req.Card.Content
		case proto.CardField_COMPLETED_AT:
			if req.Card.CompletedAt == nil {
				if card.CompletedAt == nil {
					return nil, status.Errorf(codes.AlreadyExists, "already in progress status")
				}
				updates["completed_at"] = gorm.Expr("NULL")
			} else {
				if card.CompletedAt != nil {
					return nil, status.Errorf(codes.AlreadyExists, "already completed")
				}
				updates["completed_at"] = req.Card.CompletedAt.AsTime()
			}
		default:
			log.Warnf("unknown field: %v", field)
		}
	}

	if len(updates) == 0 {
		return nil, status.Error(codes.InvalidArgument, "no columns to update")
	}

	if err := s.db.Transaction(func(tx *gorm.DB) error {
		updates["updated_at"] = time.Now()
		if tx := s.db.Model(card).UpdateColumns(updates); tx.Error != nil {
			return tx.Error
		}

		return nil
	}); err != nil {
		return nil, err
	}

	card, err = s.getCard(ctx, uint(req.Card.CardNo))
	if err != nil {
		return nil, err
	}

	return modelToProto(card), nil
}
