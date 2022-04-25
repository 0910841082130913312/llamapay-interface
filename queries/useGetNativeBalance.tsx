import { useLocale } from 'hooks';
import { useBalance, useNetwork } from 'wagmi';

export function useGetNativeBalance(id: string) {
  const { data, error, isLoading } = useBalance({
    addressOrName: id.toLowerCase(),
  });

  const { data: network } = useNetwork();

  const nativeCoin = network?.nativeCurrency?.symbol;

  const { locale } = useLocale();

  if (error) return <p>Failed to Get Balance</p>;
  if (isLoading) return <p>Loading Balance</p>;

  return <p>{`${(Number(data?.value) / 1e18).toLocaleString(locale, { maximumFractionDigits: 5 })} ${nativeCoin}`}</p>;
}
