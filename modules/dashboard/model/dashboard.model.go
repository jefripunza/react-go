package model

import (
	role "react-go/modules/role/model"

	"github.com/google/uuid"
	"gorm.io/gorm"
)

type DashboardWidget struct {
	ID           uuid.UUID `json:"id" gorm:"type:char(36);primaryKey"`
	RoleID       uint      `json:"role_id" gorm:"type:bigint;not null;uniqueIndex:idx_dashboard_component_key"`
	ComponentKey string    `json:"component_key" gorm:"type:varchar(255);not null;uniqueIndex:idx_dashboard_component_key"`
	Type         string    `json:"type" gorm:"type:varchar(255);not null"`
	Key          string    `json:"key" gorm:"type:varchar(255);not null;uniqueIndex:idx_dashboard_component_key"`
	ColM         int       `json:"col_m" gorm:"type:int;not null;default:12"` // Mobile ≤425px
	ColT         int       `json:"col_t" gorm:"type:int;not null;default:6"`  // Tablet 768px
	ColL         int       `json:"col_l" gorm:"type:int;not null;default:4"`  // Laptop 1024px
	ColLL        int       `json:"col_ll" gorm:"type:int;not null;default:3"` // Large Laptop ≥1440px
	Label        string    `json:"label" gorm:"type:varchar(255);not null"`
	Description  string    `json:"description" gorm:"type:varchar(255)"`
	Value        float64   `json:"value" gorm:"type:decimal(10,2);not null;default:0"`
	// relations
	Role role.Role `json:"role" gorm:"foreignKey:RoleID;references:ID;constraint:OnDelete:CASCADE"`
}

func (a *DashboardWidget) BeforeCreate(tx *gorm.DB) error {
	if a.ID == uuid.Nil {
		uuidV7, _ := uuid.NewV7()
		a.ID = uuidV7
	}
	return nil
}

func (s *DashboardWidget) Map() map[string]any {
	return map[string]any{
		"id":      s.ID,
		"role_id": s.RoleID,
		"key":     s.Key,
		"value":   s.Value,
	}
}
