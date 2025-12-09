import { SuiClientProvider, WalletProvider } from '@mysten/dapp-kit';
import { QueryClientProvider } from '@tanstack/react-query';
import { network, queryClient } from './lib/sui';
import { WalletButton } from './components/WalletButton';
import { CoinFlip } from './components/CoinFlip';

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <SuiClientProvider networks={network} defaultNetwork="testnet">
        <WalletProvider autoConnect>
          <div className="min-h-screen p-8">
            <div className="max-w-6xl mx-auto">
              <header className="mb-8 flex justify-between items-center">
                <h1 className="text-5xl font-bold text-white">
                  🎮 DegenArcade
                </h1>
                <WalletButton />
              </header>

              <main>
                <CoinFlip />
              </main>

              <footer className="mt-12 text-center text-white/70">
                <p>Built for Sui Hackathon - Double or Nothing Coin Flip</p>
              </footer>
            </div>
          </div>
        </WalletProvider>
      </SuiClientProvider>
    </QueryClientProvider>
  );
}

export default App;

