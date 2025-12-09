interface GameResultProps {
  result: number;
  won: boolean;
  betAmount: string;
}

export function GameResult({ result, won, betAmount }: GameResultProps) {
  const HEADS = 0;
  const TAILS = 1;

  const resultText = result === HEADS ? 'Heads' : 'Tails';
  const winnings = won ? (parseFloat(betAmount) * 2).toFixed(2) : '0';

  return (
    <div className={`mt-6 p-6 rounded-xl ${
      won ? 'bg-green-500/20 border-2 border-green-500' : 'bg-red-500/20 border-2 border-red-500'
    }`}>
      <div className="text-center">
        <div className="text-6xl mb-4">
          {result === HEADS ? '🪙' : '🪙'}
        </div>
        <h2 className="text-3xl font-bold text-white mb-2">
          {resultText}!
        </h2>
        <p className={`text-2xl font-semibold mb-2 ${
          won ? 'text-green-300' : 'text-red-300'
        }`}>
          {won ? '🎉 You Won!' : '😔 You Lost'}
        </p>
        {won && (
          <p className="text-xl text-white">
            You won {winnings} SUI (2x your bet!)
          </p>
        )}
        {!won && (
          <p className="text-lg text-white/80">
            Better luck next time!
          </p>
        )}
      </div>
    </div>
  );
}

