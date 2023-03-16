TARGET=bin/focus
SRC=$(shell find . -type f -name '*.go' -not -path "./vendor/*" -not -path "*_test.go")

LDFLAGS ?= "-s -w"
BUILD_FLAGS ?= -v -ldflags ${LDFLAGS}

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
