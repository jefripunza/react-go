package address

import "github.com/gofiber/fiber/v2"

func PublicRoute(r fiber.Router) {
	r.Get("/provinces", Provinces)
	r.Get("/regencies/:id", Regencies)
	r.Get("/districts/:id", Districts)
	r.Get("/villages/:id", Villages)
}
