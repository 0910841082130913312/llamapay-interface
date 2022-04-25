import * as React from 'react';
import { verifyMessage } from 'ethers/lib/utils';
import { useSignMessage } from 'wagmi';

export const SignMessage = () => {
  const previousMessage = React.useRef<string>();
  const [message, setMessage] = React.useState('');
  const { data, isError, isLoading, signMessage } = useSignMessage();

  const recoveredAddress = React.useMemo(() => {
    if (!data || !previousMessage.current) return undefined;
    return verifyMessage(previousMessage.current, data);
  }, [data, previousMessage]);

  return (
    <form
      onSubmit={(event) => {
        event.preventDefault();
        previousMessage.current = message;
        signMessage({ message });
      }}
      className="mx-4 flex w-full max-w-lg flex-col space-y-4 border p-2"
    >
      <label htmlFor="message">Enter a message to sign</label>
      <textarea id="message" placeholder="The quick brown fox…" onChange={(event) => setMessage(event.target.value)} />
      <button disabled={isLoading || !message.length} className="border p-2">
        {isLoading ? 'Check Wallet' : 'Sign Message'}
      </button>

      {data && (
        <div className="space-y-2">
          <div>Recovered Address: {recoveredAddress}</div>
          <div className="break-all">Signature: {data}</div>
        </div>
      )}
      {isError && <div>Error signing message</div>}
    </form>
  );
};
