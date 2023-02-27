import knexConstructor, { Knex } from 'knex';
import { Wallet } from './models/Wallet';
import * as knexConfig from '../../knexfile';

// Model types go here
declare module 'knex/types/tables' {
  interface Tables {
    wallets: Knex.CompositeTableType<Wallet, Pick<Wallet, 'wid'>>;
  }
}

export class KnexController {
  private knex: Knex | null = null;
  private static instance: KnexController;

  private constructor() {
    if (KnexController.instance) {
      throw new Error('Cannot instantiate KnexController twice');
    }
  }

  public static clear() {
    this.instance = undefined;
  }

  public static getInstance(): KnexController {
    if (!this.instance) {
      this.instance = new KnexController();
    }
    return this.instance;
  }

  public static knex(): Knex {
    return KnexController.getInstance().getKnex();
  }

  init(config = knexConfig) {
    this.knex = knexConstructor(config);
    return this.knex;
  }

  public getKnex(): Knex {
    return this.knex;
  }
}
