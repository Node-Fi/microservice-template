import { Handler } from '~subscribers/handlers';
import { KnexController } from '~common/database/knex';
import { NewWallet } from '~subscribers/topics/new_wallet';
import { beginTrackingWallet } from './trackWallet';
import { PubSubTopic } from '~subscribers/topics';

export class NewWalletHandler extends Handler<NewWallet, void> {
  constructor() {
    super(PubSubTopic.NewWallet);
  }

  async process(data: NewWallet) {
    const knex = KnexController.knex();
    const walletAlreadyExsits = await beginTrackingWallet(data, knex);

    if (walletAlreadyExsits) return;
  }
}
