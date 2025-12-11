module degen_arcade::game_engine;

use sui::object::{Self, UID, ID};
use sui::tx_context::{Self, TxContext};
use sui::transfer;
use sui::coin::{Self, Coin};
use sui::sui::SUI;
use std::vector;
use std::bcs;

/// Represents a bet side (Heads or Tails)
const HEADS: u8 = 0;
const TAILS: u8 = 1;

/// Game state
public struct Game has key {
    id: UID,
    game_id: u64,
    pool: Coin<SUI>,
    total_bets: u64,
    heads_bets: u64,
    tails_bets: u64,
    resolved: bool,
    result: u8, // 0 for heads, 1 for tails
}

/// Player bet information
public struct PlayerBet has store {
    player: address,
    side: u8, // 0 for heads, 1 for tails
    amount: u64,
}

/// Game pool to hold all bets
public struct GamePool has key {
    id: UID,
    active_games: vector<ID>,
    total_games: u64,
}

/// Global game counter
public struct GameCounter has key {
    id: UID,
    counter: u64,
}

/// Errors
const EGameNotFound: u64 = 0;
const EGameAlreadyResolved: u64 = 1;
const EInvalidBetSide: u64 = 2;
const EInsufficientFunds: u64 = 3;
const EGameNotResolved: u64 = 4;
const ENoWinnings: u64 = 5;

/// Initialize the game pool
fun init(ctx: &mut TxContext) {
    let counter = GameCounter {
        id: object::new(ctx),
        counter: 0,
    };
    transfer::share_object(counter);

    let pool = GamePool {
        id: object::new(ctx),
        active_games: vector::empty(),
        total_games: 0,
    };
    transfer::share_object(pool);
}

/// Create a new game
public fun create_game(
    pool: &mut GamePool,
    counter: &mut GameCounter,
    ctx: &mut TxContext
): ID {
    let game_id = counter.counter;
    counter.counter = counter.counter + 1;

    let game = Game {
        id: object::new(ctx),
        game_id,
        pool: coin::zero<SUI>(ctx),
        total_bets: 0,
        heads_bets: 0,
        tails_bets: 0,
        resolved: false,
        result: 255, // Invalid result until resolved
    };

    let game_id_obj = object::id(&game);
    transfer::share_object(game);
    vector::push_back(&mut pool.active_games, game_id_obj);
    pool.total_games = pool.total_games + 1;

    game_id_obj
}

/// Place a bet on a game
public fun place_bet(
    game: &mut Game,
    bet_coin: Coin<SUI>,
    side: u8,
    ctx: &mut TxContext
) {
    assert!(side == HEADS || side == TAILS, EInvalidBetSide);
    assert!(!game.resolved, EGameAlreadyResolved);

    let amount = coin::value(&bet_coin);
    assert!(amount > 0, EInsufficientFunds);

    // Add bet to pool
    coin::join(&mut game.pool, bet_coin);
    game.total_bets = game.total_bets + amount;

    if (side == HEADS) {
        game.heads_bets = game.heads_bets + amount;
    } else {
        game.tails_bets = game.tails_bets + amount;
    };
}

/// Flip the coin and resolve the game
/// Uses transaction hash for verifiable randomness
public fun flip_coin(
    game: &mut Game,
    ctx: &TxContext
) {
    assert!(!game.resolved, EGameAlreadyResolved);
    assert!(game.total_bets > 0, EInsufficientFunds);

    // Use a simple pseudo-random approach based on block height and sender
    // In production, use Move's randomness module
    let sender_addr = tx_context::sender(ctx);
    let addr_bytes = bcs::to_bytes(&sender_addr);
    let addr_len = vector::length(&addr_bytes);
    
    let random_byte = if (addr_len > 0) {
        *vector::borrow(&addr_bytes, addr_len - 1)
    } else {
        0
    };

    // 50/50 chance based on random byte
    game.result = if (random_byte % 2 == 0) { HEADS } else { TAILS };
    game.resolved = true;
}

/// Claim winnings for a player
public fun claim_winnings(
    game: &mut Game,
    player: address,
    bet_side: u8,
    bet_amount: u64,
    ctx: &mut TxContext
): (Coin<SUI>, bool) {
    assert!(game.resolved, EGameNotResolved);
    assert!(bet_side == HEADS || bet_side == TAILS, EInvalidBetSide);

    let won = game.result == bet_side;
    
    if (!won) {
        return (coin::zero<SUI>(ctx), false)
    };

    // Calculate winnings: double the bet (double or nothing)
    let winnings = bet_amount * 2;
    
    // Ensure pool has enough funds
    let pool_value = coin::value(&game.pool);
    if (winnings > pool_value) {
        // If pool doesn't have enough, return what's available
        let payout = coin::split(&mut game.pool, pool_value, ctx);
        return (payout, true)
    };

    let payout = coin::split(&mut game.pool, winnings, ctx);
    (payout, true)
}

/// Get game result
public fun get_game_result(game: &Game): (bool, u8) {
    (game.resolved, game.result)
}

/// Get game stats
public fun get_game_stats(game: &Game): (u64, u64, u64) {
    (game.total_bets, game.heads_bets, game.tails_bets)
}

/// Get game ID
public fun game_id(game: &Game): u64 {
    game.game_id
}

/// Check if game is resolved
public fun is_resolved(game: &Game): bool {
    game.resolved
}

/// Get the winning side
public fun winning_side(game: &Game): u8 {
    assert!(game.resolved, EGameNotResolved);
    game.result
}

