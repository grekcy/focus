package v1alpha1

import (
	"context"

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

	"focus/models"
	proto "focus/proto/v1alpha1"
)

func (s *v1alpha1ServiceImpl) CreateLabel(ctx context.Context, req *proto.Label) (*proto.Label, error) {
	if err := validate.Struct(&struct {
		Label string `validate:"required"`
	}{
		Label: req.Label,
	}); err != nil {
		return nil, status.Error(codes.InvalidArgument, err.Error())
	}

	newLabel := &models.Label{
		WorkspaceID: s.currentWorkspace(ctx).ID,
		Label:       req.Label,
		Description: req.Description,
		Color:       req.Color,
	}
	s.db.WithContext(ctx).Transaction(func(tx *gorm.DB) error {
		if tx := tx.Create(newLabel); tx.Error != nil {
			return status.Errorf(codes.Internal, "fail to create label")
		}
		return nil
	})

	return labelModelToProto(newLabel), nil
}

func (s *v1alpha1ServiceImpl) listLabels(ctx context.Context, where *models.Label) ([]*models.Label, error) {
	labels := []*models.Label{}
	if tx := s.db.WithContext(ctx).
		Where(where).
		Order("label").
		Find(&labels); tx.Error != nil {
		return nil, status.Errorf(codes.Internal, "fail to list tags: %+v", tx.Error)
	}

	return labels, nil
}

func labelModelToProto(in *models.Label) *proto.Label {
	return &proto.Label{
		Id:          uint64(in.ID),
		Uid:         in.UID,
		WorkspaceId: uint64(in.WorkspaceID),
		Label:       in.Label,
		Description: in.Description,
		Color:       in.Color,
		CreatedAt:   timestamppb.New(in.CreatedAt),
	}
}

func (s *v1alpha1ServiceImpl) ListLabels(ctx context.Context, req *proto.ListLabelsReq) (*proto.ListLabelsResp, error) {
	log.Debugf("ListLabel(): req=%+v", req)

	r, err := s.listLabels(ctx, &models.Label{
		WorkspaceID: s.currentWorkspace(ctx).ID},
	)
	if err != nil {
		return nil, err
	}

	return &proto.ListLabelsResp{
		Labels: fx.Map(r, func(label *models.Label) *proto.Label { return labelModelToProto(label) }),
	}, nil
}

func (s *v1alpha1ServiceImpl) getLabel(ctx context.Context, id uint) (*models.Label, error) {
	r, err := s.listLabels(ctx, &models.Label{Model: &gorm.Model{ID: id}})
	if err != nil {
		return nil, err
	}

	switch len(r) {
	case 0:
		return nil, status.Errorf(codes.NotFound, "label not found: %v", id)
	case 1:
		return r[0], nil
	default:
		return nil, status.Errorf(codes.Internal, "multiple label found: %v, count=%d", id, len(r))
	}
}

func (s *v1alpha1ServiceImpl) UpdateLabel(ctx context.Context, req *proto.Label) (*proto.Label, error) {
	log.Debugf("UpdateLabel(): req=%+v", req)

	label, err := s.getLabel(ctx, uint(req.Id))
	if err != nil {
		return nil, err
	}

	label.WorkspaceID = s.currentWorkspace(ctx).ID
	label.Label = req.Label
	label.Description = req.Description
	label.Color = req.Color

	if tx := s.db.WithContext(ctx).Save(label); tx.Error != nil {
		return nil, err
	}

	return labelModelToProto(label), nil
}

func (s *v1alpha1ServiceImpl) DeleteLabel(ctx context.Context, req *wrapperspb.UInt64Value) (*emptypb.Empty, error) {
	label, err := s.getLabel(ctx, uint(req.Value))
	if err != nil {
		return nil, err
	}

	tx := s.db.WithContext(ctx).Delete(&label)
	if tx.Error != nil {
		return nil, status.Errorf(codes.Internal, "fail to delete label: %+v", tx.Error)
	}

	if tx.RowsAffected != 1 {
		log.Warnf("delete exactly id=%v, but deleted %d", req.Value, tx.RowsAffected)
	}

	return grpcx.Empty(), nil
}
