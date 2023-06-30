TARGET=bin/focus
SRC=$(shell find . -type f -name '*.go' -not -path "./vendor/*" -not -path "*_test.go")
PROTO_GOS = proto/v1alpha1/focus_v1alpha1_grpc.pb.go proto/v1alpha2/focus_v1alpha2_grpc.pb.go proto/sample/v1alpha1/sample_v1alpha1_grpc.pb.go

LDFLAGS ?= -ldflags "-s -w"
BUILD_FLAGS ?= -v ${LDFLAGS}

.PHONY: clean test dep tidy

all: build
build: $(TARGET)

$(TARGET): $(SRC) $(PROTO_GOS)
	@mkdir -p bin
	@go build -o bin/ ${BUILD_FLAGS} ./cmd/...

clean:
	@rm -f ${TARGET}

test:
	@go test ./...

# update modules & tidy
dep:
	@rm -f go.mod go.sum
	@go mod init focus

	@$(MAKE) tidy

tidy:
	@go mod tidy -v

# FIXME
proto/v1alpha1/focus_v1alpha1_grpc.pb.go: proto/focus_v1alpha1.proto
	protoc -I=./proto \
      --go_out=./proto/v1alpha1 \
      --go_opt=paths=source_relative \
      --go-grpc_out=./proto/v1alpha1 \
      --go-grpc_opt=paths=source_relative \
	  --grpc-gateway_out ./proto/v1alpha1 \
	  --grpc-gateway_opt paths=source_relative \
	  --grpc-gateway_opt generate_unbound_methods=true \
      --js_out=import_style=commonjs:./focus.app/src/lib/proto \
      --grpc-web_out=import_style=typescript,mode=grpcweb:./focus.app/src/lib/proto \
	  proto/focus_v1alpha1.proto

	cd ./proto/v1alpha1 && mockery --name FocusClient

proto/v1alpha2/focus_v1alpha2_grpc.pb.go: proto/focus_v1alpha2.proto
	protoc -I=./proto \
      --go_out=./proto/v1alpha2 \
      --go_opt=paths=source_relative \
      --go-grpc_out=./proto/v1alpha2 \
      --go-grpc_opt=paths=source_relative \
	  --grpc-gateway_out ./proto/v1alpha2 \
	  --grpc-gateway_opt paths=source_relative \
	  --grpc-gateway_opt generate_unbound_methods=true \
      --js_out=import_style=commonjs:./focus.app/src/lib/proto \
      --grpc-web_out=import_style=typescript,mode=grpcweb:./focus.app/src/lib/proto \
	  proto/focus_v1alpha2.proto

	cd ./proto/v1alpha2 && mockery --name FocusClient

proto/sample/v1alpha1/sample_v1alpha1_grpc.pb.go: proto/sample_v1alpha1.proto
	protoc -I=./proto \
      --go_out=./proto/sample/v1alpha1 \
      --go_opt=paths=source_relative \
      --go-grpc_out=./proto/sample/v1alpha1 \
      --go-grpc_opt=paths=source_relative \
	  --grpc-gateway_out ./proto/sample/v1alpha1 \
	  --grpc-gateway_opt paths=source_relative \
	  --grpc-gateway_opt generate_unbound_methods=true \
      --js_out=import_style=commonjs:./focus.app/src/lib/proto \
      --grpc-web_out=import_style=typescript,mode=grpcweb:./focus.app/src/lib/proto \
	  proto/sample_v1alpha1.proto

	cd ./proto/sample/v1alpha1 && mockery --name SampleClient
