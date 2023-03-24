package helper

func PP[T uint64, R uint](v *R) *T {
	if v == nil {
		return nil
	}

	var vv T = T(*v)
	return &vv
}

func P[T int, R uint](v T) *R {
	var r R
	r = R(v)
	return &r
}
