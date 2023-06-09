package types

type Env struct {
	DSI          string
	DatabaseName string
	StripeKey    string
}

func LoadEnv() (*Env, error) {
	return &Env{}, nil
}
