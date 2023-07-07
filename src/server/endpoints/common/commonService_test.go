package endpoints_Common

import (
	"context"
	"net/http"
	"testing"
)

// External Dependency Mock

// Tests
func TestHealthCheck_Service(t *testing.T) {
	t.Run("Health Check Returns Success", func(t *testing.T) {
		s := NewService()

		status, response, err := s.HealthCheck(context.Background())
		if status != http.StatusOK || response.Status != "OK" || err != nil {
			t.Errorf("unexpected output: got (%d, %v, %v), want (%d, %v, %v)",
				status, response, err,
				http.StatusOK, HealthResponse{Status: "OK"}, nil,
			)
		}
	})
}

func TestMathSum_Service(t *testing.T) {
	t.Run("Math Sum Returns Success", func(t *testing.T) {
		s := NewService()

		status, response, err := s.MathSum(context.Background(), SumRequest{Numbers: []float64{1, 2}})
		if status != http.StatusOK || response.Result != 3 || err != nil {
			t.Errorf("unexpected output: got (%d, %f, %v), want (%d, %f, %v)",
				status, response.Result, err,
				http.StatusOK, 3.0, nil,
			)
		}
	})
}
