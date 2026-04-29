package middlewares

import (
	"react-go/dto"
	"react-go/function"
	model "react-go/modules/setting/model"
	"react-go/variable"

	"github.com/gofiber/fiber/v2"
)

func UseMaintenance(c *fiber.Ctx) error {
	// Check if maintenance mode is enabled
	var setting model.Setting
	if err := variable.Db.
		Where("key = ?", "maintenance_mode").
		First(&setting).
		Error; err != nil {
		// If setting not found, skip maintenance check
		return c.Next()
	}

	if setting.Value != "true" {
		return c.Next()
	}

	// Allow su users to pass through
	claims, ok := c.Locals("claims").(*function.JwtClaims)
	if ok && claims.Role == "su" {
		return c.Next()
	}

	return dto.Custom(c, 503, "System is under maintenance. Please try again later.", nil)
}
