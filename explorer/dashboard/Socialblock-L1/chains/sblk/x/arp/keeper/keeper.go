package keeper

import (
	"encoding/json"

	storetypes "cosmossdk.io/store/types"
	"cosmossdk.io/store/prefix"
	sdk "github.com/cosmos/cosmos-sdk/types"

	typ "github.com/SocialBlockLabs/socialblock/chains/sblk/x/arp/types"
)

// Keeper provides read/write access to module state and scoring operations.
type Keeper struct {
	storeKey storetypes.StoreKey
}

func NewKeeper(storeKey storetypes.StoreKey) Keeper {
	return Keeper{storeKey: storeKey}
}

// getParams returns stored params or default if missing.
func (k Keeper) getParams(ctx sdk.Context) typ.Params {
	store := ctx.KVStore(k.storeKey)
	bz := store.Get([]byte(typ.ParamsKey))
	if bz == nil {
		return typ.DefaultParams()
	}
	var p typ.Params
	_ = json.Unmarshal(bz, &p)
	if err := p.Validate(); err != nil {
		return typ.DefaultParams()
	}
	return p
}

// setParams stores params.
func (k Keeper) setParams(ctx sdk.Context, p typ.Params) {
	store := ctx.KVStore(k.storeKey)
	bz, _ := json.Marshal(p)
	store.Set([]byte(typ.ParamsKey), bz)
}

// ScoreAddress computes a placeholder score for an address using simple weights.
// This scaffold uses dummy metrics; integration can replace internals later.
func (k Keeper) ScoreAddress(ctx sdk.Context, addr sdk.AccAddress) int64 {
	params := k.getParams(ctx)

	// Dummy metrics derived from address bytes for determinism in this scaffold
	addrBytes := addr.Bytes()
	var sum uint64
	for _, b := range addrBytes {
		sum += uint64(b)
	}

	// Placeholder computation
	// score = id*w1 + tx*w2 + gov*w3 + agent*w4 + peer*w5
	idComponent := (sum % 10) * params.IDWeight
	txComponent := (sum % 20) * params.TxWeight
	govComponent := (sum % 5) * params.GovWeight
	agentComponent := (sum % 3) * params.AgentWeight
	peerComponent := (sum % 7) * params.PeerWeight

	score := idComponent + txComponent + govComponent + agentComponent + peerComponent
	if score > ^uint64(0)/2 {
		return int64(^uint64(0) / 2)
	}
	return int64(score)
}

// prefixedStore returns a namespaced store for future use.
func (k Keeper) prefixedStore(ctx sdk.Context, prefixKey []byte) prefix.Store {
	store := ctx.KVStore(k.storeKey)
	return prefix.NewStore(store, prefixKey)
}

