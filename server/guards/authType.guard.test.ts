import { CanActivate, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { RolesGuard } from './authType.guard';

describe('RolesGuard', () => {
  let guard: CanActivate;
  let reflector: {
    getAllAndOverride: jest.Mock;
  };
  let context: ExecutionContext;

  beforeEach(() => {
    reflector = {
      getAllAndOverride: jest.fn(),
    } as any;
    guard = new RolesGuard(reflector as unknown as Reflector);
    context = {
      switchToHttp: jest.fn(() => ({
        getRequest: jest.fn(() => ({
          headers: {},
        })),
      })),
      getHandler: jest.fn(),
      getClass: jest.fn(),
    } as any;
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  describe('canActivate', () => {
    it('should return true for public endpoints', () => {
      const isPublic = true;
      reflector.getAllAndOverride.mockReturnValueOnce(isPublic);

      const result = guard.canActivate(context);

      expect(result).toBe(true);
      expect(reflector.getAllAndOverride).toHaveBeenCalledWith('IsPublic', [
        context.getHandler(),
        context.getClass(),
      ]);
    });

    it('should return true for api key accessible endpoints', () => {
      const isApiKeyAccessible = true;
      reflector.getAllAndOverride.mockReturnValueOnce(isApiKeyAccessible);

      context.switchToHttp().getRequest().headers = {
        'x-auth-type': 'api-key',
      };

      const result = guard.canActivate(context);

      expect(result).toBe(true);
      expect(reflector.getAllAndOverride).toHaveBeenCalledWith(
        'ApiKeyRequired',
        [context.getHandler(), context.getClass()],
      );
    });

    it('should return true for jwt required endpoints', () => {
      const jwtRequired = true;
      reflector.getAllAndOverride.mockReturnValueOnce(jwtRequired);

      context.switchToHttp().getRequest().headers = {
        'x-auth-type': 'jwt',
      };

      const result = guard.canActivate(context);

      expect(result).toBe(true);
      expect(reflector.getAllAndOverride).toHaveBeenCalledWith('JwtRequired', [
        context.getHandler(),
        context.getClass(),
      ]);
    });

    it('should return true for admin only endpoints', () => {
      const adminOnly = true;
      reflector.getAllAndOverride.mockReturnValueOnce(adminOnly);

      context.switchToHttp().getRequest().headers = {
        'x-node-admin': true,
      };

      const result = guard.canActivate(context);

      expect(result).toBe(true);
      expect(reflector.getAllAndOverride).toHaveBeenCalledWith('AdminOnly', [
        context.getHandler(),
        context.getClass(),
      ]);
    });

    it('should return false for api key accessible endpoints without api key or jwt', () => {
      reflector.getAllAndOverride.mockImplementation(
        (s: string) => s === 'ApiKeyRequired',
      );

      context.switchToHttp().getRequest().headers = {};

      const result = guard.canActivate(context);

      expect(result).toBe(false);
      expect(reflector.getAllAndOverride).toHaveBeenCalledWith(
        'ApiKeyRequired',
        [context.getHandler(), context.getClass()],
      );
    });

    it('should return false for jwt required endpoints without jwt', () => {
      reflector.getAllAndOverride.mockImplementation(
        (s: string) => s === 'JwtRequired',
      );

      context.switchToHttp().getRequest().headers = {};

      const result = guard.canActivate(context);

      expect(result).toBe(false);
      expect(reflector.getAllAndOverride).toHaveBeenCalledWith('JwtRequired', [
        context.getHandler(),
        context.getClass(),
      ]);
    });

    it('should return false for admin only endpoints without x-node-admin header', () => {
      reflector.getAllAndOverride.mockImplementation(
        (s: string) => s === 'AdminOnly',
      );

      context.switchToHttp().getRequest().headers = {};

      const result = guard.canActivate(context);

      expect(result).toBe(false);
      expect(reflector.getAllAndOverride).toHaveBeenCalledWith('AdminOnly', [
        context.getHandler(),
        context.getClass(),
      ]);
    });

    it('should return false for non-public endpoints without any header', () => {
      reflector.getAllAndOverride.mockReturnValueOnce(false);

      const result = guard.canActivate(context);

      expect(result).toBe(false);
      expect(reflector.getAllAndOverride).toHaveBeenCalledWith('IsPublic', [
        context.getHandler(),
        context.getClass(),
      ]);
    });

    it('should return false for non-public endpoints without x-auth-type header', () => {
      reflector.getAllAndOverride.mockReturnValueOnce(false);

      context.switchToHttp().getRequest().headers = {};

      const result = guard.canActivate(context);

      expect(result).toBe(false);
      expect(reflector.getAllAndOverride).toHaveBeenCalledWith('IsPublic', [
        context.getHandler(),
        context.getClass(),
      ]);
    });
  });
});
