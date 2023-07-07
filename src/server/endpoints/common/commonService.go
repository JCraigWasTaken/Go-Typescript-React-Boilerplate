package endpoints_Common

import (
	"context"
	"net/http"
)

// Imported Library Insert Definitions (for mocking if needed)

// Service Definitions
type ServiceInsert interface {
	HealthCheck(context.Context) (int, HealthResponse, error)
	MathSum(context.Context, SumRequest) (int, SumResponse, error)
}

type Service struct {
}

func NewService() *Service {
	return &Service{}
}

// Service Methods
func (s *Service) HealthCheck(ctx context.Context) (int, HealthResponse, error) {
	return http.StatusOK, HealthResponse{Status: "OK"}, nil
}

func (s *Service) MathSum(ctx context.Context, payload SumRequest) (int, SumResponse, error) {
	var sum float64

	for _, number := range payload.Numbers {
		sum += number
	}

	return http.StatusOK, SumResponse{Result: sum}, nil
}
