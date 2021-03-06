package daos

import (
	"time"

	"gorm.io/gorm"
	"slashbase.com/backend/src/config"
	"slashbase.com/backend/src/db"
	"slashbase.com/backend/src/models"
)

type DBQueryLogDao struct{}

func (d DBQueryLogDao) CreateDBQueryLog(queryLog *models.DBQueryLog) error {
	err := db.GetDB().Create(queryLog).Error
	return err
}

func (d DBQueryLogDao) GetDBQueryLogsDBConnID(dbConnID string, projectMember *models.ProjectMember, before time.Time) ([]*models.DBQueryLog, error) {
	var dbQueryLogs []*models.DBQueryLog
	var query *gorm.DB
	if projectMember.Role == models.ROLE_ADMIN {
		query = db.GetDB().Where(&models.DBQueryLog{DBConnectionID: dbConnID})
	} else {
		query = db.GetDB().Where(&models.DBQueryLog{UserID: projectMember.UserID, DBConnectionID: dbConnID})
	}
	err := query.Where("created_at < ?", before).Preload("User").Order("created_at desc").Limit(config.PAGINATION_COUNT).Find(&dbQueryLogs).Error
	return dbQueryLogs, err
}
