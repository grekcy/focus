package helper

import "github.com/whitekid/goxp/fx"

func PP[T fx.RealNumber, R fx.RealNumber](v *T) *R {
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
