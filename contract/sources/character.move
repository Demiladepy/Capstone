module degen_arcade::character;

use sui::object::{Self, UID};
use sui::tx_context::{Self, TxContext};
use sui::transfer;
use std::string::{Self, String};

/// Character NFT representing a player
public struct Character has key, store {
    id: UID,
    player: address,
    name: String,
    wins: u64,
    losses: u64,
    total_wagered: u64,
}

/// Create a new character for a player
public fun create_character(
    name: vector<u8>,
    ctx: &mut TxContext
): Character {
    let character = Character {
        id: object::new(ctx),
        player: tx_context::sender(ctx),
        name: string::utf8(name),
        wins: 0,
        losses: 0,
        total_wagered: 0,
    };

    character
}

/// Update character stats after a game
public fun update_stats(
    character: &mut Character,
    won: bool,
    amount: u64,
) {
    if (won) {
        character.wins = character.wins + 1;
    } else {
        character.losses = character.losses + 1;
    };
    character.total_wagered = character.total_wagered + amount;
}

/// Get player address from character
public fun player(character: &Character): address {
    character.player
}

/// Get character stats
public fun get_stats(character: &Character): (u64, u64, u64) {
    (character.wins, character.losses, character.total_wagered)
}

/// Get character name
public fun get_name(character: &Character): String {
    character.name
}

/// Transfer character to another address
public fun transfer(character: Character, recipient: address) {
    transfer::public_transfer(character, recipient);
}

