# DegenArcade Smart Contracts

Move smart contracts for the DegenArcade betting platform.

## Modules

### `character.move`
Manages player identity and statistics.

**Key Functions:**
- `create_character(name, ctx)`: Create a new character NFT for a player
- `update_stats(character, won, amount)`: Update character statistics after a game
- `get_stats(character)`: Get character statistics (wins, losses, total wagered)

### `game_engine.move`
Core game logic for the double-or-nothing coin flip.

**Key Functions:**
- `create_game(pool, counter, ctx)`: Create a new game instance
- `place_bet(game, bet_coin, side, ctx)`: Place a bet on heads (0) or tails (1)
- `flip_coin(game, ctx)`: Execute the coin flip with verifiable randomness
- `claim_winnings(game, player, bet_side, bet_amount, ctx)`: Claim winnings if the player won

**Constants:**
- `HEADS = 0`: Bet on heads
- `TAILS = 1`: Bet on tails

## Building

```bash
sui move build
```

## Testing

```bash
sui move test
```

## Deployment

```bash
# Switch to testnet
sui client switch --env testnet

# Publish
sui client publish --gas-budget 100000000
```

After deployment, note the Package ID and Object IDs for GamePool and GameCounter.

## Game Flow

1. **Create Game**: `create_game()` initializes a new game
2. **Place Bet**: `place_bet()` adds player's bet to the game pool
3. **Flip Coin**: `flip_coin()` resolves the game using transaction hash for randomness
4. **Claim Winnings**: `claim_winnings()` distributes 2x bet amount to winners

## Verifiable Fairness

The coin flip uses the transaction hash as a source of randomness. This is:
- **Deterministic**: Same transaction hash = same result
- **Verifiable**: Anyone can verify the result by checking the transaction
- **Fair**: No central authority can manipulate the outcome

For production, consider integrating with Sui's randomness oracle or using a commit-reveal scheme.

