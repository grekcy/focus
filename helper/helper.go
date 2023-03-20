package helper

func P[T uint64, R uint](v *R) *T {
	if v == nil {
		return nil
	}

	var vv T = T(*v)
	return &vv
}
