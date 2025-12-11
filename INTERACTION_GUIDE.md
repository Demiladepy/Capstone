# Degen Arcade - Quick Reference Guide

## Contract Information

**Package ID:** `0xdcfef4a6409f9e593d97df1c96b024ea2570cfb59d3eed4975dbb87b29212290`

**Network:** Sui Mainnet

**Modules:** character, game_engine

---

## Creating a Character

Create a new character NFT for playing games:

```bash
sui client call \
  --package 0xdcfef4a6409f9e593d97df1c96b024ea2570cfb59d3eed4975dbb87b29212290 \
  --module character \
  --function create_character \
  --args "[107,105,110,103]" \
  --gas-budget 100000000
```

**Note:** The array `[107,105,110,103]` is the ASCII bytes for "king". Convert your desired name to bytes.

---

## Creating a Game

Initialize a new coin flip game with a bet amount:

```bash
sui client call \
  --package 0xdcfef4a6409f9e593d97df1c96b024ea2570cfb59d3eed4975dbb87b29212290 \
  --module game_engine \
  --function create_game \
  --args "1000000" \
  --gas-budget 100000000
```

**Parameters:**
- `1000000` - The bet amount in MIST (1 MIST = 0.000000001 SUI)

---

## Placing a Bet

Place a bet on an existing game (heads=0, tails=1):

```bash
sui client call \
  --package 0xdcfef4a6409f9e593d97df1c96b024ea2570cfb59d3eed4975dbb87b29212290 \
  --module game_engine \
  --function place_bet \
  --args "<GAME_ID>" "<COIN_ID>" "0" "1000000" \
  --gas-budget 100000000
```

**Parameters:**
- `<GAME_ID>` - The game object ID from `create_game`
- `<COIN_ID>` - A Coin<SUI> object ID to use for the bet
- `0` - HEADS (0) or TAILS (1)
- `1000000` - Bet amount in MIST

---

## Flipping the Coin

Determine the outcome of a game:

```bash
sui client call \
  --package 0xdcfef4a6409f9e593d97df1c96b024ea2570cfb59d3eed4975dbb87b29212290 \
  --module game_engine \
  --function flip_coin \
  --args "<GAME_ID>" \
  --gas-budget 100000000
```

---

## Claiming Winnings

Claim winnings if you won the bet:

```bash
sui client call \
  --package 0xdcfef4a6409f9e593d97df1c96b024ea2570cfb59d3eed4975dbb87b29212290 \
  --module game_engine \
  --function claim_winnings \
  --args "<GAME_ID>" "<PLAYER_ADDRESS>" "<YOUR_SIDE>" "<BET_AMOUNT>" \
  --gas-budget 100000000
```

---

## Checking Your Objects

List all your objects:

```bash
sui client objects
```

View a specific object:

```bash
sui client object <OBJECT_ID>
```

---

## Useful Commands

View your address:
```bash
sui client active-address
```

Check your gas objects:
```bash
sui client gas
```

View transaction history:
```bash
sui client transactions
```

Get transaction details:
```bash
sui client tx-result <TRANSACTION_DIGEST>
```

---

## Error Codes

The contract uses these error codes in assertions:

- **0 (EGameNotFound)** - Game not found
- **1 (EGameAlreadyResolved)** - Game has already been resolved
- **2 (EInvalidBetSide)** - Invalid bet side (must be 0 or 1)
- **3 (EInsufficientFunds)** - Insufficient funds for the game
- **4 (EGameNotResolved)** - Game hasn't been resolved yet
- **5 (ENoWinnings)** - Player didn't win

---

## Frontend Integration

The `frontend` folder contains a React app to interact with this contract:

1. Install dependencies:
   ```bash
   cd frontend
   npm install
   ```

2. Update `src/lib/contracts.ts` with the Package ID

3. Run the development server:
   ```bash
   npm run dev
   ```

4. Connect your wallet and start playing!

---

## Testing Workflow

1. **Create a game:**
   ```bash
   sui client call --package 0xdcfef4a6409f9e593d97df1c96b024ea2570cfb59d3eed4975dbb87b29212290 --module game_engine --function create_game --args "1000000" --gas-budget 100000000
   ```
   Save the Game ID from the output

2. **Place a bet:**
   ```bash
   sui client call --package 0xdcfef4a6409f9e593d97df1c96b024ea2570cfb59d3eed4975dbb87b29212290 --module game_engine --function place_bet --args "<GAME_ID>" "<COIN_ID>" "0" "1000000" --gas-budget 100000000
   ```

3. **Flip the coin:**
   ```bash
   sui client call --package 0xdcfef4a6409f9e593d97df1c96b024ea2570cfb59d3eed4975dbb87b29212290 --module game_engine --function flip_coin --args "<GAME_ID>" --gas-budget 100000000
   ```

4. **Check results:**
   ```bash
   sui client object <GAME_ID>
   ```

---

## Explorer Links

- **View Package:** https://suiscan.xyz/mainnet/package/0xdcfef4a6409f9e593d97df1c96b024ea2570cfb59d3eed4975dbb87b29212290
- **View Transactions:** https://suiscan.xyz/mainnet/txblocks

---

## Useful Resources

- [Sui Documentation](https://docs.sui.io)
- [Sui CLI Reference](https://docs.sui.io/references/cli)
- [Move Language](https://move-language.github.io/)
- [Sui SDK for TypeScript](https://sdk.mystenlabs.com/)

---

**Last Updated:** December 10, 2025
