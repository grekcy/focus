TARGET=bin/focus
SRC=$(shell find . -type f -name '*.go' -not -path "./vendor/*" -not -path "*_test.go")

LDFLAGS ?= "-s -w"
BUILD_FLAGS ?= -v -ldflags ${LDFLAGS}

PROTO_DEFS := $(shell find . -not -path "./vendor/*" -type f -name '*.proto' -print)
PROTO_GOS := $(patsubst %.proto,%.pb.go,$(PROTO_DEFS))

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

%.pb.go: $(patsubst %.pb.go,%.proto,$@)
	protoc -I=./$(@D) --go_out=./$(@D) --go_opt=paths=source_relative \
		--go-grpc_out=./$(@D) --go-grpc_opt=paths=source_relative ./$(patsubst %.pb.go,%.proto,$@)
