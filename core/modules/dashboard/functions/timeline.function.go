package functions

import (
	"react-go/core/types"
)

func TestFunction(req types.FunctionRequest) any {
	return map[string]any{
		"body": "test",
	}
}
