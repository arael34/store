package types

import (
	"errors"
	"os"

	"github.com/joho/godotenv"
)

type Env struct {
	DSI          string
	DatabaseName string
	StripeKey    string
}

func LoadEnv() (*Env, error) {
	// In production, the environment variables
	// will be set in the OS env.
	if os.Getenv("ENV") == "PROD" {
		DSI := os.Getenv("DSI")
		DatabaseName := os.Getenv("DATABASE_NAME")
		StripeKey := os.Getenv("STRIPE_KEY")

		if DSI == "" || DatabaseName == "" || StripeKey == "" {
			return nil, errors.New("failed to parse production env")
		}

		return &Env{
			DSI:          DSI,
			DatabaseName: DatabaseName,
			StripeKey:    StripeKey,
		}, nil
	}

	// Parse .env
	var env map[string]string
	env, err := godotenv.Read()
	if err != nil {
		return nil, errors.New("failed to read local env")
	}

	DSI := env["DSI"]
	DatabaseName := env["DATABASE_NAME"]
	StripeKey := env["STRIPE_KEY"]

	if DSI == "" || DatabaseName == "" || StripeKey == "" {
		return nil, errors.New("failed to parse local env")
	}

	return &Env{
		DSI:          DSI,
		DatabaseName: DatabaseName,
		StripeKey:    StripeKey,
	}, nil
}
