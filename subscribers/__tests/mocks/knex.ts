import type { Knex } from 'knex';

const querybuilder = {
  insert: jest.fn().mockReturnThis(),
  where: jest.fn().mockReturnThis(),
  select: jest.fn().mockReturnThis(),
  orderBy: jest.fn().mockReturnThis(),
  toSQL: jest.fn().mockReturnThis(),
  onConflict: jest.fn().mockReturnThis(),
  merge: jest.fn(),
  toNative: jest.fn(),
};

export const mockKnex = jest
  .fn()
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  .mockReturnValue(querybuilder) as unknown as Knex<any, unknown[]>;
