package endpoints_Common

import (
	"bytes"
	"context"
	"encoding/json"
	"errors"
	"go-typescript-react-boilerplate/src/server/structs"
	"net/http"
	"net/http/httptest"
	"testing"

	"github.com/gin-gonic/gin"
)

// External Dependency Mock
type mockService struct {
	mockHealthCheck func(context.Context) (int, HealthResponse, error)
	mockMathSum     func(context.Context, SumRequest) (int, SumResponse, error)
}

func (m *mockService) HealthCheck(ctx context.Context) (int, HealthResponse, error) {
	return m.mockHealthCheck(ctx)
}

func (m *mockService) MathSum(ctx context.Context, sr SumRequest) (int, SumResponse, error) {
	return m.mockMathSum(ctx, sr)
}

// Tests
func TestHealthCheck_Handler(t *testing.T) {
	t.Run("HealthCheck Returns Success", func(t *testing.T) {
		r := gin.Default()
		h := NewHandler(&mockService{
			mockHealthCheck: func(ctx context.Context) (int, HealthResponse, error) {
				return 200, HealthResponse{Status: "OK"}, nil
			},
		})

		r.GET("/common/health", h.HealthCheck(context.Background()))

		req, err := http.NewRequest(http.MethodGet, "/common/health", nil)
		if err != nil {
			t.Fatalf("Failed to create a request: %v", err)
		}

		resp := httptest.NewRecorder()
		r.ServeHTTP(resp, req)

		if resp.Code != http.StatusOK {
			t.Errorf("Expected status OK but received %v", resp.Code)
		}

		var response HealthResponse
		if err = json.NewDecoder(resp.Body).Decode(&response); err != nil {
			t.Fatalf("Failed to decode response: %v", err)
		}

		if response.Status != "OK" {
			t.Errorf("Expected status 'OK' but received %v", response.Status)
		}
	})

	t.Run("HealthCheck Returns Error - Service.HealthCheck", func(t *testing.T) {
		r := gin.Default()
		testErr := errors.New("HealthCheck Error")
		h := NewHandler(&mockService{
			mockHealthCheck: func(ctx context.Context) (int, HealthResponse, error) {
				return 500, HealthResponse{}, testErr
			},
		})

		r.GET("/common/health", h.HealthCheck(context.Background()))

		req, err := http.NewRequest(http.MethodGet, "/common/health", nil)
		if err != nil {
			t.Fatalf("Failed to create a request: %v", err)
		}

		resp := httptest.NewRecorder()
		r.ServeHTTP(resp, req)

		if resp.Code != http.StatusInternalServerError {
			t.Errorf("Expected status InternalServerError but received %v", resp.Code)
		}

		var errorResponse structs.ErrorResponse
		if err = json.NewDecoder(resp.Body).Decode(&errorResponse); err != nil {
			t.Fatalf("Failed to decode response: %v", err)
		}

		if errorResponse.Error != testErr.Error() {
			t.Errorf("Expected error %v but received %v", testErr.Error(), errorResponse.Error)
		}
	})
}

func TestMathSum_Handler(t *testing.T) {
	t.Run("MathSum Returns Success", func(t *testing.T) {
		r := gin.Default()
		h := NewHandler(&mockService{
			mockMathSum: func(ctx context.Context, sr SumRequest) (int, SumResponse, error) {
				return 200, SumResponse{Result: 10}, nil
			},
		})

		r.POST("/common/math/sum", h.MathSum(context.Background()))

		// Create payload and marshal it to JSON
		b := SumRequest{Numbers: []float64{1, 2, 3, 4}}
		payload, _ := json.Marshal(b)
		req, err := http.NewRequest(http.MethodPost, "/common/math/sum", bytes.NewBuffer(payload))

		if err != nil {
			t.Fatalf("Failed to create a request: %v", err)
		}

		req.Header.Set("Content-Type", "application/json")

		resp := httptest.NewRecorder()
		r.ServeHTTP(resp, req)

		if resp.Code != http.StatusOK {
			t.Errorf("Expected status OK but received %v", resp.Code)
		}

		var response SumResponse
		if err = json.NewDecoder(resp.Body).Decode(&response); err != nil {
			t.Fatalf("Failed to decode response: %v", err)
		}

		if response.Result != 10 {
			t.Errorf("Expected result '10' but received %v", response.Result)
		}
	})
	t.Run("MathSum Returns Error - Body is not a SumRequest", func(t *testing.T) {
		r := gin.Default()
		h := NewHandler(&mockService{
			mockMathSum: func(ctx context.Context, sr SumRequest) (int, SumResponse, error) {
				return 200, SumResponse{Result: 10}, nil
			},
		})

		r.POST("/common/math/sum", h.MathSum(context.Background()))

		// Create payload and marshal it to JSON
		b := "not a SumRequest"
		payload, _ := json.Marshal(b)
		req, err := http.NewRequest(http.MethodPost, "/common/math/sum", bytes.NewBuffer(payload))

		if err != nil {
			t.Fatalf("Failed to create a request: %v", err)
		}

		req.Header.Set("Content-Type", "application/json")

		resp := httptest.NewRecorder()
		r.ServeHTTP(resp, req)

		if resp.Code != http.StatusBadRequest {
			t.Errorf("Expected status BadRequest but received %v", resp.Code)
		}

		var errorResponse structs.ErrorResponse
		if err = json.NewDecoder(resp.Body).Decode(&errorResponse); err != nil {
			t.Fatalf("Failed to decode response: %v", err)
		}

		if errorResponse.Error != "json: cannot unmarshal string into Go value of type endpoints_Common.SumRequest" {
			t.Errorf("Expected error %v but received %v", "json: cannot unmarshal string into Go value of type endpoints_Common.SumRequest", errorResponse.Error)
		}
	})
	t.Run("MathSum Returns Error - Service.MathSum", func(t *testing.T) {
		r := gin.Default()
		testErr := errors.New("MathSum Error")
		h := NewHandler(&mockService{
			mockMathSum: func(ctx context.Context, sr SumRequest) (int, SumResponse, error) {
				return 500, SumResponse{}, testErr
			},
		})

		r.POST("/common/math/sum", h.MathSum(context.Background()))

		// Create payload and marshal it to JSON
		b := SumRequest{Numbers: []float64{1, 2, 3, 4}}
		payload, _ := json.Marshal(b)
		req, err := http.NewRequest(http.MethodPost, "/common/math/sum", bytes.NewBuffer(payload))

		if err != nil {
			t.Fatalf("Failed to create a request: %v", err)
		}

		req.Header.Set("Content-Type", "application/json")

		resp := httptest.NewRecorder()
		r.ServeHTTP(resp, req)

		if resp.Code != http.StatusInternalServerError {
			t.Errorf("Expected status InternalServerError but received %v", resp.Code)
		}

		var errorResponse structs.ErrorResponse
		if err = json.NewDecoder(resp.Body).Decode(&errorResponse); err != nil {
			t.Fatalf("Failed to decode response: %v", err)
		}

		if errorResponse.Error != testErr.Error() {
			t.Errorf("Expected error %v but received %v", testErr.Error(), errorResponse.Error)
		}
	})
}

func TestCommon_Handler(t *testing.T) {
	r := gin.Default()
	group := r.Group("/common")

	// Call the Common function
	Common(group, context.Background())

	// Test /health endpoint
	req, _ := http.NewRequest(http.MethodGet, "/common/health", nil)
	resp := httptest.NewRecorder()

	r.ServeHTTP(resp, req)

	if resp.Code != http.StatusOK {
		t.Errorf("Expected status OK but received %v", resp.Code)
	}

	// Test /sum endpoint
	req, _ = http.NewRequest(http.MethodPost, "/common/sum", nil)
	resp = httptest.NewRecorder()

	r.ServeHTTP(resp, req)

	if resp.Code != http.StatusOK && resp.Code != http.StatusBadRequest {
		t.Errorf("Expected status OK or BadRequest but received %v", resp.Code)
	}
}
