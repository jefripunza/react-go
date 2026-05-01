package auth

import (
	"react-go/middlewares"

	"github.com/gofiber/fiber/v2"
)

func PublicRoute(r fiber.Router) {
	r.Post("/login", Login)
	r.Post("/logout", middlewares.UseToken, Logout)
}

func ProtectedRoute(r fiber.Router) {
	r.Get("/validate", middlewares.UseToken, Validate)
}
