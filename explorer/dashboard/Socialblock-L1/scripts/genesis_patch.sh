#!/usr/bin/env bash
set -euo pipefail

# Requires GENESIS (path) and DENOM in environment.
# Prints a sorted JSON diff (before vs after) and exits non-zero on failure.

GENESIS_PATH="${GENESIS:-}"
DENOM_VALUE="${DENOM:-usblk}"
INFLATION_VALUE="${INFLATION:-0.10}"

if [ -z "${GENESIS_PATH}" ]; then
  echo "GENESIS environment variable is required (path to genesis.json)" >&2
  exit 2
fi

if [ ! -f "${GENESIS_PATH}" ]; then
  echo "GENESIS file not found at: ${GENESIS_PATH}" >&2
  exit 2
fi

tmp_dir="$(mktemp -d)"
before_sorted="${tmp_dir}/before.sorted.json"
after_sorted="${tmp_dir}/after.sorted.json"
patched_tmp="${tmp_dir}/genesis.patched.json"

# Save sorted snapshot before
jq -S . "${GENESIS_PATH}" > "${before_sorted}"

# Apply jq patches (Step A) using provided DENOM and target inflation
jq --arg denom "${DENOM_VALUE}" \
   --arg infl  "${INFLATION_VALUE}" \
  '
   # Denominations across modules
   .app_state.staking.params.bond_denom = $denom |
   .app_state.mint.params.mint_denom    = $denom |
   .app_state.gov.params.min_deposit    |= map(.denom = $denom) |
   .app_state.crisis.constant_fee.denom = $denom |

   # Mint inflation targets (support multiple layouts; create when absent)
   # Legacy style
   (.app_state.mint.params.inflation         |= ("\($infl)")) |
   (.app_state.mint.minter.inflation         |= ("\($infl)")) |
   # v0.45 style constant inflation by pinning min/max and zero rate change
   (.app_state.mint.params.inflation_max      = ("\($infl)")) |
   (.app_state.mint.params.inflation_min      = ("\($infl)")) |
   (.app_state.mint.params.inflation_rate_change = ("0.000000000000000000"))
  ' \
  "${GENESIS_PATH}" > "${patched_tmp}"

mv "${patched_tmp}" "${GENESIS_PATH}"

# Save sorted snapshot after
jq -S . "${GENESIS_PATH}" > "${after_sorted}"

echo "[genesis_patch] Diff (sorted):"
diff -u "${before_sorted}" "${after_sorted}" || true

# Verify expected denominations were applied
bond_denom=$(jq -r '.app_state.staking.params.bond_denom' "${GENESIS_PATH}")
mint_denom=$(jq -r '.app_state.mint.params.mint_denom' "${GENESIS_PATH}")
gov_ok=$(jq -r --arg d "${DENOM_VALUE}" '[.app_state.gov.params.min_deposit[].denom == $d] | all' "${GENESIS_PATH}")
crisis_denom=$(jq -r '.app_state.crisis.constant_fee.denom' "${GENESIS_PATH}")

if [ "${bond_denom}" != "${DENOM_VALUE}" ] || \
   [ "${mint_denom}" != "${DENOM_VALUE}" ] || \
   [ "${gov_ok}" != "true" ] || \
   [ "${crisis_denom}" != "${DENOM_VALUE}" ]; then
  echo "[genesis_patch] Verification failed.\n  staking.bond_denom=${bond_denom}\n  mint.mint_denom=${mint_denom}\n  gov.min_deposit all=${gov_ok}\n  crisis.constant_fee.denom=${crisis_denom}" >&2
  exit 1
fi

echo "[genesis_patch] Patch applied successfully with DENOM=${DENOM_VALUE}"

rm -rf "${tmp_dir}"
