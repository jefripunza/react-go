package role

import (
	"react-go/dto"
	"react-go/function"
	model "react-go/modules/role/model"
	"react-go/variable"

	"github.com/gofiber/fiber/v2"
)

func DivisionCreate(c *fiber.Ctx) error {
	var req struct {
		Name        string `json:"name" validate:"required"`
		Description string `json:"description"`
	}
	if err := function.RequestBody(c, &req); err != nil {
		return dto.BadRequest(c, err.Error(), nil)
	}

	// Check duplicate
	var existing model.RoleDivision
	if err := variable.Db.
		Where("name = ?", req.Name).
		First(&existing).
		Error; err == nil {
		return dto.BadRequest(c, "Division name already exists", nil)
	}

	division := model.RoleDivision{
		Name:        req.Name,
		Description: req.Description,
	}
	if err := variable.Db.
		Create(&division).
		Error; err != nil {
		return dto.InternalServerError(c, "Failed to create division", nil)
	}

	return dto.Created(c, "Division created", division)
}
