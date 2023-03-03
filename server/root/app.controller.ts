import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';
import { TenantId } from '~server/decorators/tenantId.decorator';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHello(@TenantId() tid: number): string {
    return `Hello, ${tid}`;
  }
}
