// Code generated by swaggo/swag. DO NOT EDIT.

package docs

import "github.com/swaggo/swag"

const docTemplate = `{
    "schemes": {{ marshal .Schemes }},
    "swagger": "2.0",
    "info": {
        "description": "{{escape .Description}}",
        "title": "{{.Title}}",
        "contact": {},
        "license": {
            "name": "MIT",
            "url": "http://opensource.org/licenses/MIT"
        },
        "version": "{{.Version}}"
    },
    "host": "{{.Host}}",
    "basePath": "{{.BasePath}}",
    "paths": {
        "/health": {
            "get": {
                "description": "This will return the health status of the server.",
                "produces": [
                    "application/json"
                ],
                "summary": "Health check",
                "responses": {
                    "200": {
                        "description": "OK",
                        "schema": {
                            "$ref": "#/definitions/endpoints.HealthResponse"
                        }
                    }
                }
            }
        },
        "/math/sum": {
            "post": {
                "description": "This will return the sum of the numbers.",
                "consumes": [
                    "application/json"
                ],
                "produces": [
                    "application/json"
                ],
                "summary": "Sum numbers",
                "parameters": [
                    {
                        "description": "Numbers to sum",
                        "name": "numbers",
                        "in": "body",
                        "required": true,
                        "schema": {
                            "$ref": "#/definitions/endpoints.SumRequest"
                        }
                    }
                ],
                "responses": {
                    "200": {
                        "description": "OK",
                        "schema": {
                            "$ref": "#/definitions/endpoints.SumResponse"
                        }
                    }
                }
            }
        }
    },
    "definitions": {
        "endpoints.HealthResponse": {
            "type": "object",
            "properties": {
                "status": {
                    "type": "string"
                }
            }
        },
        "endpoints.SumRequest": {
            "type": "object",
            "required": [
                "numbers"
            ],
            "properties": {
                "numbers": {
                    "type": "array",
                    "items": {
                        "type": "number"
                    }
                }
            }
        },
        "endpoints.SumResponse": {
            "type": "object",
            "properties": {
                "result": {
                    "type": "number"
                }
            }
        }
    }
}`

// SwaggerInfo holds exported Swagger Info so clients can modify it
var SwaggerInfo = &swag.Spec{
	Version:          "1.0",
	Host:             "",
	BasePath:         "/api",
	Schemes:          []string{},
	Title:            "Swagger Go API Server",
	Description:      "This is a sample server.",
	InfoInstanceName: "swagger",
	SwaggerTemplate:  docTemplate,
	LeftDelim:        "{{",
	RightDelim:       "}}",
}

func init() {
	swag.Register(SwaggerInfo.InstanceName(), SwaggerInfo)
}
