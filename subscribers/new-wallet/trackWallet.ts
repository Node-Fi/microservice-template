import { Knex } from 'knex';
import { KnexController } from '~common/database/knex';
import { NewWallet } from '~subscribers/topics/new_wallet';

export async function beginTrackingWallet(wallet: NewWallet, dbPool?: Knex) {
  if (!dbPool) {
    dbPool = KnexController.knex();
  }

  let walletAlreadyExists = false;

  // Add wallet to wallets table, use try/catch to avoid duplicate key errors
  try {
    await dbPool('wallets').insert({
      address: wallet.address,
      wid: wallet.wid,
    });
  } catch (e) {
    // If duplicate key error, allow.  Otherwise, throw.
    if (!e.message.includes('duplicate key value violates unique constraint')) {
      throw e;
    }

    // If the wallet already exists then we only want to add it to the pivot table
    walletAlreadyExists = true;
  }

  // Add wallet - tenant to wallet - tenant pivot table
  await dbPool('wallet_tenant_pivot').insert({
    wallet: wallet.wid,
    tenant: wallet.tenant,
  });

  return walletAlreadyExists;
}
