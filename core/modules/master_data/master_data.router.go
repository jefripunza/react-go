package master_data

import (
	"github.com/gofiber/fiber/v2"
)

func ProtectedRoute(r fiber.Router) {
	r.Get("/paginate", GetPaginate)
	r.Post("/create", Create)
	r.Put("/edit/:id", Update)
	r.Delete("/remove/:id", Delete)
	r.Post("/bulk-remove", BulkDelete)
}
