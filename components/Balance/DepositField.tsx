import * as React from 'react';
import BigNumber from 'bignumber.js';
import { InputWithTokenSelect, SubmitButton } from 'components/Form';
import { useApproveToken, useCheckTokenApproval } from 'queries/useTokenApproval';
import useDepositToken from 'queries/useDepositToken';
import { IToken } from 'types';
import { checkApproval } from 'components/Form/utils';
import { useAccount } from 'wagmi';
import { BeatLoader } from 'react-spinners';
import { DisclosureState } from 'ariakit';
import { FormDialog } from 'components/Dialog';

interface IDepositFieldprops {
  tokens: IToken[];
  dialog: DisclosureState;
  transactionDialog: DisclosureState;
}

const DepositField = ({ tokens, dialog, transactionDialog }: IDepositFieldprops) => {
  const { mutate: deposit, isLoading } = useDepositToken();
  const [{ data: accountData }] = useAccount();

  const [tokenAddress, setTokenAddress] = React.useState(tokens[0]?.tokenAddress ?? '');

  // Token approval hooks
  const { mutate: checkTokenApproval, data: isApproved, isLoading: checkingApproval } = useCheckTokenApproval();

  const { mutate: approveToken, isLoading: approvingToken, error: approvalError } = useApproveToken();

  const handleSubmit = (e: React.ChangeEvent<HTMLFormElement>) => {
    e.preventDefault();
    // read amountToDeposit from form element
    // make sure it matches the name prop on that element
    const form = e.target as typeof e.target & { amountToDeposit: { value: string } };
    const amountToDeposit = form.amountToDeposit?.value;

    // make sure we are setting tokenAddress in the setTokenAddress and not name or symbol
    const tokenDetails = tokens?.find((t) => t.tokenAddress === tokenAddress);

    if (tokenDetails && amountToDeposit) {
      // format amount to bignumber
      const bigAmount = new BigNumber(amountToDeposit).multipliedBy(10 ** tokenDetails?.decimals);

      // call deposit method only if token is approved to spend
      if (isApproved && tokenDetails.llamaContractAddress) {
        deposit(
          {
            amountToDeposit: bigAmount.toFixed(0),
            llamaContractAddress: tokenDetails.llamaContractAddress,
          },
          {
            onSettled: () => {
              dialog.toggle();
            },
          }
        );
      } else {
        approveToken(
          {
            tokenAddress: tokenAddress,
            amountToApprove: bigAmount.toFixed(0),
            spenderAddress: tokenDetails.llamaContractAddress,
          },
          {
            onSettled: () => {
              checkApproval({
                tokenDetails,
                userAddress: accountData?.address,
                approvedForAmount: amountToDeposit,
                checkTokenApproval,
              });
            },
          }
        );
      }
    }
  };

  const disableApprove = checkingApproval || approvingToken;

  return (
    <FormDialog title="Deposit" dialog={dialog} className="h-fit">
      <form onSubmit={handleSubmit}>
        <InputWithTokenSelect
          name="amountToDeposit"
          label="Amount"
          tokenAddress={tokenAddress}
          setTokenAddress={setTokenAddress}
          checkTokenApproval={checkTokenApproval}
          isRequired
        />
        {isApproved ? (
          <SubmitButton disabled={isLoading} className="mt-4 rounded !bg-zinc-300 py-2 px-3 dark:!bg-stone-600">
            {isLoading ? <BeatLoader size={6} color="#171717" /> : 'Deposit'}
          </SubmitButton>
        ) : (
          <SubmitButton disabled={disableApprove} className="mt-4 rounded !bg-zinc-300 py-2 px-3 dark:!bg-stone-600">
            {disableApprove ? <BeatLoader size={6} color="#171717" /> : 'Approve'}
          </SubmitButton>
        )}
      </form>
      <p className="my-4 text-center text-sm text-red-500">{approvalError && "Couldn't approve token"}</p>
    </FormDialog>
  );
};

export default DepositField;
