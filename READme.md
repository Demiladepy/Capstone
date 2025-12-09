# 🎮 DegenArcade

A crypto-native, gamified betting platform built on Sui blockchain for swing traders, memecoin degens, and risk-loving crypto communities.

## 🎯 Project Overview

DegenArcade is a simple double-or-nothing coin flip game built for a 3-day hackathon. Players can bet SUI on heads or tails, and winners receive 2x their bet amount.

## 🏗️ Architecture

See [docs/ARCHITECTURE.md](./docs/ARCHITECTURE.md) for detailed architecture documentation.

### Key Components

- **Move Smart Contracts**: Two modules (`character` and `game_engine`)
- **React Frontend**: Built with Sui dApp Kit and Programmable Transaction Blocks (PTBs)
- **Double or Nothing Game**: Simple coin flip with verifiable fairness

## 📁 Project Structure

```
degen-arcade/
├── contract/              # Move smart contracts
│   ├── Move.toml
│   └── sources/
│       ├── character.move
│       └── game_engine.move
├── frontend/              # React frontend
│   ├── src/
│   │   ├── components/    # React components
│   │   ├── lib/          # Sui client and contract helpers
│   │   └── App.tsx
│   └── package.json
└── docs/                  # Documentation
    └── ARCHITECTURE.md
```

## 🚀 Getting Started

### Prerequisites

- [Sui CLI](https://docs.sui.io/build/install) installed
- [Node.js](https://nodejs.org/) (v18 or higher)
- A Sui wallet (Sui Wallet extension)

### Smart Contract Setup

1. Navigate to the contract directory:
```bash
cd contract
```

2. Build the contracts:
```bash
sui move build
```

3. Test the contracts:
```bash
sui move test
```

4. Deploy to testnet:
```bash
sui client publish --gas-budget 100000000
```

After deployment, note the:
- Package ID
- GamePool object ID
- GameCounter object ID

Update these in `frontend/src/lib/sui.ts`:
```typescript
export const CONTRACT_ADDRESS = 'YOUR_PACKAGE_ID';
export const GAME_POOL_ID = 'YOUR_GAME_POOL_ID';
export const GAME_COUNTER_ID = 'YOUR_GAME_COUNTER_ID';
```

### Frontend Setup

1. Navigate to the frontend directory:
```bash
cd frontend
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

4. Open your browser to `http://localhost:5173`

## 🎮 How to Play

1. **Connect Wallet**: Click "Connect Wallet" and approve the connection
2. **Set Bet Amount**: Enter the amount of SUI you want to bet (minimum 0.1 SUI)
3. **Choose Side**: Select either Heads 🪙 or Tails 🪙
4. **Flip Coin**: Click "Flip Coin" to execute the game
5. **Win or Lose**: 
   - If you win: Receive 2x your bet amount
   - If you lose: Your bet goes to the game pool

## 🔧 Smart Contract Modules

### `character.move`
Manages player identity and statistics:
- Create character NFTs
- Track wins, losses, and total wagered
- Update player statistics

### `game_engine.move`
Core game logic for the coin flip:
- Create new games
- Place bets (heads/tails)
- Flip coin with verifiable randomness
- Claim winnings
- Manage game pool

## 🛠️ Technology Stack

### Smart Contracts
- **Move**: Sui's native programming language
- **Sui Framework**: Standard library for Sui development

### Frontend
- **React 18**: UI framework
- **TypeScript**: Type safety
- **Sui dApp Kit**: Wallet integration and transaction management
- **Programmable Transaction Blocks (PTBs)**: Atomic multi-operation transactions
- **Tailwind CSS**: Styling
- **Vite**: Build tool

## 🔐 Security Features

- **Verifiable Fairness**: Coin flip uses transaction hash for randomness (verifiable on-chain)
- **Atomic Transactions**: PTBs ensure all operations succeed or fail together
- **Access Control**: Only authorized functions can modify game state
- **Linear Types**: Move's type system prevents reentrancy attacks

## 📝 Development Notes

### Programmable Transaction Blocks (PTBs)

The frontend uses PTBs to compose multiple Move operations into a single atomic transaction:

```typescript
// Example: Create game, place bet, and flip coin in one transaction
const tx = new TransactionBlock();
// ... add multiple operations
await signAndExecute({ transactionBlock: tx });
```

### Verifiable Randomness

The coin flip uses the transaction hash as a source of randomness. While this is deterministic and verifiable, for production you may want to integrate with Sui's randomness oracle or use a commit-reveal scheme.

## 🚧 Future Enhancements

- [ ] Multiple game types (Up/Down, Football matches)
- [ ] Leaderboards and achievements
- [ ] NFT rewards for milestones
- [ ] Social features and sharing
- [ ] Advanced betting options
- [ ] Real-time game statistics

## 📄 License

This project is built for a hackathon. Use at your own risk.

## 🤝 Contributing

This is a hackathon project. Feel free to fork and build upon it!

## ⚠️ Disclaimer

This is a demonstration project built for educational purposes. Always conduct thorough security audits before deploying to mainnet.

