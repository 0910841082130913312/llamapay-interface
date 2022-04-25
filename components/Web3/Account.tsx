import { useAccount } from 'wagmi';
import { formatAddress } from 'utils/address';

interface Props {
  showAccountInfo: () => void;
}

export const Account = ({ showAccountInfo }: Props) => {
  const { data } = useAccount();

  if (!data) return null;

  const formattedAddress = data.address && formatAddress(data.address);

  return (
    <button className="nav-button bg-[#23BD8F] text-white" onClick={showAccountInfo}>
      {formattedAddress}
    </button>
  );
};
