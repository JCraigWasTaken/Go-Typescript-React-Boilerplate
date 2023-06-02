package endpoints

import (
	"bytes"
	"encoding/json"
	"net/http"
	"net/http/httptest"
	"testing"

	"github.com/gin-gonic/gin"
	"github.com/stretchr/testify/assert"
)

func TestMathSum(t *testing.T) {
	// Create gin engine for testing
	r := gin.Default()
	r.POST("/math/sum", MathSum)

	// Define test cases
	testCases := []struct {
		name               string
		numbers            []float64
		expectedHTTPStatus int
		expectedSum        float64
	}{
		{"valid request", []float64{1, 2, 3, 4, 5}, http.StatusOK, 15},
		{"invalid request", nil, http.StatusBadRequest, 0},
	}

	for _, tc := range testCases {
		t.Run(tc.name, func(t *testing.T) {
			// Convert numbers to a JSON body
			jsonBody, err := json.Marshal(SumRequest{Numbers: tc.numbers})
			if err != nil {
				t.Fatalf("Couldn't marshal numbers: %v\n", err)
			}

			// Create a request to the endpoint
			req, err := http.NewRequest(http.MethodPost, "/math/sum", bytes.NewBuffer(jsonBody))
			if err != nil {
				t.Fatalf("Couldn't create request: %v\n", err)
			}
			req.Header.Set("Content-Type", "application/json")

			// Create a response recorder
			w := httptest.NewRecorder()

			// Create the service and process the above request.
			r.ServeHTTP(w, req)

			// Assert the status code is as expected
			assert.Equal(t, tc.expectedHTTPStatus, w.Code)

			// If the response is OK, assert that the sum is as expected
			if w.Code == http.StatusOK {
				var response SumResponse
				err = json.Unmarshal(w.Body.Bytes(), &response)
				if err != nil {
					t.Fatalf("Couldn't unmarshal response body: %v\n", err)
				}

				assert.Equal(t, tc.expectedSum, response.Result)
			}
		})
	}
}

func TestMathRoute(t *testing.T) {
	// Initialize a new gin router
	r := gin.New()

	// Set up the /math/sum route using the Math function
	Math(r.Group("/math"))

	// Check that the /math/sum route exists
	assert.NotNil(t, r.Routes(), "Routes should be set up")

	// Check that the /math/sum route is in the list of routes
	found := false
	for _, route := range r.Routes() {
		if route.Path == "/math/sum" && route.Method == "POST" {
			found = true
			break
		}
	}

	// Assert that the /math/sum route is found
	assert.True(t, found, "/math/sum route was not found in the list of routes")
}
