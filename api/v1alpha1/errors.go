package v1alpha1

import (
	"google.golang.org/grpc/codes"
	"google.golang.org/grpc/status"
)

var (
	errTokenParseFailed      = status.Errorf(codes.InvalidArgument, "fail to parse token")
	errInvalidToken          = status.Errorf(codes.InvalidArgument, "invalid token")
	errInvalidClaims         = status.Errorf(codes.InvalidArgument, "invalid calims")
	errUserNotFound          = status.Errorf(codes.Unauthenticated, "user not found")
	errUserWorkspaceNotFound = status.Errorf(codes.Unauthenticated, "user workspace not found")
)
