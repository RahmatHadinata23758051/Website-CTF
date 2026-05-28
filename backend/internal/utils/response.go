package utils

import "github.com/gofiber/fiber/v2"

// ResponseEnvelope represents the standardized CTF platform response contract.
type ResponseEnvelope struct {
	Success bool        `json:"success"`
	Message string      `json:"message"`
	Data    interface{} `json:"data"`
}

// SendSuccess sends a consistent success response with message and data fields.
func SendSuccess(c *fiber.Ctx, message string, data interface{}, statusCode ...int) error {
	status := fiber.StatusOK
	if len(statusCode) > 0 {
		status = statusCode[0]
	}

	return c.Status(status).JSON(ResponseEnvelope{
		Success: true,
		Message: message,
		Data:    data,
	})
}

// SendError sends a consistent error response containing only the error message.
func SendError(c *fiber.Ctx, message string, statusCode ...int) error {
	status := fiber.StatusInternalServerError
	if len(statusCode) > 0 {
		status = statusCode[0]
	}

	return c.Status(status).JSON(ResponseEnvelope{
		Success: false,
		Message: message,
		Data:    nil,
	})
}
