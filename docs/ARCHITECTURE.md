# DegenArcade Architecture

## Overview

DegenArcade is a crypto-native, gamified betting platform built on Sui blockchain, featuring a simple double-or-nothing coin flip game.

## System Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                        Frontend (React)                      │
│  ┌──────────────────────────────────────────────────────┐   │
│  │              Sui dApp Kit + PTB                       │   │
│  │  - Wallet Connection                                  │   │
│  │  - Transaction Building                               │   │
│  │  - Programmable Transaction Blocks                    │   │
│  └──────────────────────────────────────────────────────┘   │
│  ┌──────────────────────────────────────────────────────┐   │
│  │              Game Components                          │   │
│  │  - Coin Flip UI                                       │   │
│  │  - Betting Interface                                  │   │
│  │  - Results Display                                    │   │
│  └──────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────┘
                            │
                            │ PTB Transactions
                            │
┌─────────────────────────────────────────────────────────────┐
│                    Sui Blockchain                           │
│  ┌──────────────────────────────────────────────────────┐   │
│  │              Move Smart Contracts                     │   │
│  │                                                       │   │
│  │  ┌──────────────────┐  ┌──────────────────────────┐  │   │
│  │  │  character.move  │  │    game_engine.move      │  │   │
│  │  │                  │  │                          │  │   │
│  │  │  - Player NFT    │  │  - Coin Flip Logic      │  │   │
│  │  │  - Stats         │  │  - Bet Management        │  │   │
│  │  │  - Rewards       │  │  - Payout Calculation    │  │   │
│  │  │                  │  │  - Verifiable Randomness │  │   │
│  │  └──────────────────┘  └──────────────────────────┘  │   │
│  └──────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────┘
```

## Move Contract Architecture

### Module: `character`
**Purpose**: Manages player identity and statistics

**Key Components**:
- `Character` struct: NFT representing player identity
- `PlayerStats` struct: Tracks wins, losses, total wagered
- Functions:
  - `create_character()`: Mint new player NFT
  - `update_stats()`: Update player statistics after games
  - `get_stats()`: Query player statistics

### Module: `game_engine`
**Purpose**: Core game logic for double-or-nothing coin flip

**Key Components**:
- `Game` struct: Represents an active game session
- `GameResult` struct: Stores game outcome
- `GamePool` struct: Manages the betting pool
- Functions:
  - `create_game()`: Initialize a new game
  - `place_bet()`: Player places a bet (heads or tails)
  - `flip_coin()`: Execute the coin flip with verifiable randomness
  - `claim_winnings()`: Distribute winnings to winners
  - `get_game_result()`: Query game results

**Game Flow**:
1. Player creates/selects character
2. Player places bet (heads/tails) with SUI amount
3. Game engine flips coin using verifiable randomness
4. Winners receive 2x their bet (double or nothing)
5. Player stats updated

## Frontend Architecture

### Tech Stack
- **React** + **TypeScript**
- **Sui dApp Kit**: Wallet connection and transaction management
- **Programmable Transaction Blocks (PTBs)**: Atomic multi-operation transactions
- **Tailwind CSS**: Styling

### Component Structure
```
frontend/
├── src/
│   ├── components/
│   │   ├── CoinFlip.tsx       # Main coin flip game UI
│   │   ├── BettingPanel.tsx   # Bet amount and side selection
│   │   ├── GameResult.tsx     # Display game results
│   │   └── WalletButton.tsx   # Wallet connection
│   ├── lib/
│   │   ├── sui.ts            # Sui client setup
│   │   └── contracts.ts      # Contract interaction helpers
│   ├── hooks/
│   │   └── useGame.ts        # Game state management
│   └── App.tsx               # Main application
```

### Transaction Flow (PTB)
1. User selects bet side (heads/tails) and amount
2. Frontend builds PTB:
   - Transfer SUI to game pool
   - Call `place_bet()` in game_engine
   - Call `flip_coin()` to execute game
   - Update character stats
3. Single atomic transaction submitted to Sui
4. Result displayed to user

## Verifiable Fairness

The coin flip uses Sui's deterministic randomness:
- Transaction hash + block timestamp as seed
- Verifiable on-chain for transparency
- No central authority needed

## Data Flow

```
User Action → Frontend → PTB Builder → Sui Network
                                      ↓
                              Move Contracts
                                      ↓
                              Game Execution
                                      ↓
                              Result + Payout
                                      ↓
                              Frontend Update
```

## Security Considerations

1. **Bet Validation**: Ensure minimum/maximum bet limits
2. **Pool Management**: Proper handling of game pool funds
3. **Randomness**: Use verifiable on-chain randomness
4. **Access Control**: Only authorized functions can update game state
5. **Reentrancy**: Move's linear types prevent reentrancy attacks

## Future Enhancements

- Multiple game types (Up/Down, Football matches)
- Leaderboards
- NFT rewards for achievements
- Social features
- Advanced betting options

