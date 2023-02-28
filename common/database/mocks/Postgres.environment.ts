import {
  StartedPostgreSqlContainer,
  PostgreSqlContainer,
} from 'testcontainers';
import { KnexController } from '../knex';
import { join } from 'path';

class MockConnection {
  private static activeContainer: StartedPostgreSqlContainer | null = null;
  private static container: PostgreSqlContainer = new PostgreSqlContainer();

  static get connection() {
    return {
      user: MockConnection.activeContainer.getUsername(),
      password: MockConnection.activeContainer.getPassword(),
      database: MockConnection.activeContainer.getDatabase(),
      host: MockConnection.activeContainer.getHost(),
      port: MockConnection.activeContainer.getPort(),
      charSet: 'utf8',
    };
  }

  async init() {
    if (MockConnection.activeContainer) {
      return;
    }

    MockConnection.activeContainer = await MockConnection.container.start();
  }

  async close() {
    if (!MockConnection.activeContainer) {
      return;
    }
    await MockConnection.activeContainer.stop();
    MockConnection.activeContainer = null;
  }
}

export const startMockDatabase = async (skipMigration = false) => {
  if (KnexController.getInstance().getKnex()) {
    return KnexController.knex();
  }

  console.log('Starting mock database');
  const mockConnection = new MockConnection();
  await mockConnection.init();
  const knex = KnexController.getInstance().init({
    client: 'pg',
    connection: MockConnection.connection,
    migrations: {
      directory: join(__dirname, '..', 'migrations'),
    },
  });

  if (skipMigration) return knex;

  await knex.migrate.latest();

  return knex;
};
