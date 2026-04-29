package master_data

import (
	"github.com/gofiber/fiber/v2"
)

func ProtectedRoute(r fiber.Router) {
	r.Get("/paginate", GetPaginate)
	r.Post("/create", Create)
	r.Put("/:id", Update)
	r.Delete("/:id", Delete)
}
