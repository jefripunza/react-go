package user

import (
	"github.com/gofiber/fiber/v2"
)

func ProtectedRoute(api fiber.Router) {
	api.Get("/me", GetMe("management"))
	api.Get("/list", GetList)

	// Pagination CRUD convention
	api.Get("/paginate", GetPaginate)
	api.Post("/create", CreateUser)
	api.Put("/edit/:id", EditUser)
	api.Delete("/remove/:id", Remove)
	api.Post("/bulk-remove", BulkRemove)
	api.Patch("/set-active/:id", SetActive)
}
