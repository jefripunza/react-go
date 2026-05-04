package auth

import (
	"github.com/gofiber/fiber/v2"
)

func PublicRoute(r fiber.Router) {
	r.Post("/login", Login)
}

func ProtectedRoute(r fiber.Router) {
	r.Post("/logout", Logout)
	r.Get("/validate", Validate)
}
