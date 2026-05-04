package dashboard

import "fmt"

var functions = Function{
	Timeline: []FunctionItem{
		{
			Label:    "Stok Barang",
			Key:      "stock_barang",
			Function: TestFunctionTimeline,
		},
	},
}

func findFunction(_type string, key string) (func(req FunctionRequest) any, error) {
	var function func(req FunctionRequest) any
	switch _type {
	case "timeline":
		for _, v := range functions.Timeline {
			if v.Key == key {
				function = v.Function
				break
			}
		}
	case "bar":
		for _, v := range functions.Bar {
			if v.Key == key {
				function = v.Function
				break
			}
		}
	case "gauge":
		for _, v := range functions.Gauge {
			if v.Key == key {
				function = v.Function
				break
			}
		}
	case "pie":
		for _, v := range functions.Pie {
			if v.Key == key {
				function = v.Function
				break
			}
		}
	case "table":
		for _, v := range functions.Table {
			if v.Key == key {
				function = v.Function
				break
			}
		}
	case "progress":
		for _, v := range functions.Progress {
			if v.Key == key {
				function = v.Function
				break
			}
		}
	case "traffic":
		for _, v := range functions.Traffic {
			if v.Key == key {
				function = v.Function
				break
			}
		}
	case "line":
		for _, v := range functions.Line {
			if v.Key == key {
				function = v.Function
				break
			}
		}
	default:
		return nil, fmt.Errorf("Invalid function type")
	}

	if function == nil {
		return nil, fmt.Errorf("Function not found")
	}

	return function, nil
}

/*
{
	"functions": {
		"timeline": [
			{
				"label": "Stok Barang",
				"key": "stock_barang",
				"function": ""
			}
		]
	}
}
*/

// -------------------------------------------------------- //
// -------------------------------------------------------- //

func TestFunctionTimeline(req FunctionRequest) any {
	return map[string]any{
		"body": "test",
	}
}

/*
// SSE Side
{
  "widgets": [
		{
			"id": "019df3a7-eb44-7733-8233-37424a217ff9",
			"data": {}
		}
  ]
}
*/
