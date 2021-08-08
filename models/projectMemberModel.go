package models

import (
	"time"
)

type ProjectMember struct {
	UserID    string    `gorm:"primaryKey"`
	ProjectID string    `gorm:"primaryKey"`
	Role      string    `gorm:"not null"`
	CreatedAt time.Time `gorm:"autoCreateTime"`
	UpdatedAt time.Time `gorm:"autoUpdateTime"`

	User    User    `gorm:"foreignkey:user_id"`
	Project Project `gorm:"foreignkey:project_id"`
}

const (
	ROLE_ADMIN     = "ADMIN"
	ROLE_DEVELOPER = "DEVELOPER"
	ROLE_ANALYST   = "ANALYST"
)

func newProjectMember(userID string, projectID string, role string) *ProjectMember {
	return &ProjectMember{
		UserID:    userID,
		ProjectID: projectID,
		Role:      role,
	}
}

func NewProjectAdmin(userID string, projectID string) *ProjectMember {
	return newProjectMember(userID, projectID, ROLE_ADMIN)
}

func NewProjectDeveloper(userID string, projectID string) *ProjectMember {
	return newProjectMember(userID, projectID, ROLE_DEVELOPER)
}

func NewProjectAnalyst(userID string, projectID string) *ProjectMember {
	return newProjectMember(userID, projectID, ROLE_ANALYST)
}
