//go:build !test
// +build !test

package structs

// ErrorResponse represents the response body for an error
type ErrorResponse struct {
	Error string `form:"error" json:"error"`
}

// SortDirectionType represents the possible directions for sorting
type SortDirectionType string

// Constants for sort directions
const (
	SortAscending  SortDirectionType = "asc"
	SortDescending SortDirectionType = "desc"
)

// TableRequest represents the request body for any sort of a table
type TableRequest struct {
	SearchQuery   *string            `form:"searchQuery" json:"searchQuery,omitempty"`
	PageNumber    *int               `form:"pageNumber" json:"pageNumber,omitempty"`
	NumRows       *int               `form:"numRows" json:"numRows,omitempty"`
	SortHeader    *string            `form:"sortHeader" json:"sortHeader,omitempty"`
	SortDirection *SortDirectionType `form:"sortDirection" json:"sortDirection,omitempty"`
}
