package user

import (
	"github.com/gofiber/fiber/v2"
)

func ProtectedRoute(api fiber.Router) {
	api.Get("/me", GetMe("management"))
	api.Get("/list", GetList)
}

// TODO: Management
func ManagementRoute(api fiber.Router) {
	api.Get("/manage/paginate", GetPaginate)
	api.Put("/manage/:id/edit", Edit("management"))
	api.Patch("/manage/:id/change-password", ChangePassword("management"))
	api.Patch("/manage/:id/role-switch", RoleSwitch)
	api.Delete("/manage/:id", Remove)
}
