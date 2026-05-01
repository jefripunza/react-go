package example

import "github.com/gofiber/fiber/v2"

func PublicRoute(r fiber.Router) {
	r.Get("/", HelloWorld)
}
