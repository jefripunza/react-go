package model

import (
	"log"
	"time"

	"gorm.io/gorm"
)

type MasterData struct {
	ID        uint      `json:"id" gorm:"autoIncrement;primaryKey"`
	Category  string    `json:"category" gorm:"type:varchar(100);not null;index"`
	Key       string    `json:"key" gorm:"type:varchar(100);not null"`
	Value     string    `json:"value" gorm:"type:text"`
	CreatedAt time.Time `json:"created_at" gorm:"autoCreateTime"`
}

func (MasterData) Seed(db *gorm.DB) {
	var count int64
	db.Model(&MasterData{}).Count(&count)

	if count == 0 {
		log.Println("✅ MasterData seeded (empty)")
	} else {
		log.Println("⚠️  MasterData already seeded")
	}
}
