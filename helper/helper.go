package helper

func PP[T uint64 | uint, R uint64 | uint](v *T) *R {
	if v == nil {
		return nil
	}

	var vv R = R(*v)
	return &vv
}

func P[T int, R uint](v T) *R {
	var r R
	r = R(v)
	return &r
}
