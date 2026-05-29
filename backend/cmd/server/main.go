package main

import (
	"log"

	"ctf-platform/backend/internal/config"
	"ctf-platform/backend/internal/database"
	"ctf-platform/backend/internal/handlers"
	"ctf-platform/backend/internal/routes"
	"ctf-platform/backend/seeders"

	"github.com/gofiber/fiber/v2"
	"github.com/gofiber/fiber/v2/middleware/cors"
	"github.com/gofiber/fiber/v2/middleware/logger"
	"github.com/gofiber/fiber/v2/middleware/recover"
)

func main() {
	// 1. Load Configurations
	cfg := config.LoadConfig()

	// 2. Connect Databases
	db := database.InitDB(cfg)
	database.InitRedis(cfg)

	// 3. Seed Database in Development
	if cfg.AppEnv == "development" {
		seeders.Seed(db, cfg.FlagSalt)
	}

	// 4. Initialize Fiber App
	app := fiber.New(fiber.Config{
		AppName: "CTF Challenge Platform API",
		// Enable global error handler returning JSON envelopes
		ErrorHandler: func(c *fiber.Ctx, err error) error {
			code := fiber.StatusInternalServerError
			if e, ok := err.(*fiber.Error); ok {
				code = e.Code
			}
			return c.Status(code).JSON(fiber.Map{
				"success": false,
				"data":    nil,
				"error":   err.Error(),
			})
		},
	})

	// 3. Mount Middlewares
	app.Use(recover.New()) // Capture panics
	app.Use(logger.New(logger.Config{
		Format: "[${time}] ${status} - ${latency} ${method} ${path}\n",
	}))
	app.Use(cors.New(cors.Config{
		AllowOrigins:     "http://localhost:5173, http://127.0.0.1:5173", // standard React/Vite local client ports
		AllowHeaders:     "Origin, Content-Type, Accept, Authorization",
		AllowMethods:     "GET, POST, HEAD, PUT, DELETE, PATCH, OPTIONS",
		AllowCredentials: true,
	}))

	// Serve challenge static uploads locally
	app.Static("/uploads/challenges", "./storage/uploads/challenges")

	// 4. Define Route Groups
	api := app.Group("/api")

	// Base Health Endpoint
	api.Get("/health", handlers.HealthCheck)

	// Auth Endpoint Routes
	routes.SetupAuthRoutes(api, cfg)

	// Challenge Endpoint Routes
	routes.SetupChallengeRoutes(api, cfg)

	// Submission Endpoint Routes
	routes.SetupSubmissionRoutes(api, cfg)

	// Scoreboard Endpoint Routes
	routes.SetupScoreboardRoutes(api)

	// Hint Endpoint Routes
	routes.SetupHintRoutes(api, cfg)

	// Stats Endpoint Routes
	routes.SetupStatsRoutes(api, cfg)

	// Admin Endpoint Routes (admin-only, JWT + role guard applied inside)
	routes.SetupAdminRoutes(api, cfg)

	// 5. Start Server
	log.Printf("[SERVER] Starting backend on port %s in %s mode...\n", cfg.Port, cfg.AppEnv)
	if err := app.Listen(":" + cfg.Port); err != nil {
		log.Fatalf("[SERVER] Fatal: failed to start backend: %v", err)
	}
}
