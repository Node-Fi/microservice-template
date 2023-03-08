import { CacheModule } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { TokensService } from './tokens.service';
import { startMockDatabase } from '~common/database/mocks/Postgres.environment';
import { nonsensicalMockData, seed } from '~common/database/mocks/data';

describe('TokensService', () => {
  let service: TokensService;

  beforeAll(async () => {
    await startMockDatabase();
    process.env.NODE_ENV = 'test';
    process.env.MOCK_REDIS = 'true';
    process.env.MOCK_PUBSUB = 'true';
  });

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [CacheModule.register({ isGlobal: true })],
      providers: [TokensService],
    }).compile();

    service = module.get<TokensService>(TokensService);
    await seed(nonsensicalMockData);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should return a list of tokens', async () => {
    const tokens = await service.findAll();

    expect(tokens).toHaveLength(nonsensicalMockData.tokens.length);
  });

  it('Should fetch tokens by id', async () => {
    const ids = [0, 1];
    const expected = nonsensicalMockData.tokens.filter((token) =>
      ids.includes(token.tid),
    );

    const tokens = await service.requestTokens(ids);

    expect(Object.values(tokens)).toHaveLength(expected.length);

    expected.forEach((token) => {
      expect(tokens[token.tid]).toEqual(token);
    });
  });
});
