import BigNumber from 'bignumber.js';
import * as React from 'react';

interface WithdrawableProps {
  contract: any;
  payer: string;
  payee: string;
  amtPerSec: number;
  decimals: number;
}

function formatBalance(balance: number) {
  return balance.toLocaleString('en-US', { maximumFractionDigits: 4, minimumFractionDigits: 4 });
}

export const Withdrawable = ({ contract, payer, payee, amtPerSec, decimals }: WithdrawableProps) => {
  const [balanceState, setBalanceState] = React.useState<number>(0);
  const [calledBalance, setCalledBalance] = React.useState<number>();
  const [calledLastUpdate, setCalledLastUpdate] = React.useState<number>();
  const [isOwed, setIsOwed] = React.useState<boolean>(false);

  const callBalance = React.useCallback(() => {
    async function callContract() {
      try {
        const call = await contract.withdrawable(payer, payee, amtPerSec);
        setCalledBalance(Number(call.withdrawableAmount));
        setCalledLastUpdate(Number(call.lastUpdate));
        if (Number(call.owed) !== 0) {
          setIsOwed(true);
        }
      } catch (error) {
        setTimeout(() => {
          callContract();
        }, 100);
      }
    }
    callContract();
  }, [contract]);

  callBalance();
  const updateBalance = React.useCallback(() => {
    if (calledBalance === undefined || calledLastUpdate === undefined) return;
    if (isOwed) {
      setBalanceState(calledBalance / 10 ** decimals);
    } else {
      setBalanceState(calledBalance / 10 ** decimals + ((Date.now() / 1e3 - calledLastUpdate) * amtPerSec) / 1e20);
    }
  }, [calledBalance, amtPerSec, calledLastUpdate, decimals]);

  React.useEffect(() => {
    updateBalance();
    const interval = setInterval(() => {
      updateBalance();
    }, 1000);
    return () => clearInterval(interval);
  }, [updateBalance]);

  return (
    <div className="flex items-baseline space-x-1">
      <p>{formatBalance(balanceState)}</p>
      <span className="text-xs text-gray-500 dark:text-gray-400">withdrawable</span>
      {isOwed ? <p>Out of Funds</p> : ''}
    </div>
  );
};
