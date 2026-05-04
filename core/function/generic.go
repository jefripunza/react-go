package function

func Find[T any](slice []T, callback func(T) bool) (T, bool) {
	for _, v := range slice {
		if callback(v) {
			return v, true
		}
	}
	var zero T
	return zero, false
}
