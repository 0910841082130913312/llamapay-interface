import * as React from 'react';
import BigNumber from 'bignumber.js';
import useWithdrawByPayer from 'queries/useWithdrawTokenByPayer';
import { IFormData, IFormElements } from './types';
import { InputAmount, SubmitButton } from 'components/Form';
import { BeatLoader } from 'react-spinners';
import { DisclosureState } from 'ariakit';

const WithdrawForm = ({ data, dialog }: { data: IFormData; dialog: DisclosureState }) => {
  const { mutate, isLoading } = useWithdrawByPayer();

  const withdrawAll = React.useRef(false);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const form = e.target as typeof e.target & IFormElements;
    const amount = form.amount.value;

    if (amount) {
      const formattedAmt = new BigNumber(amount).multipliedBy(1e20);
      withdrawAll.current = false;
      mutate({
        amountToWithdraw: formattedAmt.toFixed(0),
        llamaContractAddress: data.llamaContractAddress,
        withdrawAll: false,
      });
    }
  };

  const withdrawAllTokens = () => {
    withdrawAll.current = true;
    mutate(
      {
        llamaContractAddress: data.llamaContractAddress,
        withdrawAll: true,
      },
      {
        onSettled: () => {
          dialog.toggle();
        },
      }
    );
  };

  return (
    <>
      <form className="mt-4 flex flex-col space-y-4" onSubmit={handleSubmit}>
        <InputAmount name="amount" label={`Amount ${data.symbol}`} isRequired />
        <SubmitButton disabled={isLoading} className="my-4 rounded !bg-zinc-300 py-2 px-3 dark:!bg-stone-600">
          {isLoading && !withdrawAll.current ? <BeatLoader size={6} color="#171717" /> : 'Withdraw'}
        </SubmitButton>
      </form>
      <p className="my-3 text-center font-light">or</p>
      <SubmitButton
        disabled={isLoading}
        onClick={withdrawAllTokens}
        className="my-4 rounded !bg-zinc-300 py-2 px-3 dark:!bg-stone-600"
      >
        {isLoading && withdrawAll.current ? <BeatLoader size={6} color="#171717" /> : 'Withdraw All'}
      </SubmitButton>
    </>
  );
};

export default WithdrawForm;
