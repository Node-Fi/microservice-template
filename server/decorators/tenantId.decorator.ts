import { ExecutionContext, createParamDecorator } from '@nestjs/common';

// The TenantId is included in the request header, under the key 'x-tenant-id'.
export const TenantId = createParamDecorator((_, req: ExecutionContext) => {
  const http = req.switchToHttp();

  return http.getRequest().headers['x-tenant-id'];
});
