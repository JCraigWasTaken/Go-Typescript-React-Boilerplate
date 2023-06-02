package endpoints

import (
	"go-typescript-react-boilerplate/src/server/types"
	"net/http"

	"github.com/gin-gonic/gin"
)

// SumRequest represents the request body for the /math/sum
type SumRequest struct {
	Numbers []float64 `json:"numbers" binding:"required"`
}

// SumResponse represents the response body for the /math/sum
type SumResponse struct {
	Result float64 `json:"result"`
}

// @Summary Sum numbers
// @Description This will return the sum of the numbers.
// @Accept  json
// @Produce  json
// @Param numbers body SumRequest true "Numbers to sum"
// @Success 200 {object} SumResponse
// @Router /math/sum [post]
func MathSum(c *gin.Context) {
	var payload SumRequest

	if err := c.ShouldBindJSON(&payload); err != nil {
		c.JSON(http.StatusBadRequest, types.BadRequestError{Error: err.Error()})
		return
	}

	var sum float64
	for _, number := range payload.Numbers {
		sum += number
	}

	c.JSON(http.StatusOK, SumResponse{Result: sum})
}

func Math(mathGroup *gin.RouterGroup) {
	// No trailing slash or an extra network call will be made because of a 301 redirect
	mathGroup.POST("/sum", MathSum)
}
