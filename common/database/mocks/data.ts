import { UnixSeconds } from '~common/utils/unixSeconds';
import { KnexController } from '../knex';
import { Token, Wallet } from '~common/database/models';

type SeedData = Partial<{
  chains: { chain_id: number }[];
  tokens: Partial<Token>[];
  wallets: Wallet[];
  tenants: { tid: string }[];
  wallet_tenant_pivot: { wallet: number; tenant: string }[];
}>;

export const nonsensicalMockData: SeedData = {
  chains: [
    { chain_id: 1 }, // Ethereum Mainnet
    { chain_id: 56 }, // Binance Smart Chain Mainnet
    { chain_id: 137 }, // Polygon Mainnet
  ],
  tokens: [
    {
      tid: 1,
      chain_id: 1,
      address: '0x6B175474E89094C44Da98b954EedeAC495271d0F', // DAI on Ethereum Mainnet
      decimals: 18,
      price: 1.0,
      tags: ['stablecoin', 'erc20'],
    },
    {
      tid: 2,
      chain_id: 56,
      address: '0xbb4CdB9CBd36B01bD1cBaEBF2De08d9173bc095c', // WBNB on Binance Smart Chain Mainnet
      decimals: 18,
      price: 300.0,
      tags: ['exchange token', 'bep20'],
    },
    {
      tid: 3,
      chain_id: 137,
      address: '0x7ceB23fD6bC0adD59E62ac25578270cFf1b9f619', // MATIC on Polygon Mainnet
      decimals: 18,
      price: 2.0,
      tags: ['utility token', 'erc20'],
    },
    {
      tid: 4,
      chain_id: 137,
      address: '0x2791Bca1f2de4661ED88A30C99A7a9449Aa84174', // USDC on Polygon Mainnet
      decimals: 6,
      price: 1.0,
      tags: ['stablecoin', 'erc20'],
    },
    {
      tid: 5,
      chain_id: 137,
      address: '0xc2132D05D31c914a87C6611C10748AEb04B58e8F', // USDT on Polygon Mainnet
      decimals: 6,
      price: 1.0,
      tags: ['stablecoin', 'erc20'],
    },
  ],
  wallets: [
    { wid: 1, address: '0x1234567890abcdef1234567890abcdef12345678' },
    { wid: 2, address: '0xabcdef1234567890abcdef1234567890abcdef12' },
    { wid: 3, address: '0x4567890abcdef1234567890abcdef1234567890' },
  ],
  tenants: [{ tid: '1' }, { tid: '2' }, { tid: '3' }],
  wallet_tenant_pivot: [
    { wallet: 1, tenant: '1' },
    { wallet: 2, tenant: '2' },
    { wallet: 3, tenant: '3' },
    { wallet: 1, tenant: '2' },
  ],
};

export const mockPortfolioData: SeedData = {
  chains: [
    { chain_id: 137 }, // Polygon Mainnet
  ],
  tokens: [
    {
      tid: 1,
      chain_id: 137,
      address: '0x7ceB23fD6bC0adD59E62ac25578270cFf1b9f619', // MATIC on Polygon Mainnet
      decimals: 18,
      price: 2.0,
      tags: ['volatile', 'erc20'],
    },
    {
      tid: 2,
      chain_id: 137,
      address: '0x2791Bca1f2de4661ED88A30C99A7a9449Aa84174', // USDC on Polygon Mainnet
      decimals: 6,
      price: 1.0,
      tags: ['stable', 'erc20'],
    },
    {
      tid: 3,
      chain_id: 137,
      address: '0xc2132D05D31c914a87C6611C10748AEb04B58e8F', // USDT on Polygon Mainnet
      decimals: 6,
      price: 1.0,
      tags: ['stable', 'erc20'],
    },
  ],
  wallets: [
    { wid: 1, address: '0x1234567890abcdef1234567890abcdef12345678' },
    { wid: 2, address: '0xabcdef1234567890abcdef1234567890abcdef12' },
    { wid: 3, address: '0x4567890abcdef1234567890abcdef1234567890' },
  ],
  tenants: [{ tid: '1' }, { tid: '2' }, { tid: '3' }],
  wallet_tenant_pivot: [
    { wallet: 1, tenant: '1' },
    { wallet: 2, tenant: '2' },
    { wallet: 3, tenant: '3' },
    { wallet: 1, tenant: '2' },
  ],
};

export async function seed(data: SeedData) {
  const knex = KnexController.knex();
  // Clear Existing Data
  await knex('balances').del();
  await knex('balances_historical').del();
  await knex('prices_historical').del();

  await knex('tokens').del();
  await knex('wallets').del();
  await knex('tenants').del();
  await knex('chains').del();

  // Add Data
  await knex('tenants').insert(data.tenants);
  await knex('chains').insert(data.chains);
  await knex('wallets').insert(data.wallets);
  await knex('tokens').insert(data.tokens);
}
