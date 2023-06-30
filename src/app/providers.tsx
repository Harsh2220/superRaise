"use client";

import Navbar from "@/components/Navbar";
import { APP_NAME } from "@/constants";
import lensClient from "@/lib/client";
import { ApolloProvider } from "@apollo/client";
import {
  connectorsForWallets,
  getDefaultWallets,
  RainbowKitProvider,
} from "@rainbow-me/rainbowkit";
import * as React from "react";
import { configureChains, createConfig, WagmiConfig } from "wagmi";
import { goerli, polygonMumbai } from "wagmi/chains";
import { publicProvider } from "wagmi/providers/public";

const { chains, publicClient, webSocketPublicClient } = configureChains(
  [
    polygonMumbai,
    ...(process.env.NEXT_PUBLIC_ENABLE_TESTNETS === "true" ? [goerli] : []),
  ],
  [publicProvider()]
);

const projectId = "6097f40a8f4f91e37e66cf3a5ca1fba2";

const { wallets } = getDefaultWallets({
  appName: APP_NAME,
  projectId,
  chains,
});

const demoAppInfo = {
  appName: APP_NAME,
};

const connectors = connectorsForWallets([...wallets]);

const wagmiConfig = createConfig({
  autoConnect: true,
  connectors,
  publicClient,
  webSocketPublicClient,
});

export function Providers({ children }: { children: React.ReactNode }) {
  const [mounted, setMounted] = React.useState(false);
  React.useEffect(() => setMounted(true), []);
  return (
    <WagmiConfig config={wagmiConfig}>
      <RainbowKitProvider chains={chains} appInfo={demoAppInfo}>
        <ApolloProvider client={lensClient}>
          <Navbar />
          {mounted && children}
        </ApolloProvider>
      </RainbowKitProvider>
    </WagmiConfig>
  );
}
