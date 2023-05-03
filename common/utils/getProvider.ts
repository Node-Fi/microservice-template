import { StaticJsonRpcProvider } from '@ethersproject/providers';
import { chainIdToNetwork } from '@node-fi/chain-config';

export const getProvider = (chainId: number) => {
  const rpc = chainIdToNetwork(chainId);
  if (!rpc) throw new Error('Invalid chainId');
  const provider = new StaticJsonRpcProvider(rpc.rpcUrl);
  return provider;
};
