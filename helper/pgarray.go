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

func ArrayToProto(in pq.Int64Array) []uint64 {
	return fx.Map(in, func(x int64) uint64 { return uint64(x) })
}
