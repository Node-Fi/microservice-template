export enum PubSubTopic {
  NewTenant = 'new-tenant',
  SubscriptionFailed = 'subscription-failed',
  NewWallet = 'new-wallet',
  BalanceUpdate = 'balance-update',
  Transfer = 'transfer',
  TokenTransferNoSchema = 'token-transfers-no-schema',
}

export const subscribersDeploymentConfig: {
  [key in PubSubTopic]: {
    exclude?: boolean;
  };
} = {
  [PubSubTopic.NewTenant]: {
    exclude: true,
  },
  [PubSubTopic.SubscriptionFailed]: {
    exclude: true,
  },
  [PubSubTopic.NewWallet]: {
    exclude: true,
  },
  [PubSubTopic.BalanceUpdate]: {
    exclude: true,
  },
  [PubSubTopic.Transfer]: {
    exclude: true,
  },
  [PubSubTopic.TokenTransferNoSchema]: {
    exclude: true,
  },
};
