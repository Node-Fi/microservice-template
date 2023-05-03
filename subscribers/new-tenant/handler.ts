import { KnexController } from '~common/database/knex';
import { Handler } from '~subscribers/handlers';
import { PubSubTopic } from '~subscribers/topics';
import { NewTenant } from '~subscribers/topics/newTenant';

export class HandlerNewTenant extends Handler<NewTenant> {
  constructor() {
    super(PubSubTopic.NewTenant);
  }

  async process(data: NewTenant) {
    const knex = KnexController.knex();

    await knex('tenants').insert(data);
  }
}
