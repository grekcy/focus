package v1alpha1

import (
	"context"
	"fmt"
	"time"

	"github.com/lib/pq"
	"github.com/pkg/errors"
	"github.com/whitekid/goxp"
	"github.com/whitekid/goxp/fx"
	"github.com/whitekid/goxp/log"
	"github.com/whitekid/goxp/validate"
	"github.com/whitekid/grpcx"
	"google.golang.org/grpc/codes"
	"google.golang.org/grpc/status"
	"google.golang.org/protobuf/types/known/emptypb"
	"google.golang.org/protobuf/types/known/timestamppb"
	"google.golang.org/protobuf/types/known/wrapperspb"
	"gorm.io/gorm"

	"focus/helper"
	"focus/models"
	proto "focus/proto/v1alpha1"
)

func (s *v1alpha1ServiceImpl) AddCard(ctx context.Context, req *proto.AddCardReq) (*proto.Card, error) {
	log.Debugf("addCard(): req=%v", req)

	if err := validate.Struct(&struct {
		Objective string `validate:"required"`
	}{
		Objective: req.Objective,
	}); err != nil {
		return nil, status.Error(codes.InvalidArgument, err.Error())
	}

	r, err := s.addCard(ctx, req.Objective,
		goxp.TernaryCF(req.AddAfter == nil, func() uint { return 0 }, func() uint { return uint(*req.AddAfter) }))
	if err != nil {
		return nil, err
	}
	return cardModelToProto(r), nil
}

func (s *v1alpha1ServiceImpl) addCard(ctx context.Context, objective string, addAfter uint) (*CardWithDepth, error) {
	var parentCardNo *uint
	var rank uint
	if addAfter != 0 {
		card, err := s.getCard(ctx, addAfter)
		if err != nil {
			return nil, status.Error(codes.InvalidArgument, err.Error())
		}
		parentCardNo = card.ParentCardNo
		rank = card.Rank + 1
	}

	newCard := &CardWithDepth{
		Card: &models.Card{
			Objective:    objective,
			ParentCardNo: parentCardNo,
			CardType:     models.CardTypeCard.String(),
			CreatorID:    s.currentUser(ctx).ID,
			WorkspaceID:  s.currentWorkspace(ctx).ID,
			Rank:         rank,
		},
	}

	if err := s.db.WithContext(ctx).Transaction(func(txn *gorm.DB) error {
		if err := txn.Unscoped().Model(&models.Card{}).
			Where(&models.Card{WorkspaceID: s.currentWorkspace(ctx).ID}).
			Select("COALESCE(max(card_no), 0, max(card_no)) + 1").Row().Scan(&newCard.CardNo); err != nil {
			log.Errorf("%v", err)
			return status.Errorf(codes.Internal, "fail to get card_no")
		}

		if newCard.Rank == 0 {
			if err := txn.Model(&models.Card{}).Unscoped().
				Where(&models.Card{WorkspaceID: s.currentWorkspace(ctx).ID}).
				Select("COALESCE(max(rank), 0, max(rank)) +1").Row().Scan(&newCard.Rank); err != nil {
				return status.Errorf(codes.Internal, "fail to get rank")
			}
		} else {
			tx := txn.Model(&models.Card{}).
				Where("workspace_id = ?", s.currentWorkspace(ctx).ID).
				Where("rank >= ?", rank)
			if newCard.ParentCardNo == nil {
				tx = tx.Where("parent_card_no IS NULL")
			} else {
				tx = tx.Where("parent_card_no = ?", newCard.ParentCardNo)
			}

			// 기존 rank를 조정
			if tx := tx.UpdateColumn("rank", gorm.Expr("rank+1")); tx.Error != nil {
				return tx.Error
			}
		}

		if tx := txn.Create(newCard.Card); tx.Error != nil {
			return status.Errorf(codes.Internal, "fail to add card")
		}

		return nil
	}); err != nil {
		return nil, err
	}

	return newCard, nil
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
		if err := s.db.WithContext(ctx).Transaction(func(txn *gorm.DB) error {
			tx := txn.Model(&models.Card{}).
				Where("workspace_id = ?", s.currentWorkspace(ctx).ID).
				Where("rank BETWEEN ? AND ?", targetCard.Rank, card.Rank)

			if targetCard.ParentCardNo == nil {
				tx = tx.Where("parent_card_no IS NULL")
			} else {
				tx = tx.Where("parent_card_no = ?", targetCard.ParentCardNo)
			}

			if tx := tx.UpdateColumn("rank", gorm.Expr("rank + 1")); tx.Error != nil {
				return tx.Error
			}

			if tx := txn.Model(card.Card).UpdateColumns(map[string]any{
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
		if err := s.db.WithContext(ctx).Transaction(func(txn *gorm.DB) error {
			tx := txn.Model(&models.Card{}).
				Where("workspace_id = ?", s.currentWorkspace(ctx).ID).
				Where("rank BETWEEN ? AND ?", card.Rank, targetCard.Rank-1)

			if targetCard.ParentCardNo == nil {
				tx = tx.Where("parent_card_no IS NULL")
			} else {
				tx = tx.Where("parent_card_no = ?", targetCard.ParentCardNo)
			}

			if tx := tx.UpdateColumn("rank", gorm.Expr("rank - 1")); tx.Error != nil {
				return tx.Error
			}

			if tx := txn.Model(card.Card).UpdateColumns(map[string]any{
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
	return grpcx.Empty(), nil
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

	if err := s.db.WithContext(ctx).Transaction(func(txn *gorm.DB) error {
		tx := txn.Delete(&models.Card{}, &models.Card{
			WorkspaceID: s.currentWorkspace(ctx).ID,
			CardNo:      uint(req.Value)})
		if tx.Error != nil {
			return errors.Wrapf(tx.Error, "fail to delete card: %+v", tx.Error)
		}

		if tx.RowsAffected != 1 {
			log.Warnf("delete exactly id=%v, but deleted %d", req.Value, tx.RowsAffected)
		}

		return nil
	}); err != nil {
		return grpcx.Empty(), status.Errorf(codes.Internal, "delete failed: %v", err.Error())
	}

	return grpcx.Empty(), nil
}

func cardModelToProto(in *CardWithDepth) *proto.Card {
	return &proto.Card{
		Uid:              in.UID,
		CardNo:           uint64(in.CardNo),
		ParentCardNo:     helper.PP[uint, uint64](in.ParentCardNo),
		Depth:            uint32(in.Depth),
		CreatedAt:        timestamppb.New(in.CreatedAt),
		UpdatedAt:        timestamppb.New(in.UpdatedAt),
		DeferUntil:       grpcx.Timestamppb(in.DeferUntil),
		DueDate:          grpcx.Timestamppb(in.DueDate),
		CompletedAt:      grpcx.Timestamppb(in.CompletedAt),
		CreatorId:        uint64(in.CreatorID),
		ResponsibilityId: helper.PP[uint, uint64](in.ResponsibilityID),
		CardType:         in.CardType,
		Status:           in.Status,
		Objective:        in.Objective,
		Content:          in.Content,
		Labels:           helper.ArrayToProto(in.Labels),
	}
}

func protoCardToModel(in *proto.Card) *models.Card {
	if in == nil {
		return nil
	}

	r := &models.Card{
		CreatorID:        uint(in.CreatorId),
		ResponsibilityID: helper.PP[uint64, uint](in.ResponsibilityId),
		CardNo:           uint(in.CardNo),
		ParentCardNo:     helper.PP[uint64, uint](in.ParentCardNo),
		DeferUntil:       grpcx.TimestampToTimeP(in.DeferUntil),
		DueDate:          grpcx.TimestampToTimeP(in.DueDate),
		CompletedAt:      grpcx.TimestampToTimeP(in.CompletedAt),
		CardType:         in.CardType,
		Status:           in.Status,
		Labels:           helper.ToArray(in.Labels),
	}

	return r
}

func (s *v1alpha1ServiceImpl) ListCards(ctx context.Context, req *proto.ListCardReq) (*proto.ListCardResp, error) {
	log.Debugf("ListCards(), req=%+v", req)

	start := protoCardToModel(req.StartCond)
	where := protoCardToModel(req.Cond)

	r, err := s.listCards(ctx, start, where, ListOpt{
		excludeCompleted: req.ExcludeCompleted,
		excludeDeferred:  !req.IncludeDeferred,
	})
	if err != nil {
		return nil, err
	}

	return &proto.ListCardResp{
		Items: fx.Map(r, func(c *CardWithDepth) *proto.Card { return cardModelToProto(c) }),
	}, nil
}

type ListOpt struct {
	CardNo           []uint
	excludeCompleted bool
	excludeDeferred  bool
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
func (s *v1alpha1ServiceImpl) listCards(ctx context.Context, startWhere *models.Card, where *models.Card, opt ListOpt) ([]*CardWithDepth, error) {
	log.Debugf("listCards(): start=%+v, where=%+v, opt=%+v", startWhere, where, opt)

	// non recursive query는 시작할 카드를 지정함
	nonRecursiveQuery := s.db.ToSQL(func(tx *gorm.DB) *gorm.DB {
		tx = tx.Model(&models.Card{}).
			Select("cards.*, 0 as depth").
			Where("workspace_id = ?", s.currentWorkspace(ctx).ID)
		if startWhere != nil && startWhere.ParentCardNo != nil && *startWhere.ParentCardNo > 0 {
			tx = tx.Where("parent_card_no = ?", startWhere.ParentCardNo)
		} else {
			tx = tx.Where("parent_card_no IS NULL")
		}

		if opt.excludeCompleted {
			tx = tx.Where("completed_at IS NULL")
		}

		if opt.excludeDeferred {
			tx = tx.Where("defer_until IS NULL OR defer_until < now()")
		}

		if startWhere != nil {
			if startWhere.CardType != "" {
				tx = tx.Where("card_type = ?", startWhere.CardType)
			}
		}

		tx = tx.Find(&[]models.Card{})

		return tx
	})

	recursiveQuery := s.db.ToSQL(func(tx *gorm.DB) *gorm.DB {
		tx = tx.Select("cards.*, depth + 1 AS depth").
			Model(&models.Card{}).
			Joins("JOIN cte ON cte.card_no = cards.parent_card_no")

		if opt.excludeCompleted {
			tx = tx.Where("cards.completed_at IS NULL")
		}

		if opt.excludeDeferred {
			tx = tx.Where("cards.defer_until IS NULL OR cards.defer_until < now()")
		}

		if where != nil && where.CardType != "" {
			tx = tx.Where("cards.card_type = ?", where.CardType)
		}

		return tx.Find(&[]models.Card{})
	})

	query := s.db.ToSQL(func(tx *gorm.DB) *gorm.DB {
		tx = tx.Select("*")
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
	if tx := s.db.WithContext(ctx).Raw(fmt.Sprintf(`WITH RECURSIVE cte AS (
        %s
    UNION ALL
        %s
)
SEARCH DEPTH FIRST BY rank SET ordercol
%s`, nonRecursiveQuery, recursiveQuery, query)).Scan(&r); tx.Error != nil {
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

	r, err := s.listCards(ctx, nil, nil, ListOpt{
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
	r, err := s.listCards(ctx, nil, &models.Card{CardNo: cardNo}, ListOpt{})
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
		case proto.PatchCardReq_OBJECTIVE:
			updates["objective"] = req.Card.Objective

		case proto.PatchCardReq_CONTENT:
			updates["content"] = req.Card.Content

		case proto.PatchCardReq_COMPLETED_AT:
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

		case proto.PatchCardReq_PARENT_CARD_NO:
			tx := s.db.WithContext(ctx)
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
				Where(&models.Card{WorkspaceID: s.currentWorkspace(ctx).ID}).
				Select("COALESCE(MAX(rank), 0, MAX(rank)) + 1").Row().Scan(&rank); err != nil {
				return nil, status.Errorf(codes.Internal, "fail to get new rank")
			}
			log.Debugf("new rank: %v", rank)
			updates["rank"] = rank

		case proto.PatchCardReq_LABEL:
			updates["labels"] = pq.Int64Array(fx.Map(req.Card.Labels, func(x uint64) int64 { return int64(x) }))

		case proto.PatchCardReq_DEFER_UNTIL:
			if req.Card.DeferUntil == nil {
				updates["defer_until"] = gorm.Expr("NULL")
			} else {
				updates["defer_until"] = req.Card.DeferUntil.AsTime()
			}

		case proto.PatchCardReq_DUE_DATE:
			if req.Card.DueDate == nil {
				updates["due_date"] = gorm.Expr("NULL")
			} else {
				updates["due_date"] = req.Card.DueDate.AsTime()
			}

		case proto.PatchCardReq_CARD_TYPE:
			updates["card_type"] = req.Card.CardType
			if req.Card.CardType == models.CardTypeChallenge.String() {
				parentChallengeNo, err := s.getParentChallenge(ctx, uint(req.Card.CardNo))
				if err != nil {
					return nil, err
				}
				if parentChallengeNo == 0 {
					updates["parent_card_no"] = gorm.Expr("NULL")
				} else {
					updates["parent_card_no"] = parentChallengeNo
				}
				// get parent challenge
			}

		default:
			log.Warnf("unknown field: %v", field)
		}
	}

	if len(updates) == 0 {
		return nil, status.Error(codes.InvalidArgument, "no columns to update")
	}

	if err := s.db.WithContext(ctx).Transaction(func(tx *gorm.DB) error {
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

func (s *v1alpha1ServiceImpl) getParentChallenge(ctx context.Context, cardNo uint) (uint, error) {
	card, err := s.getCard(ctx, cardNo)
	if err != nil {
		return 0, err
	}

	if card.ParentCardNo == nil {
		return 0, nil
	}

	cardNo = *card.ParentCardNo

	for {
		card, err := s.getCard(ctx, cardNo)
		if err != nil {
			return 0, err
		}

		if card.CardType == models.CardTypeChallenge.String() {
			return card.CardNo, nil
		}

		if card.ParentCardNo == nil {
			return 0, nil
		}

		cardNo = *card.ParentCardNo
	}
}

func (s *v1alpha1ServiceImpl) getCardProgressSummary(ctx context.Context, cardNo uint) (uint64, uint64) {
	var totalCards int64
	s.db.WithContext(ctx).Model(&models.Card{}).
		Where("workspace_id = ?", s.currentWorkspace(ctx).ID).
		Where("parent_card_no = ?", cardNo).
		Count(&totalCards)

	var completedCards int64
	s.db.WithContext(ctx).Model(&models.Card{}).
		Where("workspace_id = ?", s.currentWorkspace(ctx).ID).
		Where("parent_card_no = ? AND completed_at IS NOT NULL", cardNo).
		Count(&completedCards)

	return uint64(totalCards), uint64(completedCards)
}

func (s *v1alpha1ServiceImpl) GetCardProgressSummary(ctx context.Context, req *wrapperspb.UInt64Value) (*proto.CardProgressSummaryResp, error) {
	total, completed := s.getCardProgressSummary(ctx, uint(req.Value))

	return &proto.CardProgressSummaryResp{
		Total: total,
		Done:  completed,
	}, nil
}
