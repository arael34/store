package types

import (
	"time"

	"go.mongodb.org/mongo-driver/bson/primitive"
)

type Product struct {
	ID          primitive.ObjectID `bson:"_id"`
	Name        string             `bson:"name"`
	Description string             `bson:"description"`
	ImageSrc    string             `bson:"imagesrc"`
	Price       int64              `bson:"price"`
	Quantity    int64              `bson:"quantity"`
}

type ProductOrder struct {
	Product  *Product `bson:"product"`
	Quantity int64    `bson:"quantity"`
}

type Cart struct {
	Orders []*ProductOrder `bson:"orders"`
}

type Session struct {
	ID           primitive.ObjectID `bson:"_id"`
	SessionToken string             `bson:"sessiontoken"` // TODO Should be unique
	Cart         *Cart              `bson:"cart"`
	Expires      time.Time          `bson:"expires"`
}

func NewSession(token *string) *Session {
	return &Session{
		SessionToken: *token,
		Cart:         &Cart{},
		Expires:      time.Now().Add(72 * time.Hour),
	}
}
