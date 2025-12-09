import { getFullnodeUrl } from '@mysten/sui.js/client';
import { createNetworkConfig } from '@mysten/dapp-kit';
import { QueryClient } from '@tanstack/react-query';

// For development, use testnet. Change to mainnet for production
const { networkConfig } = createNetworkConfig({
  localnet: { url: getFullnodeUrl('localnet') },
  devnet: { url: getFullnodeUrl('devnet') },
  testnet: { url: getFullnodeUrl('testnet') },
  mainnet: { url: getFullnodeUrl('mainnet') },
});

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: false,
      staleTime: Infinity,
    },
  },
});

export const network = networkConfig;

// Contract addresses - Update these after deploying your contracts
export const CONTRACT_ADDRESS = '0x0'; // Replace with your deployed package ID
export const GAME_POOL_ID = '0x0'; // Replace with your GamePool object ID
export const GAME_COUNTER_ID = '0x0'; // Replace with your GameCounter object ID

