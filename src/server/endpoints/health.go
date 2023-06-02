package endpoints

import (
	"net/http"

	"github.com/gin-gonic/gin"
)

// HealthResponse represents the response body for the /health
type HealthResponse struct {
	Status string `json:"status"`
}

// @Summary Health check
// @Description This will return the health status of the server.
// @Produce  json
// @Success 200 {object} HealthResponse
// @Router /health [get]
func HealthCheck(c *gin.Context) {
	c.JSON(http.StatusOK, HealthResponse{Status: "OK"})
}

func Health(mathGroup *gin.RouterGroup) {
	// No trailing slash or an extra network call will be made because of a 301 redirect
	mathGroup.GET("", HealthCheck)
}
