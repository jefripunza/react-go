package model

import (
	"log"

	role "react-go/modules/role/model"

	"gorm.io/gorm"
)

type Rule struct {
	ID     uint   `json:"id" gorm:"autoIncrement;primaryKey"`
	RoleID uint   `json:"role_id" gorm:"type:bigint;not null;uniqueIndex:idx_role_menu_key_role_action"`
	Key    string `json:"key" gorm:"uniqueIndex:idx_role_menu_key_role_action"`
	Action string `json:"action" gorm:"uniqueIndex:idx_role_menu_key_role_action"` // create, read, update, delete, set
	State  bool   `json:"state" gorm:"default:true"`
	// relations
	Role role.Role `json:"role" gorm:"foreignKey:RoleID;references:ID;constraint:OnDelete:CASCADE"`
}

func (s *Rule) Map() map[string]any {
	return map[string]any{
		"id":      s.ID,
		"role_id": s.RoleID,
		"key":     s.Key,
		"action":  s.Action,
		"state":   s.State,
	}
}

func (Rule) Seed(db *gorm.DB) {
	var count int64
	db.Model(&Rule{}).Count(&count)

	if count == 0 {
		stats := []Rule{
			{RoleID: 1, Key: "roles", Action: "read"},
			{RoleID: 1, Key: "roles", Action: "create"},
			{RoleID: 1, Key: "roles", Action: "update"},
			{RoleID: 1, Key: "roles", Action: "delete"},
			{RoleID: 1, Key: "roles", Action: "set"},
			{RoleID: 1, Key: "users", Action: "read"},
			{RoleID: 1, Key: "users", Action: "create"},
			{RoleID: 1, Key: "users", Action: "update"},
			{RoleID: 1, Key: "users", Action: "delete"},
			{RoleID: 1, Key: "users", Action: "set"},
			{RoleID: 1, Key: "master-data", Action: "read"},
			{RoleID: 1, Key: "master-data", Action: "create"},
			{RoleID: 1, Key: "master-data", Action: "update"},
			{RoleID: 1, Key: "master-data", Action: "delete"},
			{RoleID: 1, Key: "master-data", Action: "set"},
		}

		for _, s := range stats {
			db.Create(&s)
		}

		log.Println("✅ Example seeded")
	} else {
		log.Println("⚠️ Example already seeded")
	}
}
