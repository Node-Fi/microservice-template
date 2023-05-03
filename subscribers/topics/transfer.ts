export type TransferType = "RECEIVED" | "SENT" | "SWAP_TRANSACTION";
export type Wallet = {
  address: string;
  wid: number;
  tenant: number;
};

export type TransferRaw = {
  from: string;
  to: string;
  value: string;
  blockNumber: number;
  transactionHash: string;
  token: string;
  amount: {
    token: {
      tid: number;
      symbol: string;
      address: string;
      decimals: number;
      price: number;
      chain: number;
    };
    raw: string;
  };
  contract: string;
};

export type Erc20TransferInfo = {
  tokenId: number;
  from: string;
  to: string;
  tokenAddress: string;
  amount: string;
  amountRaw: string;
};

export type SwapTransferInfo = {
  inputTokenId: number;
  outputTokenId: number;
  inputTokenAddress: string;
  outputTokenAddress: string;
  inputAmount: string;
  outputAmount: string;
  inputValueInUSD: string;
  outputValueInUSD: string;
  inputAmountRaw: string;
  outputAmountRaw: string;
};

export type InformedTransfer = {
  chainId: number;
  wallet: Wallet;
  valueUsd: number;
  raw?: TransferRaw;
} & (
  | {
      type: "RECEIVED" | "SENT";
      raw: TransferRaw;
      info: Erc20TransferInfo;
    }
  | {
      type: "SWAP_TRANSACTION";
      info: SwapTransferInfo;
    }
);
