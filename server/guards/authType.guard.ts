import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const isPublic = this.reflector.getAllAndOverride('IsPublic', [
      context.getHandler(),
      context.getClass(),
    ]);

    const isApiKeyAccessible = this.reflector.getAllAndOverride(
      'ApiKeyRequired',
      [context.getHandler(), context.getClass()],
    );

    const jwtRequired = this.reflector.getAllAndOverride('JwtRequired', [
      context.getHandler(),
      context.getClass(),
    ]);

    if (isPublic) return true;

    const httpContext = context.switchToHttp();
    const req = httpContext.getRequest();
    const headers = req.headers;

    const authType = headers['x-auth-type'];

    if (isApiKeyAccessible) {
      return authType === 'api-key' || authType === 'jwt';
    }

    if (jwtRequired) {
      return authType === 'jwt';
    }
    return true;
  }
}
