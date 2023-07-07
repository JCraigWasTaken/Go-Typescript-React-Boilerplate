package endpoints_Common

import (
	"context"
	"go-typescript-react-boilerplate/src/server/structs"
	"net/http"

	"github.com/gin-gonic/gin"
)

type Handler struct {
	service ServiceInsert
}

func NewHandler(service ServiceInsert) *Handler {
	return &Handler{service: service}
}

// HealthResponse represents the response body for the /common/health
type HealthResponse struct {
	Status string `json:"status"`
}

// @Summary Health check
// @Description This will return the health status of the server.
// @Produce  json
// @Success 200 {object} HealthResponse
// @Router /common/health [get]
func (h *Handler) HealthCheck(ctx context.Context) gin.HandlerFunc {
	return func(c *gin.Context) {
		status, response, err := h.service.HealthCheck(ctx)
		if err != nil {
			c.JSON(status, structs.ErrorResponse{Error: err.Error()})
			return
		}
		c.JSON(status, response)
	}
}

// SumRequest represents the request body for the /common/sum
type SumRequest struct {
	Numbers []float64 `json:"numbers" binding:"required"`
}

// SumResponse represents the response body for the /common/sum
type SumResponse struct {
	Result float64 `json:"result"`
}

// @Summary Sum numbers
// @Description This will return the sum of the numbers.
// @Accept  json
// @Produce  json
// @Param numbers body SumRequest true "Numbers to sum"
// @Success 200 {object} SumResponse
// @Router /common/sum [post]
func (h *Handler) MathSum(ctx context.Context) gin.HandlerFunc {
	return func(c *gin.Context) {
		var payload SumRequest

		if err := c.ShouldBindJSON(&payload); err != nil {
			c.JSON(http.StatusBadRequest, structs.ErrorResponse{Error: err.Error()})
			return
		}

		status, response, err := h.service.MathSum(ctx, payload)
		if err != nil {
			c.JSON(status, structs.ErrorResponse{Error: err.Error()})
			return
		}
		c.JSON(status, response)
	}
}

func Common(commonGroup *gin.RouterGroup, ctx context.Context) {
	// create an instances of your service dependencies

	// create an instance of your Service, passing the Repository to it
	service := NewService()

	// create an instance of your Handler, passing the Service to it
	handler := NewHandler(service)

	// No trailing slash or an extra network call will be made because of a 301 redirect
	commonGroup.GET("/health", handler.HealthCheck(ctx))
	commonGroup.POST("/sum", handler.MathSum(ctx))
}
