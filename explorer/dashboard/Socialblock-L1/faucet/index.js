import express from 'express';
import dotenv from 'dotenv';
import { DirectSecp256k1HdWallet } from '@cosmjs/proto-signing';
import { SigningStargateClient, coins, GasPrice } from '@cosmjs/stargate';
import { Bech32 } from 'bech32';

dotenv.config();

const PORT = process.env.PORT || 8000;
const RPC_HTTP = process.env.RPC_HTTP || 'http://localhost:26657';
const CHAIN_ID = process.env.CHAIN_ID || 'socialblock-testnet-1';
const DENOM = process.env.DENOM || 'usblk';
const BECH32_PREFIX = process.env.BECH32_PREFIX || 'cosmos';
const GAS_PRICE = process.env.GAS_PRICE || `0.025${DENOM}`;
const FAUCET_MNEMONIC = process.env.FAUCET_MNEMONIC;

if (!FAUCET_MNEMONIC) {
  // In a dev/test setting, we can optionally derive from a default account name inside node keyring, but CosmJS needs mnemonic.
  // Fail fast to keep behavior explicit.
  console.error('Missing FAUCET_MNEMONIC env var');
  process.exit(1);
}

function isValidBech32(address, prefix) {
  try {
    const decoded = Bech32.decode(address);
    return decoded.prefix === prefix;
  } catch (e) {
    return false;
  }
}

async function createClient() {
  const wallet = await DirectSecp256k1HdWallet.fromMnemonic(FAUCET_MNEMONIC, { prefix: BECH32_PREFIX });
  const [account] = await wallet.getAccounts();
  const client = await SigningStargateClient.connectWithSigner(RPC_HTTP, wallet, {
    gasPrice: GasPrice.fromString(GAS_PRICE),
  });
  return { client, faucetAddress: account.address };
}

const app = express();
app.use(express.json());

app.get('/health', (req, res) => {
  res.json({ ok: true });
});

app.post('/send', async (req, res) => {
  try {
    const { address, amount } = req.body || {};
    if (!address || !amount) {
      return res.status(400).json({ error: 'address and amount are required' });
    }
    if (!isValidBech32(address, BECH32_PREFIX)) {
      return res.status(400).json({ error: `invalid address, expected prefix ${BECH32_PREFIX}` });
    }

    const parsed = Number.parseInt(amount, 10);
    if (!Number.isFinite(parsed) || parsed <= 0) {
      return res.status(400).json({ error: 'amount must be a positive integer' });
    }

    const { client, faucetAddress } = await createClient();
    const result = await client.sendTokens(
      faucetAddress,
      address,
      coins(parsed, DENOM),
      'auto',
      'faucet drip'
    );

    res.json({ txHash: result.transactionHash });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'failed to send tokens' });
  }
});

app.listen(PORT, () => {
  console.log(`Faucet listening on :${PORT}`);
  console.log(`RPC: ${RPC_HTTP}, chainId: ${CHAIN_ID}, denom: ${DENOM}, bech32: ${BECH32_PREFIX}`);
});

