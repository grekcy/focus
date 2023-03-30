package helper

import (
	"github.com/lib/pq"
	"github.com/whitekid/goxp/fx"
	"golang.org/x/exp/constraints"
)

// ToArray convert Integer array to pq array
func ToArray[T constraints.Integer](a []T) pq.Int64Array {
	return fx.Map(a, func(e T) int64 { return int64(e) })
}
