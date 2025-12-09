import { useState } from 'react';
import { useCurrentAccount } from '@mysten/dapp-kit';
import { useSignAndExecuteTransactionBlock } from '@mysten/dapp-kit';
import { playGameTx, HEADS, TAILS } from '../lib/contracts';
import { GameResult } from './GameResult';

export function CoinFlip() {
  const account = useCurrentAccount();
  const { mutate: signAndExecute } = useSignAndExecuteTransactionBlock();
  const [selectedSide, setSelectedSide] = useState<number | null>(null);
  const [betAmount, setBetAmount] = useState<string>('0.1');
  const [isFlipping, setIsFlipping] = useState(false);
  const [gameResult, setGameResult] = useState<{
    result: number;
    won: boolean;
    amount: string;
  } | null>(null);

  const handleFlip = async () => {
    if (!account || selectedSide === null) return;

    setIsFlipping(true);
    setGameResult(null);

    try {
      const amount = BigInt(Math.floor(parseFloat(betAmount) * 1e9)); // Convert to MIST
      const tx = playGameTx(null, selectedSide, amount);

      await signAndExecute(
        {
          transactionBlock: tx,
          options: {
            showEffects: true,
            showEvents: true,
          },
        },
        {
          onSuccess: (result) => {
            // In a real implementation, you would query the game result from the chain
            // For now, we'll simulate it
            console.log('Transaction successful:', result);
            
            // Simulate result (replace with actual on-chain query)
            const randomResult = Math.random() < 0.5 ? HEADS : TAILS;
            const won = randomResult === selectedSide;
            
            setGameResult({
              result: randomResult,
              won,
              amount: betAmount,
            });
            setIsFlipping(false);
          },
          onError: (error) => {
            console.error('Transaction failed:', error);
            setIsFlipping(false);
          },
        }
      );
    } catch (error) {
      console.error('Error:', error);
      setIsFlipping(false);
    }
  };

  if (!account) {
    return (
      <div className="text-center text-white">
        <p className="text-xl mb-4">Please connect your wallet to play</p>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto">
      <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 shadow-2xl">
        <h1 className="text-4xl font-bold text-white text-center mb-8">
          🎰 DegenArcade - Double or Nothing
        </h1>

        <div className="mb-6">
          <label className="block text-white font-semibold mb-2">
            Bet Amount (SUI)
          </label>
          <input
            type="number"
            min="0.1"
            step="0.1"
            value={betAmount}
            onChange={(e) => setBetAmount(e.target.value)}
            className="w-full px-4 py-3 rounded-lg bg-white/20 text-white placeholder-white/50 border border-white/30 focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="0.1"
          />
        </div>

        <div className="mb-8">
          <label className="block text-white font-semibold mb-4 text-center">
            Choose Your Side
          </label>
          <div className="flex gap-4 justify-center">
            <button
              onClick={() => setSelectedSide(HEADS)}
              disabled={isFlipping}
              className={`px-8 py-6 rounded-xl font-bold text-2xl transition-all ${
                selectedSide === HEADS
                  ? 'bg-yellow-500 text-black scale-110'
                  : 'bg-white/20 text-white hover:bg-white/30'
              } ${isFlipping ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
              🪙 Heads
            </button>
            <button
              onClick={() => setSelectedSide(TAILS)}
              disabled={isFlipping}
              className={`px-8 py-6 rounded-xl font-bold text-2xl transition-all ${
                selectedSide === TAILS
                  ? 'bg-yellow-500 text-black scale-110'
                  : 'bg-white/20 text-white hover:bg-white/30'
              } ${isFlipping ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
              🪙 Tails
            </button>
          </div>
        </div>

        <button
          onClick={handleFlip}
          disabled={selectedSide === null || isFlipping || parseFloat(betAmount) <= 0}
          className="w-full py-4 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-bold text-xl rounded-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed transform hover:scale-105"
        >
          {isFlipping ? '🔄 Flipping...' : '🎲 Flip Coin'}
        </button>

        {gameResult && (
          <GameResult
            result={gameResult.result}
            won={gameResult.won}
            betAmount={gameResult.amount}
          />
        )}
      </div>
    </div>
  );
}

