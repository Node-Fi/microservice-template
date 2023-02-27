/* eslint-disable @typescript-eslint/restrict-template-expressions */
import 'dotenv/config';

import { config as dconfig } from 'dotenv';

dconfig({
  path: `./.env.${process.env.NODE_ENV ?? 'development'}`,
});

module.exports = {
  migrations: {
    directory: './common/database/migrations',
    stub: './common/database/migration.stub',
  },
  seeds: {
    directory: './common/database/seeds',
    stub: './common/database/seed.stub',
  },
  client: 'pg',
  debug: !!process.env.DB_DEBUG,
  connection: {
    user: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.DB_NAME,
    host: `${process.env.DB_SOCKET_PATH}/${process.env.DB_INSTANCE_CONNECTION_NAME}`,
    charset: 'utf8',
  },
  useNullAsDefault: true,
};
