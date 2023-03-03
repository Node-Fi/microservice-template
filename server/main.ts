import { HttpAdapterHost, NestFactory } from '@nestjs/core';
import { ConfigService } from '@nestjs/config';
import { AppModule } from './root/app.module';
import { useContainer } from 'class-validator';
import { ExceptionFilter } from './exceptions';
import { startMockDatabase } from '~common/database/mocks/Postgres.environment';
import {
  FastifyAdapter,
  NestFastifyApplication,
} from '@nestjs/platform-fastify';

async function bootstrap() {
  if (process.env.NODE_ENV === 'development') {
    await startMockDatabase(true);
  }

  const app = await NestFactory.create<NestFastifyApplication>(
    AppModule,
    new FastifyAdapter(),
  );
  useContainer(app.select(AppModule), { fallbackOnErrors: true });

  const { httpAdapter } = app.get(HttpAdapterHost);

  app.useGlobalFilters(new ExceptionFilter(httpAdapter));

  const config = app.get(ConfigService, { strict: false });
  const port = config.get<number>('app.port') ?? 8080;
  console.log(`Listening on port ${port}`);

  await app.listen(port);
}
bootstrap();
