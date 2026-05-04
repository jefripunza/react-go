package dashboard

var functions = Function{
	Timeline: []FunctionItem{
		{
			Label:    "Stok Barang",
			Key:      "stock_barang",
			Function: TestFunctionTimeline,
		},
	},
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

func TestFunctionTimeline(req FunctionRequest) FunctionResponse {
	return FunctionResponse{
		Body: "test",
	}
}
