package main

import (
	"log"

	backend "github.com/arael34/store/backend/app"
)

func main() {
	app, err := backend.NewApp()
	if err != nil {
		log.Fatal(err)
	}

	app.Run()
}
