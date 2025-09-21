package app

import (
	storetypes "cosmossdk.io/store/types"
	arpkeeper "github.com/SocialBlockLabs/socialblock/chains/sblk/x/arp/keeper"
	types "github.com/SocialBlockLabs/socialblock/chains/sblk/x/arp/types"
)

// NewARPKeeper returns a keeper instance with a fresh store key.
func NewARPKeeper() (*arpkeeper.Keeper, storetypes.StoreKey) {
	storeKey := storetypes.NewKVStoreKey(types.StoreKey)
	keeper := arpkeeper.NewKeeper(storeKey)
	return keeper, storeKey
}

