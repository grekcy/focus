package v1alpha1

import (
	"context"

	"focus/models"
)

func (s *v1alpha1ServiceImpl) userDefaultWorkspace(ctx context.Context, userID uint) (*models.Workspace, error) {
	userWorkspace := &models.UserWorkspace{}
	if tx := s.db.WithContext(ctx).Preload("Workspace").Where(&models.UserWorkspace{
		UserID: userID,
		Role:   models.RoleDefault,
	}).First(userWorkspace); tx.Error != nil {
		return nil, tx.Error
	}

	return userWorkspace.Workspace, nil
}
