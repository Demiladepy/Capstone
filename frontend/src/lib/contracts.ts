import { TransactionBlock } from '@mysten/sui.js/transactions';
import { SUI_TYPE_ARG } from '@mysten/sui.js/utils';
import { CONTRACT_ADDRESS, GAME_POOL_ID, GAME_COUNTER_ID } from './sui';

export const HEADS = 0;
export const TAILS = 1;

/**
 * Create a new game
 */
export function createGameTx(): TransactionBlock {
  const tx = new TransactionBlock();
  
  tx.moveCall({
    target: `${CONTRACT_ADDRESS}::game_engine::create_game`,
    arguments: [
      tx.object(GAME_POOL_ID),
      tx.object(GAME_COUNTER_ID),
    ],
  });

  return tx;
}

/**
 * Place a bet on a game
 */
export function placeBetTx(
  gameId: string,
  side: number, // 0 for heads, 1 for tails
  amount: bigint
): TransactionBlock {
  const tx = new TransactionBlock();
  
  // Split the bet amount from the sender's SUI
  const [coin] = tx.splitCoins(tx.gas, [amount]);
  
  tx.moveCall({
    target: `${CONTRACT_ADDRESS}::game_engine::place_bet`,
    arguments: [
      tx.object(gameId),
      coin,
      tx.pure.u8(side),
    ],
  });

  return tx;
}

/**
 * Flip the coin and resolve the game
 */
export function flipCoinTx(gameId: string): TransactionBlock {
  const tx = new TransactionBlock();
  
  tx.moveCall({
    target: `${CONTRACT_ADDRESS}::game_engine::flip_coin`,
    arguments: [tx.object(gameId)],
  });

  return tx;
}

/**
 * Claim winnings from a resolved game
 */
export function claimWinningsTx(
  gameId: string,
  side: number,
  amount: bigint,
  sender: string
): TransactionBlock {
  const tx = new TransactionBlock();
  
  const [payout] = tx.moveCall({
    target: `${CONTRACT_ADDRESS}::game_engine::claim_winnings`,
    arguments: [
      tx.object(gameId),
      tx.pure.address(sender),
      tx.pure.u8(side),
      tx.pure.u64(amount),
    ],
    typeArguments: [SUI_TYPE_ARG],
  });

  // Transfer the payout to the sender
  tx.transferObjects([payout], sender);

  return tx;
}

/**
 * Complete game flow: Create game, place bet, flip coin, and claim winnings
 * This uses Programmable Transaction Blocks (PTB) to compose multiple operations
 */
export function playGameTx(
  gameId: string | null,
  side: number,
  amount: bigint
): TransactionBlock {
  const tx = new TransactionBlock();
  
  let gameObj;
  
  if (!gameId) {
    // Create a new game if one doesn't exist
    const [newGame] = tx.moveCall({
      target: `${CONTRACT_ADDRESS}::game_engine::create_game`,
      arguments: [
        tx.object(GAME_POOL_ID),
        tx.object(GAME_COUNTER_ID),
      ],
    });
    gameObj = newGame;
  } else {
    gameObj = tx.object(gameId);
  }
  
  // Split the bet amount
  const [coin] = tx.splitCoins(tx.gas, [amount]);
  
  // Place the bet
  tx.moveCall({
    target: `${CONTRACT_ADDRESS}::game_engine::place_bet`,
    arguments: [
      gameObj,
      coin,
      tx.pure.u8(side),
    ],
  });
  
  // Flip the coin
  tx.moveCall({
    target: `${CONTRACT_ADDRESS}::game_engine::flip_coin`,
    arguments: [gameObj],
  });
  
  // Note: Claiming winnings would need to be done in a separate transaction
  // after checking the result, as we need to know if the player won first
  
  return tx;
}

