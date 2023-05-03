import { getProvider } from '~common/utils/getProvider';
import { getTokenContract } from '@node-fi/multicall';

export const getBalance = async (
  chainId: number,
  token: string,
  address: string,
) => {
  const provider = getProvider(chainId);
  const contract = getTokenContract(token, provider);
  const balance = await contract.balanceOf(address);
  return balance;
};
