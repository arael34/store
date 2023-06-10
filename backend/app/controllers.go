package app

import (
	"encoding/json"
	"log"
	"net/http"

	"github.com/arael34/store/backend/types"
	"github.com/stripe/stripe-go/v74"
	"github.com/stripe/stripe-go/v74/checkout/session"
	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/mongo/options"
)

func (app *App) RetrieveItems(w http.ResponseWriter, r *http.Request) {
	if r.Method != "GET" {
		http.Error(w, "Method not allowed", http.StatusMethodNotAllowed)
		return
	}

	w.Header().Set("Content-Type", "application/json")

	var products []*types.Product
	cur, err := app.Database.Products.Find(app.Database.Ctx, bson.D{})
	if err != nil {
		http.Error(w, "Database error", http.StatusInternalServerError)
		return
	}

	err = cur.All(app.Database.Ctx, &products)
	if err != nil {
		http.Error(w, "Database error", http.StatusInternalServerError)
		return
	}

	json.NewEncoder(w).Encode(products)
}

func (app *App) Checkout(w http.ResponseWriter, r *http.Request) {
	domain := "http://localhost:4242"
	params := &stripe.CheckoutSessionParams{
		LineItems: []*stripe.CheckoutSessionLineItemParams{
			{
				// Provide the exact Price ID (for example, pr_1234) of the product you want to sell
				Price:    stripe.String("{{PRICE_ID}}"),
				Quantity: stripe.Int64(1),
			},
		},
		Mode:       stripe.String(string(stripe.CheckoutSessionModePayment)),
		SuccessURL: stripe.String(domain + "/success"),
		CancelURL:  stripe.String(domain + "/cart"),
	}

	s, err := session.New(params)

	if err != nil {
		log.Printf("session.New: %v", err)
	}

	http.Redirect(w, r, s.URL, http.StatusSeeOther)
}

func (app *App) AddToCart(w http.ResponseWriter, r *http.Request) {
	if r.Method != "POST" {
		http.Error(w, "Method not allowed", http.StatusMethodNotAllowed)
		return
	}

	// TODO get cookie from request
	cookie := ""

	if cookie == "" {
		cookie = "f" // Generate cookie somehow
	}

	opts := options.FindOneAndUpdate().SetUpsert(true)

	session := app.Database.Sessions.FindOneAndUpdate(
		app.Database.Ctx,
		types.NewSession(&cookie), // TODO vvv
		bson.M{"$push": bson.M{"cart.orders": bson.M{"product._id": "1234", "quantity": 1}}},
		opts,
	)

	if session.Err() != nil {
		http.Error(w, "Error creating session", http.StatusInternalServerError)
		return
	}

	w.Write([]byte(cookie))
}

func (app *App) RemoveFromCart(w http.ResponseWriter, r *http.Request) {
	if r.Method != "POST" {
		http.Error(w, "Method not allowed", http.StatusMethodNotAllowed)
		return
	}

	// TODO get cookie from request
	cookie := ""

	session := app.Database.Sessions.FindOne(
		app.Database.Ctx,
		bson.M{"SessionToken": cookie})

	if session.Err() != nil {
		http.Error(w, "No session found", http.StatusBadRequest)
		return
	}

	var products []*types.ProductOrder
	err := json.NewDecoder(r.Body).Decode(&products)

	if err != nil {
		http.Error(w, "Error decoding request", http.StatusBadRequest)
		return
	}

	for _, product := range products {
		if err = app.Database.Sessions.FindOneAndUpdate(
			app.Database.Ctx,
			bson.M{"SessionToken": cookie},
			bson.M{"$pull": bson.M{"cart.orders": bson.M{"product._id": product.Product.ID}}},
		).Err(); err != nil {
			http.Error(w, "Error removing product from cart", http.StatusInternalServerError)
			return
		}
	}
}

func (app *App) ViewCart(w http.ResponseWriter, r *http.Request) {
	if r.Method != "GET" {
		http.Error(w, "Method not allowed", http.StatusMethodNotAllowed)
		return
	}

	w.Header().Set("Content-Type", "application/json")

	// TODO get cookie from request
	cookie := ""

	// if r.cookie is nil, return empty cart
	if cookie == "" {
		cart := &types.Cart{}
		json.NewEncoder(w).Encode(cart)
		return
	}

	var products []*types.ProductOrder

	cur, err := app.Database.Sessions.Find(
		app.Database.Ctx,
		bson.M{"sessiontoken": cookie},
	)
	if err != nil {
		http.Error(
			w,
			"Database error or no cart found",
			http.StatusInternalServerError,
		)
		return
	}

	err = cur.All(app.Database.Ctx, &products)
	if err != nil {
		http.Error(w, "Database error", http.StatusInternalServerError)
		return
	}

	json.NewEncoder(w).Encode(products)
}

func (app *App) UpdateCart(w http.ResponseWriter, r *http.Request) {
	if r.Method != "POST" {
		http.Error(w, "Method not allowed", http.StatusMethodNotAllowed)
		return
	}

	w.Write([]byte("Update cart"))
}

func (app *App) ClearCart(w http.ResponseWriter, r *http.Request) {
	if r.Method != "POST" {
		http.Error(w, "Method not allowed", http.StatusMethodNotAllowed)
		return
	}

	// TODO get cookie from request
	cookie := ""

	err := app.Database.Sessions.FindOneAndUpdate(
		app.Database.Ctx,
		bson.M{"SessionToken": cookie},
		bson.M{"$set": bson.M{"cart.orders": bson.A{}}},
	).Err()

	if err != nil {
		http.Error(w, "Error clearing cart", http.StatusInternalServerError)
		return
	}
}
