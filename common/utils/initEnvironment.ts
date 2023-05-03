import { exit } from 'process';
import { KnexController } from '~common/database/knex';
import { startMockDatabase } from '~common/database/mocks/Postgres.environment';

export async function initEnvironment() {
  console.log('Initiating environment');
  if (process.env.MOCK_DB === 'true') {
    await startMockDatabase(true);
  } else {
    const instance = KnexController.getInstance().init();
    if (instance) {
      console.log(
        'Connected to database: ' + instance.client.config.connection.database,
      );
    } else {
      console.error('No database connection, exiting');
      exit(1);
    }
  }
}
