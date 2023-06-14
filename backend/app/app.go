package app

import (
	"log"
	"net/http"

	"github.com/arael34/store/backend/types"
)

type App struct {
	Database *types.Database
}

func NewApp() (*App, error) {
	env, err := types.LoadEnv()
	if err != nil {
		return nil, err
	}

	db, err := types.Connect(env)
	if err != nil {
		return nil, err
	}

	return &App{Database: db}, nil
}

func (app *App) Run() {
	// Set up api routes
	http.HandleFunc("/api/products", app.RetrieveProducts)
	http.HandleFunc("/api/checkout", app.Checkout)
	http.HandleFunc("/api/cart/add", app.AddToCart)
	http.HandleFunc("/api/cart/remove", app.RemoveFromCart)
	http.HandleFunc("/api/cart/view", app.ViewCart)
	http.HandleFunc("/api/cart/update", app.UpdateCart)
	http.HandleFunc("/api/cart/clear", app.ClearCart)

	// Serve frontend
	http.Handle("/", http.FileServer(http.Dir("../frontend/dist")))

	log.Fatal(http.ListenAndServe(":4242", nil))
}
