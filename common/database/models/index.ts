export interface Token {
  tid: number;
  type: string;
  chain_id: number;
  address: string;
  name: string;
  symbol: string;
  decimals: number;
  price: number;
  logo_uri: string;
  extensions: Record<string, unknown>;
  tags: string[];
}

export interface Wallet {
  wid: number;
  address: string;
}

export interface WalletTenantPivot {
  wallet: number;
  tenant: number;
}

export interface Tenant {
  tid: number;
}
