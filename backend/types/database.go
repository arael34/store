package types

import (
	"context"
	"time"

	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/mongo"
	"go.mongodb.org/mongo-driver/mongo/options"
)

type Database struct {
	Client   *mongo.Client
	Products *mongo.Collection
	Sessions *mongo.Collection
	Ctx      context.Context
}

func (database *Database) GetProducts() ([]*Product, error) {
	var products []*Product

	cursor, err := database.Products.Find(database.Ctx, bson.D{})
	if err != nil {
		return nil, err
	}

	err = cursor.All(database.Ctx, &products)
	if err != nil {
		return nil, err
	}

	return products, nil
}

func Connect(env *Env) error {
	db := &Database{}

	var cancel context.CancelFunc
	db.Ctx, cancel = context.WithTimeout(context.Background(), 15*time.Second)
	defer cancel()

	var err error
	db.Client, err = mongo.NewClient(options.Client().ApplyURI(env.DSI))
	if err != nil {
		return err
	}

	err = db.Client.Connect(db.Ctx)
	if err != nil {
		return err
	}

	database := db.Client.Database(env.DatabaseName)
	db.Products = database.Collection("Products")
	db.Sessions = database.Collection("Sessions")

	return nil
}
