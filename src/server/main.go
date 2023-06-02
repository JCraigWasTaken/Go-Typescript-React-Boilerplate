//go:build !test
// +build !test

// @title Swagger Go API Server
// @version 1.0
// @description This is a sample server.
// @license.name MIT
// @license.url http://opensource.org/licenses/MIT
// @BasePath /api
package main

import (
	"net/http"
	"os"
	"strings"

	_ "go-typescript-react-boilerplate/src/server/docs"
	"go-typescript-react-boilerplate/src/server/endpoints"

	"github.com/gin-contrib/gzip"
	"github.com/gin-gonic/gin"
	swaggerFiles "github.com/swaggo/files"
	ginSwagger "github.com/swaggo/gin-swagger"
)

func main() {
	host := "localhost"
	indexLocation := "../../dist"

	if os.Getenv("DOCKER_ENV") == "true" {
		host = "0.0.0.0"
		indexLocation = "./"
	}

	url := host + ":8080"

	router := gin.New()

	// Enable gzip middleware for all routes.
	// This will compress responses, reducing their size, if the client can accept gzip-encoded content.
	router.Use(gzip.Gzip(gzip.DefaultCompression, gzip.WithExcludedExtensions([]string{".png", ".jpg", ".zip", ".gz", ".rar", ".7z"}), gzip.WithExcludedPaths([]string{"/api"})))

	// This is a middleware function. In Gin, a middleware function is a function
	// that's run before the HTTP handler for each request. You can use middleware
	// functions to do things like logging, authentication, or, in this case, setting HTTP headers.
	router.Use(func(c *gin.Context) {
		// Check if the request URL path contains "/static". If it does, it's a request for a
		// static file, so we set the Cache-Control header.
		if strings.Contains(c.Request.URL.Path, "/static") {
			// The Cache-Control header controls how the file is cached. The "public" option
			// means the file can be cached by any cache, including the browser cache and
			// shared caches like a CDN. The "max-age" option controls how long the file is
			// cached for, in seconds. 31536000 seconds is one year.
			c.Header("Cache-Control", "public, max-age=31536000")
		}

		// Call the Next function to continue with the HTTP handler.
		// This is necessary in middleware functions to prevent blocking the rest of the handler chain.
		c.Next()
	})

	router.GET("/", func(c *gin.Context) {
		c.File(indexLocation + "/index.html")
	})

	apiGroup := router.Group("/api")

	// Handle the Swagger UI route.
	apiGroup.GET("/swagger/*any", ginSwagger.WrapHandler(swaggerFiles.Handler))

	// --- Edit below to add new endpoint groups ---
	healthGroup := apiGroup.Group("/health")
	endpoints.Health(healthGroup)

	mathGroup := apiGroup.Group("/math")
	endpoints.Math(mathGroup)
	// --- Finish editing here ---

	router.NoRoute(func(c *gin.Context) {
		requestPath := c.Request.URL.Path
		if strings.HasPrefix(requestPath, "/api") {
			c.JSON(http.StatusNotFound, gin.H{"message": "Not found"})
		} else {
			if requestPath[0] == '/' {
				requestPath = requestPath[1:]
			}
			fullPath := indexLocation + "/" + requestPath
			if _, err := os.Stat(fullPath); os.IsNotExist(err) {
				c.File(indexLocation + "/index.html")
			} else {
				c.File(fullPath)
			}
		}
	})

	router.Run(url)
}
