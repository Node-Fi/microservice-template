import { Test, TestingModule } from '@nestjs/testing';
import { WalletsService } from './wallets.service';
import { startMockDatabase } from '~common/database/mocks/Postgres.environment';
import { KnexController } from '~common/database/knex';
import { Knex } from 'knex';
import { getAddress } from '@ethersproject/address';
import { PubSubModule } from '~server/pubsub/pubsub.module';

describe('WalletController', () => {
  let service: WalletsService;
  let knex: Knex;

  beforeAll(async () => {
    await startMockDatabase();
    knex = KnexController.knex();

    await knex('tenants').insert([
      {
        tid: 1,
      },
      {
        tid: 2,
      },
    ]);

    await knex('wallets').insert([
      {
        wid: 1,
        address: getAddress('0xCf2B7852D587B5F5772671184023cdb51fC5807C'),
      },
    ]);
  }, 120 * 1000);

  afterAll(async () => {
    await knex.migrate.rollback({}, true);
  });

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      providers: [WalletsService],
      imports: [PubSubModule],
    }).compile();

    service = app.get<WalletsService>(WalletsService);
  });

  describe('Get wallet', () => {
    it('Should fetch a wallet given an address', async () => {
      const info = {
        address: getAddress('0xCf2B7852D587B5F5772671184023cdb51fC5807C'),
      };
      const wallet = await service.getWallet(info);

      expect(wallet).toBeTruthy();
      expect(wallet.address).toEqual(info.address);
    });

    it("Should fetch a wallet given it's wid", async () => {
      const info = {
        address: getAddress('0xCf2B7852D587B5F5772671184023cdb51fC5807C'),
      };
      const wallet = await service.getWallet(info);

      const wallet2 = await service.getWallet({
        wid: wallet.wid,
      });

      expect(wallet2).toBeTruthy();
      expect(wallet2.wid).toEqual(wallet.wid);
    });
  });
});
