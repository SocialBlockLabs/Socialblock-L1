package app

import (
	"github.com/cosmos/cosmos-sdk/types"
)

func (app *App) SomeFunction() *keeper.Keeper {
	...
	return &keeper
}