package endpoints

import (
	"net/http"
	"net/http/httptest"
	"testing"

	"github.com/gin-gonic/gin"
	"github.com/stretchr/testify/assert"
)

func TestHealthCheck(t *testing.T) {
	// Set the router and the endpoint for testing
	r := gin.Default()
	r.GET("/health", HealthCheck)

	// Create a request to the endpoint
	req, err := http.NewRequest(http.MethodGet, "/health", nil)
	if err != nil {
		t.Fatalf("Couldn't create request: %v\n", err)
	}

	// Create a response recorder
	w := httptest.NewRecorder()

	// Create the service and process the above request.
	r.ServeHTTP(w, req)

	// Assert the status code is 200
	assert.Equal(t, http.StatusOK, w.Code)

	// Assert the body string is as expected
	assert.Equal(t, `{"status":"OK"}`, w.Body.String())
}

func TestHealthRoute(t *testing.T) {
	// Initialize a new gin router
	r := gin.New()

	// Set up the /health route using the Health function
	Health(r.Group("/"))

	// Check that the /health route exists
	assert.NotNil(t, r.Routes(), "Routes should be set up")

	// Check that the /health route is in the list of routes
	found := false
	for _, route := range r.Routes() {
		if route.Path == "/" && route.Method == "GET" {
			found = true
			break
		}
	}

	// Assert that the /health route is found
	assert.True(t, found, "Health route was not found in the list of routes")
}
