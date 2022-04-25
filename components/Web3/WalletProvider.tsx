import * as React from 'react';
import { Provider, createClient } from 'wagmi';
import { providers } from 'ethers';
import { InjectedConnector } from 'wagmi/connectors/injected';
import { WalletConnectConnector } from 'wagmi/connectors/walletConnect';
import { CoinbaseWalletConnector } from 'wagmi/connectors/coinbaseWallet';
import { alchemyId, chains, networkDetails } from 'utils/constants';

interface IProvider {
  children?: React.ReactNode;
}

const client = createClient({
  autoConnect: true,
  provider(config) {
    const network = config.chainId ? networkDetails[config.chainId] : false;
    return network ? network.chainProviders : new providers.AlchemyProvider(config.chainId, alchemyId);
  },
  connectors(config) {
    return [
      new InjectedConnector({
        chains: chains,
      }),
      new WalletConnectConnector({
        options: {
          qrcode: true,
        },
        chains: chains,
      }),
      new CoinbaseWalletConnector({
        options: {
          appName: 'LlamaPay',
          chainId: config.chainId,
        },
        chains: chains,
      }),
    ];
  },
});

export const WalletProvider = ({ children }: IProvider) => {
  return <Provider client={client}>{children}</Provider>;
};
