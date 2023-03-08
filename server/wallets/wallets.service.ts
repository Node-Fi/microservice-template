import { BadRequestException, Injectable } from '@nestjs/common';
import { Knex } from 'knex';
import { KnexController } from '../../common/database/knex';
import { QueryWalletDto } from './dto/QueryWalletDto';

@Injectable()
export class WalletsService {
  private knex: Knex;
  constructor() {
    this.knex = KnexController.knex();
  }

  getWallet(query: Partial<QueryWalletDto>) {
    if (query.address) {
      return this.knex('wallets')
        .select('*')
        .where({ address: query.address })
        .first();
    } else if (query.wid) {
      return this.knex('wallets').select('*').where({ wid: query.wid }).first();
    }

    throw new BadRequestException(
      'Invalid query parameters, expected address or wid',
    );
  }
}
