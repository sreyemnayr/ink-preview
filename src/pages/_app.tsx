import '@/styles/globals.css'

import '@rainbow-me/rainbowkit/styles.css';

import {
  getDefaultWallets,
  RainbowKitProvider,
} from '@rainbow-me/rainbowkit';
import { configureChains, createClient, WagmiConfig } from 'wagmi';
import { mainnet, polygon, optimism, arbitrum } from 'wagmi/chains';
import { alchemyProvider } from 'wagmi/providers/alchemy';
import { publicProvider } from 'wagmi/providers/public';
import { SiweProvider } from '@randombits/use-siwe';


import { SessionProvider } from 'next-auth/react';
import { AppProps } from 'next/app';

import {
  RainbowKitSiweNextAuthProvider,
  GetSiweMessageOptions,
} from '@rainbow-me/rainbowkit-siwe-next-auth';

import RainbowKitUseSiweProvider from '@randombits/rainbowkit-use-siwe-auth';


if (!process.env.ALCHEMY_ID) {
  throw new Error('Invalid/Missing environment variable: "ALCHEMY_ID"')
}

const { chains, provider } = configureChains(
  [mainnet, polygon, optimism, arbitrum],
  [
    alchemyProvider({ apiKey: process.env.ALCHEMY_ID || "NO_KEY" }),
    publicProvider()
  ]
);

const { connectors } = getDefaultWallets({
  appName: 'Order of Ink Preview App',
  chains
});

const wagmiClient = createClient({
  autoConnect: true,
  connectors,
  provider
})

const getSiweMessageOptions: GetSiweMessageOptions = () => ({
  statement: 'Sign in to access the Order of Ink Preview app',
});


export default function App({ Component, pageProps }: AppProps) {
  return (
    <WagmiConfig client={wagmiClient}>
      <SiweProvider>
        <RainbowKitUseSiweProvider>
          <RainbowKitProvider chains={chains}>
            <Component {...pageProps} />
          </RainbowKitProvider>
        </RainbowKitUseSiweProvider>
      </SiweProvider>
    </WagmiConfig>
  )
}
