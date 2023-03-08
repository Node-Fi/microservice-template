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
