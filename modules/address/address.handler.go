package address

import (
	"encoding/json"
	"fmt"
	"io"
	"net/http"
	"react-go/dto"

	"github.com/gofiber/fiber/v2"
)

func fetchAddress(url string) ([]fiber.Map, error) {
	resp, err := http.Get(url)
	if err != nil {
		return nil, err
	}
	defer resp.Body.Close()

	respBody, _ := io.ReadAll(resp.Body)
	var result struct {
		Data []struct {
			Code string `json:"code"`
			Name string `json:"name"`
		} `json:"data"`
	}
	if err := json.Unmarshal(respBody, &result); err != nil {
		return nil, err
	}

	data := make([]fiber.Map, len(result.Data))
	for i, d := range result.Data {
		data[i] = fiber.Map{"value": d.Code, "label": d.Name}
	}

	return data, nil
}

func Provinces(c *fiber.Ctx) error {
	data, err := fetchAddress("https://wilayah.id/api/provinces.json")
	if err != nil {
		return dto.InternalServerError(c, "Internal Server Error", nil)
	}
	return dto.OK(c, "Province fetched successfully!", data)
}

func Regencies(c *fiber.Ctx) error {
	id := c.Params("id")
	data, err := fetchAddress(fmt.Sprintf("https://wilayah.id/api/regencies/%s.json", id))
	if err != nil {
		return dto.InternalServerError(c, "Internal Server Error", nil)
	}
	return dto.OK(c, "Regencies fetched successfully!", data)
}

func Districts(c *fiber.Ctx) error {
	id := c.Params("id")
	data, err := fetchAddress(fmt.Sprintf("https://wilayah.id/api/districts/%s.json", id))
	if err != nil {
		return dto.InternalServerError(c, "Internal Server Error", nil)
	}
	return dto.OK(c, "Districts fetched successfully!", data)
}

func Villages(c *fiber.Ctx) error {
	id := c.Params("id")
	data, err := fetchAddress(fmt.Sprintf("https://wilayah.id/api/villages/%s.json", id))
	if err != nil {
		return dto.InternalServerError(c, "Internal Server Error", nil)
	}
	return dto.OK(c, "Villages fetched successfully!", data)
}
