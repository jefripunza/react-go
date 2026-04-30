package rule

import (
	"react-go/middlewares"

	"github.com/gofiber/fiber/v2"
)

func ProtectedRoute(r fiber.Router) {
	r.Post("/set", middlewares.UseRoleMenu("rule", "set"), Set)
	r.Get("/list", middlewares.UseRoleMenu("rule", "read"), List)
}
