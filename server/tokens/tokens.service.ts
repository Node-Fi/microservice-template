import { getAddress } from '@ethersproject/address';
import {
  BadRequestException,
  CACHE_MANAGER,
  Inject,
  Injectable,
} from '@nestjs/common';
import { Cache } from 'cache-manager';
import { TokenFilter } from './dto/tokenFilter.dto';
import { Token } from '~common/database/models/Token';
import { Knex } from 'knex';
import { KnexController } from '~common/database/knex';

@Injectable()
export class TokensService {
  private _knex: Knex;
  constructor(@Inject(CACHE_MANAGER) private cacheManager: Cache) {
    this._knex = KnexController.knex();
  }

  public getTokensFromObjects<T>(objArray: T[], fn: (el: T) => number[]) {
    const ids = new Set(objArray.flatMap(fn));
    return this.requestTokens(Array.from(ids));
  }

  private checkCacheForId(id: number) {
    return this.cacheManager.get<Token>(`token-${id}`);
  }

  private async saveTokenToCache(token: Token) {
    await this.cacheManager.set(`token-${token.tid}`, token);
  }

  public async requestTokens(tids: number[]) {
    const tokenMap: { [id: number]: Token } = {};
    await Promise.all(
      tids.map(async (id) => {
        const token = await this.cacheManager.get<Token | undefined>(
          `token-${id}`,
        );
        if (token) {
          tokenMap[id] = token;
        }
      }),
    );

    const tokensLeft = tids.filter((id) => !tokenMap[id]);
    if (tokensLeft.length === 0) return tokenMap;
    const tokensFetched = await this._knex('tokens')
      .select('*')
      .whereIn('tid', tokensLeft);
    for (const token of tokensFetched) {
      tokenMap[token.tid] = token;
    }

    await Promise.all(
      tokensFetched.map((token) =>
        this.cacheManager.set(`token-${token.tid}`, token),
      ),
    );

    return tokenMap;
  }

  public async getToken(tid: number) {
    const cacheCheck = await this.checkCacheForId(tid);
    if (cacheCheck) return cacheCheck;

    const token = await this.findOne(tid);
    await this.saveTokenToCache(token);
    return token;
  }

  public applyTokenFilter(filter?: TokenFilter) {
    let builder = this._knex('tokens');

    if (!filter) return builder;

    const entries = Object.entries(filter);

    const iteration = 0;
    for (const [key, value] of entries) {
      const [field, operation = null] = key.split('__') as [
        keyof Token,
        null | 'in' | 'not_in',
      ];

      switch (operation) {
        case null: {
          // Singular case
          builder =
            iteration === 0
              ? builder.where(field, value as Token[typeof field])
              : builder.andWhere(field, value as Token[typeof field]);
          break;
        }
        case 'in': {
          // Inclusion case
          throw new BadRequestException(
            'Inclusion not supported yet in token filter',
          );
        }
        case 'not_in': {
          // exclusion case
          throw new BadRequestException(
            'Exclusion not supported yet in token filter',
          );
        }
      }
    }
    return builder;
  }

  findAll(chain?: number) {
    return chain
      ? this._knex('tokens').select('*').where({ chain_id: chain })
      : this._knex('tokens').select('*');
  }

  findManyByAddress(addresses: string[]) {
    return this._knex('tokens')
      .select('*')
      .whereIn(
        'address',
        addresses.map((t) => getAddress(t)),
      );
  }

  findByAddress(address: string) {
    return this._knex('tokens')
      .select('*')
      .where({ address: getAddress(address) })
      .first();
  }

  findOne(tid: number) {
    return this._knex('tokens').select('*').where({ tid }).first();
  }
}
