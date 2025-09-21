package types

import (
	"fmt"
)

// Params defines weight parameters used by the ARP keeper to compute scores.
// These are intentionally simple and stored directly in KV store for this scaffold.
type Params struct {
	IDWeight    uint64 `json:"id_weight"`
	TxWeight    uint64 `json:"tx_weight"`
	GovWeight   uint64 `json:"gov_weight"`
	AgentWeight uint64 `json:"agent_weight"`
	PeerWeight  uint64 `json:"peer_weight"`
}

func DefaultParams() Params {
	return Params{
		IDWeight:    1,
		TxWeight:    1,
		GovWeight:   1,
		AgentWeight: 1,
		PeerWeight:  1,
	}
}

func (p Params) Validate() error {
	// In this simple scaffold, only ensure values are not absurdly large.
	const max = ^uint64(0) / 2
	if p.IDWeight > max || p.TxWeight > max || p.GovWeight > max || p.AgentWeight > max || p.PeerWeight > max {
		return fmt.Errorf("params weight overflow")
	}
	return nil
}

