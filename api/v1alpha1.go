package api

import (
	"context"
	"fmt"
	"time"

	"github.com/lib/pq"
	"github.com/pkg/errors"
	"github.com/whitekid/goxp/fx"
	"github.com/whitekid/goxp/log"
	"github.com/whitekid/goxp/validate"
	"google.golang.org/grpc/codes"
	"google.golang.org/grpc/status"
	"google.golang.org/protobuf/types/known/emptypb"
	"google.golang.org/protobuf/types/known/timestamppb"
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
	log.Debugf("quickAdd: objective=%v", in)

	if err := validate.Struct(&struct {
		Objective string `validate:"required"`
	}{
		Objective: in.Value,
	}); err != nil {
		return nil, status.Error(codes.InvalidArgument, err.Error())
	}

	newCard := &CardWithDepth{
		Card: &models.Card{
			Objective:   in.Value,
			CreatorID:   s.user(ctx).ID,
			WorkspaceID: s.defaultWorkspace(ctx).ID,
		},
	}

	if err := s.db.Transaction(func(tx *gorm.DB) error {
		if err := s.db.Unscoped().Model(&models.Card{}).
			Where(&models.Card{WorkspaceID: s.defaultWorkspace(ctx).ID}).
			Select("COALESCE(max(card_no), 0, max(card_no)) + 1").Row().Scan(&newCard.CardNo); err != nil {
			log.Errorf("%v", err)
			return status.Errorf(codes.Internal, "fail to get card_no")
		}

		if err := s.db.Model(&models.Card{}).Unscoped().
			Where(&models.Card{WorkspaceID: s.defaultWorkspace(ctx).ID}).
			Select("COALESCE(max(rank), 0, max(rank)) +1").Row().Scan(&newCard.Rank); err != nil {
			return status.Errorf(codes.Internal, "fail to get rank")
		}

		if tx := s.db.Save(newCard.Card); tx.Error != nil {
			return status.Errorf(codes.Internal, "fail to save card")
		}

		return nil
	}); err != nil {
		return nil, err
	}

	return cardModelToProto(newCard), nil
}

func (s *v1alpha1ServiceImpl) RerankCard(ctx context.Context, req *proto.RankCardReq) (*emptypb.Empty, error) {
	log.Debugf("RerankCard(): card=%v, target=%v", req.CardNo, req.TargetCardNo)

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
			tx = s.db.Model(&models.Card{}).
				Where("workspace_id = ?", s.defaultWorkspace(ctx).ID).
				Where("rank BETWEEN ? AND ?", targetCard.Rank, card.Rank)

			if targetCard.ParentCardNo == nil {
				tx = tx.Where("parent_card_no IS NULL")
			} else {
				tx = tx.Where("parent_card_no = ?", targetCard.ParentCardNo)
			}

			if tx := tx.UpdateColumn("rank", gorm.Expr("rank + 1")); tx.Error != nil {
				return tx.Error
			}

			if tx := s.db.Model(card.Card).UpdateColumns(map[string]any{
				"rank":           targetCard.Rank,
				"parent_card_no": targetCard.ParentCardNo,
			}); tx.Error != nil {
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
			tx = s.db.Model(&models.Card{}).
				Where("workspace_id = ?", s.defaultWorkspace(ctx).ID).
				Where("rank BETWEEN ? AND ?", card.Rank, targetCard.Rank-1)

			if targetCard.ParentCardNo == nil {
				tx = tx.Where("parent_card_no IS NULL")
			} else {
				tx = tx.Where("parent_card_no = ?", targetCard.ParentCardNo)
			}

			if tx := tx.UpdateColumn("rank", gorm.Expr("rank - 1")); tx.Error != nil {
				return tx.Error
			}

			if tx := s.db.Model(card.Card).UpdateColumns(map[string]any{
				"rank":           targetCard.Rank - 1,
				"parent_card_no": targetCard.ParentCardNo,
			}); tx.Error != nil {
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
		tx = s.db.Delete(&models.Card{}, &models.Card{
			WorkspaceID: s.defaultWorkspace(ctx).ID,
			CardNo:      uint(req.Value)})
		if tx.Error != nil {
			return errors.Wrapf(tx.Error, "fail to delete card: %+v", tx.Error)
		}

		if tx.RowsAffected != 1 {
			log.Warnf("delete exactly id=%v, but deleted %d", req.Value, tx.RowsAffected)
		}

		return nil
	}); err != nil {
		return helper.Empty(), status.Errorf(codes.Internal, "delete failed: %v", err.Error())
	}

	return helper.Empty(), nil
}

func cardModelToProto(in *CardWithDepth) *proto.Card {
	return &proto.Card{
		CardNo:       uint64(in.CardNo),
		ParentCardNo: helper.PP(in.ParentCardNo),
		Depth:        uint32(in.Depth),
		CreatedAt:    timestamppb.New(in.CreatedAt),
		UpdatedAt:    timestamppb.New(in.UpdatedAt),
		DeferUntil:   helper.NewTimestamppb(in.DeferUntil),
		DueDate:      helper.NewTimestamppb(in.DueDate),
		CompletedAt:  helper.NewTimestamppb(in.CompletedAt),
		CreatorId:    uint64(in.CreatorID),
		Objective:    in.Objective,
		Content:      in.Content,
		Labels:       helper.ArrayToProto(in.Labels),
	}
}

func (s *v1alpha1ServiceImpl) ListCards(ctx context.Context, req *proto.ListCardReq) (*proto.ListCardResp, error) {
	log.Debugf("ListCards(), req=%+v", req)

	where := &models.Card{
		Labels: helper.ToArray(req.Card.Labels),
	}

	r, err := s.listCards(ctx, where, ListOpt{
		excludeCompleted:  req.ExcludeCompleted,
		excludeChallenges: req.ExcludeChallenges,
		excludeDeferred:   !req.IncludeDeferred,
	})
	if err != nil {
		return nil, err
	}

	return &proto.ListCardResp{
		Items: fx.Map(r, func(c *CardWithDepth) *proto.Card { return cardModelToProto(c) }),
	}, nil
}

type ListOpt struct {
	CardNo            []uint
	excludeCompleted  bool
	excludeChallenges bool
	excludeDeferred   bool
}

type CardWithDepth struct {
	*models.Card

	Depth uint
}

/*
NOTE Tree 순서대로 쿼리하는 방법은 아래처럼 recursive를 사용하면 된다.
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
SELECT * FROM cte
ORDER BY ordercol
*/
func (s *v1alpha1ServiceImpl) listCards(ctx context.Context, where *models.Card, opt ListOpt) ([]*CardWithDepth, error) {
	// non recursive query는 시작할 카드를 지정함
	nonRecursiveQuery := s.db.ToSQL(func(tx *gorm.DB) *gorm.DB {
		tx = tx.Model(&models.Card{}).
			Select("cards.*, 0 as depth").
			Where("parent_card_no IS NULL").
			Where("workspace_id = ?", s.defaultWorkspace(ctx).ID)
		if where != nil {
			if where.ParentCardNo != nil && *where.ParentCardNo > 0 {
				tx = tx.Where("parent_card_no = ?", where.ParentCardNo)
			} else {
				tx = tx.Where("parent_card_no IS NULL")
			}
		}

		tx = tx.Find(&[]models.Card{})

		return tx
	})

	query := s.db.ToSQL(func(tx *gorm.DB) *gorm.DB {
		tx = tx.Select("*")
		if opt.excludeCompleted {
			tx = tx.Where("completed_at IS NULL")
		}

		if opt.excludeDeferred {
			tx = tx.Where("defer_until IS NULL OR defer_until < now()")
		}

		if where != nil {
			if where.CardNo != 0 {
				tx = tx.Where("card_no = ?", where.CardNo)
			}

			if len(where.Labels) > 0 {
				tx = tx.Where("? <@ labels", where.Labels)
			}
		}

		if len(opt.CardNo) > 0 {
			if where != nil && where.CardNo > 0 {
				tx.AddError(errors.New(`can not provide card no and card no list`))
				return tx
			}

			tx = tx.Where("card_no IN ?", opt.CardNo)
		}

		tx = tx.Table("cte").Order("ordercol, rank, created_at").Find(&[]models.Card{})

		return tx
	})

	r := make([]*CardWithDepth, 0)
	if tx := s.db.Raw(fmt.Sprintf(`WITH RECURSIVE cte AS (
        %s
    UNION ALL
        SELECT cards.*, depth + 1 AS depth
        FROM cards
        JOIN cte ON cte.card_no = cards.parent_card_no
)
SEARCH DEPTH FIRST BY rank SET ordercol
%s`, nonRecursiveQuery, query)).Scan(&r); tx.Error != nil {
		return nil, status.Errorf(codes.Internal, "fail to list cards: %+v", errors.Wrap(tx.Error, "list card failed"))
	}

	return r, nil
}

func (s *v1alpha1ServiceImpl) GetCard(ctx context.Context, cardNo *wrapperspb.UInt64Value) (*proto.Card, error) {
	log.Debugf("GetCard(): card=%v", cardNo.Value)

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

	return cardModelToProto(card), nil
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

	if len(r) == 0 {
		return nil, status.Errorf(codes.NotFound, "not found")
	}

	if len(r) != len(req.CardNos) {
		return nil, status.Errorf(codes.NotFound, "expected %d but got %d", len(req.CardNos), len(r))
	}

	resp := &proto.GetCardResp{
		Items: make(map[uint64]*proto.Card),
	}

	fx.Each(r, func(_ int, c *CardWithDepth) {
		resp.Items[uint64(c.CardNo)] = cardModelToProto(c)
	})

	return resp, nil
}

func (s *v1alpha1ServiceImpl) getCard(ctx context.Context, cardNo uint) (*CardWithDepth, error) {
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
	log.Debugf("PatchCard: req=%+v", req)

	card, err := s.getCard(ctx, uint(req.Card.CardNo))
	if err != nil {
		return nil, err
	}

	updates := map[string]any{}
	for _, field := range req.Fields {
		switch field {
		case proto.CardField_OBJECTIVE:
			updates["objective"] = req.Card.Objective

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

		case proto.CardField_PARENT_CARD:
			tx := s.db
			if req.Card.ParentCardNo == nil {
				updates["parent_card_no"] = gorm.Expr("NULL")
				tx = tx.Where("parent_card_no IS NULL")
			} else {
				updates["parent_card_no"] = req.Card.ParentCardNo
				tx = tx.Where("parent_card_no = ?", req.Card.ParentCardNo)
			}

			// get new rank
			rank := uint(0)
			if err := tx.Model(&models.Card{}).Unscoped().
				Where(&models.Card{WorkspaceID: s.defaultWorkspace(ctx).ID}).
				Select("COALESCE(MAX(rank), 0, MAX(rank)) + 1").Row().Scan(&rank); err != nil {
				return nil, status.Errorf(codes.Internal, "fail to get new rank")
			}
			log.Debugf("new rank: %v", rank)
			updates["rank"] = rank

		case proto.CardField_LABEL:
			updates["labels"] = pq.Int64Array(fx.Map(req.Card.Labels, func(x uint64) int64 { return int64(x) }))

		case proto.CardField_DEFER_UNTIL:
			if req.Card.DeferUntil == nil {
				updates["defer_until"] = gorm.Expr("NULL")
			} else {
				updates["defer_until"] = req.Card.DeferUntil.AsTime()
			}

		case proto.CardField_DUE_DATE:
			if req.Card.DueDate == nil {
				updates["due_date"] = gorm.Expr("NULL")
			} else {
				updates["due_date"] = req.Card.DueDate.AsTime()
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
		if tx := s.db.Model(card.Card).UpdateColumns(updates); tx.Error != nil {
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

	return cardModelToProto(card), nil
}
