import * as Knex from 'knex';
import { KnexController } from './knex';

describe('KnexController', () => {
  let knexController: KnexController;

  beforeEach(() => {
    knexController = KnexController.getInstance();
    KnexController.knex();
  });

  afterEach(() => {
    KnexController.clear();
    jest.restoreAllMocks();
  });

  describe('getInstance', () => {
    it('should return the same instance', () => {
      const instance1 = KnexController.getInstance();
      const instance2 = KnexController.getInstance();
      expect(instance1).toBe(instance2);
    });
  });

  describe('init', () => {
    it('should initialize knex with default config', () => {
      const knexConstructorSpy = jest.spyOn(Knex, 'default');
      knexController.init();
      expect(knexConstructorSpy).toHaveBeenCalled();
    });

    it('should initialize knex with custom config', () => {
      const knexConstructorSpy = jest.spyOn(Knex, 'default');
      knexController.init({ client: 'mysql' });
      expect(knexConstructorSpy).toHaveBeenCalledWith(
        expect.objectContaining({ client: 'mysql' }),
      );
    });

    it('should set knex property', () => {
      const knexInstance = knexController.init();
      expect(knexController.getKnex()).toBe(knexInstance);
    });
  });

  describe('getKnex', () => {
    it('should return knex instance', () => {
      const knexInstance = knexController.init();
      expect(knexController.getKnex()).toBe(knexInstance);
    });

    it('should create an instance if not initialized', () => {
      const knexInstance = KnexController.knex();
      expect(knexController.getKnex()).toBe(knexInstance);
    });
  });
});
