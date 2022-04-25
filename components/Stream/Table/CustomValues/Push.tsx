import llamaContract from 'abis/llamaContract';
import * as React from 'react';
import toast from 'react-hot-toast';
import { useQueryClient } from 'react-query';
import { IStream } from 'types';
import { useContractWrite } from 'wagmi';

interface PushProps {
  buttonName: string;
  data: IStream;
}

export const Push = ({ data, buttonName }: PushProps) => {
  const { writeAsync: withdraw } = useContractWrite(
    {
      addressOrName: data.llamaContractAddress,
      contractInterface: llamaContract,
    },
    'withdraw',
    {
      args: [data.payerAddress, data.payeeAddress, data.amountPerSec],
    }
  );

  const queryClient = useQueryClient();

  const handleClick = () => {
    withdraw().then((data) => {
      // const loadingToast = data.error
      //   ? toast.error(data.error?.message)
      //   : toast.loading(buttonName === 'Withdraw' ? 'Withdrawing Payment' : 'Sending Payment');
      // data.data?.wait().then((receipt) => {
      //   toast.dismiss(loadingToast);
      //   receipt.status === 1
      //     ? toast.success(buttonName === 'Withdraw' ? 'Successfully Withdrawn Payment' : 'Successfully Sent Payment')
      //     : toast.error(buttonName === 'Withdraw' ? 'Failed to Withdraw Payment' : 'Failed to Send Payment');

      console.log(data);

      queryClient.invalidateQueries();
    });
  };

  return (
    <>
      <button onClick={handleClick} className="row-action-links">
        {buttonName}
      </button>
    </>
  );
};
