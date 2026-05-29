# Stage 1: Build the binary
FROM golang:1.26-alpine AS builder

WORKDIR /app

# Copy dependency specifications and download
COPY go.mod go.sum ./
RUN go mod download

# Copy all source files
COPY . .

# Build standard statically linked Linux executable
RUN CGO_ENABLED=0 GOOS=linux go build -a -installsuffix cgo -o server ./cmd/server

# Stage 2: Final minimal runtime
FROM alpine:3.19

WORKDIR /app

# Add security certificates
RUN apk --no-cache add ca-certificates

# Copy compiled static binary from builder stage
COPY --from=builder /app/server .

# Expose Go Fiber default api port
EXPOSE 8080

# Launch database migrations, seeder routines, and HTTP server on execution
CMD ["./server"]
