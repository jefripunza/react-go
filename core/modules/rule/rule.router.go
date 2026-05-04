package rule

import (
	"react-go/core/middlewares"

	"github.com/gofiber/fiber/v2"
)

func ProtectedRoute(r fiber.Router) {
	r.Post("/set", middlewares.UseRoleMenu("roles", "set"), Set)
	r.Get("/list", middlewares.UseRoleMenu("roles", "read"), List)
}
