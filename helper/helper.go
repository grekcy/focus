package helper

import (
	"time"

	"github.com/whitekid/goxp/fx"
)

func PP[T fx.RealNumber, R fx.RealNumber](v *T) *R {
	if v == nil {
		return nil
	}

	var vv R = R(*v)
	return &vv
}

func P[T int | time.Duration, R uint | time.Duration](v T) *R {
	r := R(v)
	return &r
}
