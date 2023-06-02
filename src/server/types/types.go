//go:build !test
// +build !test

package types

// BadRequestError represents the structure of a bad request error response.
type BadRequestError struct {
	Error string `json:"error"`
}
