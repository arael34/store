package app

import (
	"log"
	"net/http"

	"github.com/arael34/store/backend/types"
)

type App struct {
	Database *types.Database
}

func (app *App) Run() {
	// Set up routes
	http.HandleFunc("/items", app.RetrieveItems)
	http.HandleFunc("/checkout", app.Checkout)
	http.HandleFunc("/cart/add", app.AddToCart)
	http.HandleFunc("/cart/remove", app.RemoveFromCart)
	http.HandleFunc("/cart/view", app.ViewCart)
	http.HandleFunc("/cart/update", app.UpdateCart)
	http.HandleFunc("/cart/clear", app.ClearCart)

	// Serve frontend
	http.Handle("/", http.FileServer(http.Dir("./static")))

	log.Fatal(http.ListenAndServe(":4242", nil))
}
