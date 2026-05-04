package dashboard

import "github.com/gofiber/fiber/v2"

func PublicRoute(r fiber.Router) {
	r.Get("/functions", ListFunctions)

	// comment this on production
	r.Get("/function/:type/:key", ExecuteFunction)
}

func ProtectedRoute(r fiber.Router) {
	r.Get("/stats", GetStats)

	// CRUD Widget
	r.Post("/widget/functions", WidgetFunctions)
	r.Post("/widget/create", WidgetCreate)
	r.Get("/widget/list", WidgetList)
	r.Put("/widget/edit/:id", WidgetEdit)
	r.Delete("/widget/remove/:id", WidgetRemove)
}
