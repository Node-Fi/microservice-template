import { startMockDatabase } from '~common/database/mocks/Postgres.environment';

describe('Migration tests', () => {
  beforeAll(async () => {
    await startMockDatabase(true);
  });

  it('Should pass', () => undefined);
});
