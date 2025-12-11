# Degen Arcade - Deployment Information

## Deployment Details

**Network:** Sui Testnet (Mainnet)
**Deployment Date:** December 10, 2025

## Contract IDs

### Package ID
```
0xdcfef4a6409f9e593d97df1c96b024ea2570cfb59d3eed4975dbb87b29212290
```

### Transaction Digest
```
btkBdvT28a8rQDSjdiC7njE7t81g3nLokHvrMoH8dhe
```

## Objects Created During Deployment

### UpgradeCap
- **Object ID:** `0x5eb0306d6b3055984956f765be0c8397a059a7ff74547cb739cf953c8f2469dc`
- **Owner:** Account Address
- **Version:** 349181059
- **Purpose:** Allows upgrading the contract package

### GameCounter
- **Object ID:** `0xd3ee1d5ba7e95bc516b5e68c9cd1480de3189dfbe77bd8dafe6457b446603a08`
- **Owner:** Shared (349181059)
- **Version:** 349181059
- **Purpose:** Tracks total games created

### GamePool
- **Object ID:** `0xdd051a1e183ef3e68183c5a4ba367110003a1ecd28b7515b6b57de4a22c7750e`
- **Owner:** Shared (349181059)
- **Version:** 349181059
- **Purpose:** Holds all active games and manages the game pool

## Modules

The contract contains two modules:
1. **character** - Character NFT management
2. **game_engine** - Game logic and coin flip mechanics

## Contract Functions

### Character Module
- `create_character(name: vector<u8>, ctx: &mut TxContext): Character` - Create a new character NFT
- `get_name(character: &Character): String` - Get character name
- `transfer(character: Character, recipient: address)` - Transfer character to another user
- `update_wins(character: &mut Character)` - Update character wins
- `update_losses(character: &mut Character)` - Update character losses

### Game Engine Module
- `init(ctx: &mut TxContext)` - Initialize the module (called once on deployment)
- `create_game(bet_amount: u64, ctx: &mut TxContext): ID` - Create a new coin flip game
- `place_bet(game: &mut Game, bet_coin: Coin<SUI>, ctx: &mut TxContext)` - Place a bet on a game
- `flip_coin(game: &mut Game, ctx: &TxContext)` - Flip the coin and determine winner
- `claim_winnings(game: &mut Game, player: address, ctx: &mut TxContext): (Coin<SUI>, bool)` - Claim winnings if player won

## Gas Costs

- **Storage Cost:** 27,208,000 MIST
- **Computation Cost:** 1,000,000 MIST
- **Storage Rebate:** 978,120 MIST
- **Non-refundable Storage Fee:** 9,880 MIST
- **Total Gas Used:** ~27.2M MIST (≈ 0.027 SUI)

## Explorer Links

View your contract on:
- **Sui Scan (Mainnet):** https://suiscan.xyz/mainnet/object/0xdcfef4a6409f9e593d97df1c96b024ea2570cfb59d3eed4975dbb87b29212290
- **Sui Scan (Package):** https://suiscan.xyz/mainnet/package/0xdcfef4a6409f9e593d97df1c96b024ea2570cfb59d3eed4975dbb87b29212290

## Next Steps

### Test the Contract
```bash
# View your objects
sui client objects

# Get package details
sui client object 0xdcfef4a6409f9e593d97df1c96b024ea2570cfb59d3eed4975dbb87b29212290

# View recent transactions
sui client transactions
```

### Interact with the Contract
```bash
# Create a game
sui client call --package 0xdcfef4a6409f9e593d97df1c96b024ea2570cfb59d3eed4975dbb87b29212290 \
  --module game_engine \
  --function create_game \
  --args <bet_amount> \
  --gas-budget 100000000

# Create a character
sui client call --package 0xdcfef4a6409f9e593d97df1c96b024ea2570cfb59d3eed4975dbb87b29212290 \
  --module character \
  --function create_character \
  --args \"[<character_name_bytes>]\" \
  --gas-budget 100000000
```

### Frontend Integration
The `frontend` folder contains a React app that can interact with this contract:
1. Update `src/lib/contracts.ts` with the Package ID
2. Implement functions to call the contract methods
3. Test with your deployed contract

## Important Notes

- The contract uses testnet/mainnet Sui framework
- All coin flip results are currently using a pseudo-random approach based on sender address
- For production, consider implementing proper randomness through Sui's randomness module
- The contract has some linter warnings about unused variables and fields - these can be cleaned up but don't affect functionality

---

**Last Updated:** December 10, 2025
**Deployed By:** degen_arcade
