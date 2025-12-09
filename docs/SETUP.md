# Setup Guide

## Quick Start

### 1. Install Prerequisites

#### Sui CLI
```bash
# Install Sui CLI (if not already installed)
cargo install --locked --git https://github.com/MystenLabs/sui.git --branch devnet sui
```

#### Node.js
Ensure you have Node.js v18+ installed:
```bash
node --version
```

### 2. Setup Smart Contracts

```bash
cd contract

# Build the contracts
sui move build

# Run tests (if you add any)
sui move test
```

### 3. Deploy Contracts

#### For Testnet:
```bash
# Switch to testnet
sui client switch --env testnet

# Get testnet SUI from faucet if needed
# Visit: https://discord.com/channels/916379725201563759/971488439931392130

# Publish the package
sui client publish --gas-budget 100000000
```

After publishing, you'll get:
- **Package ID**: The deployed package address
- **Object IDs**: For GamePool and GameCounter (from the `init` function)

#### Update Frontend Configuration

Edit `frontend/src/lib/sui.ts`:
```typescript
export const CONTRACT_ADDRESS = 'YOUR_PACKAGE_ID_HERE';
export const GAME_POOL_ID = 'YOUR_GAME_POOL_ID_HERE';
export const GAME_COUNTER_ID = 'YOUR_GAME_COUNTER_ID_HERE';
```

### 4. Setup Frontend

```bash
cd frontend

# Install dependencies
npm install

# Start development server
npm run dev
```

The app will be available at `http://localhost:5173`

### 5. Connect Wallet

1. Install [Sui Wallet Extension](https://chrome.google.com/webstore/detail/sui-wallet/opcgpfmipidbgpenhmajoajpbobppdil)
2. Create or import a wallet
3. Switch to testnet in the wallet
4. Get testnet SUI from the faucet
5. Connect wallet in the DegenArcade app

## Troubleshooting

### Contract Build Errors

If you get build errors:
```bash
# Clean build artifacts
sui move clean
sui move build
```

### Frontend Connection Issues

- Ensure you're on the same network (testnet/devnet) in both wallet and app
- Check that contract addresses are correctly set in `sui.ts`
- Verify the wallet extension is enabled

### Transaction Failures

- Ensure you have enough SUI for gas fees
- Check that the contract addresses are correct
- Verify the game pool and counter objects exist

## Development Workflow

1. **Make changes to contracts** → `sui move build` → `sui client publish`
2. **Update contract addresses** in `frontend/src/lib/sui.ts`
3. **Make frontend changes** → `npm run dev` (auto-reloads)
4. **Test the full flow** in the browser

## Next Steps

- Add more game types
- Implement character NFT creation
- Add leaderboards
- Enhance UI/UX

