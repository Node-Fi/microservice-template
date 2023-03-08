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
