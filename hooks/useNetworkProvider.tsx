import { ethers } from 'ethers';
import { useRouter } from 'next/router';
import { networkDetails } from 'utils/constants';
import { useNetwork } from 'wagmi';

export type Provider = ethers.providers.BaseProvider;

export const useNetworkProvider = () => {
  const { data, activeChain } = useNetwork();

  const { pathname, query } = useRouter();

  let chainId = data?.id ?? null;

  let name: string | null = data?.name ?? null;

  if (pathname === '/streams' && !Number.isNaN(query.chainId)) {
    chainId = Number(query.chainId);
    name = networkDetails[chainId]?.blockExplorerName;
  }

  const chainDetails = chainId && networkDetails[chainId];

  return {
    provider: chainDetails ? chainDetails.chainProviders : null,
    network: name,
    chainId,
    nativeCurrency: data?.nativeCurrency,
    unsupported: activeChain?.unsupported,
  };
};
