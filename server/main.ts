import { HttpAdapterHost, NestFactory } from '@nestjs/core';
import { ConfigService } from '@nestjs/config';
import { AppModule } from './root/app.module';
import { useContainer } from 'class-validator';
import { ExceptionFilter } from './exceptions';
import { ValidationPipe } from '@nestjs/common';
import { initEnvironment } from '~common/utils/initEnvironment';

async function bootstrap() {
  await initEnvironment();
  const app = await NestFactory.create(AppModule);
  useContainer(app.select(AppModule), { fallbackOnErrors: true });

  const { httpAdapter } = app.get(HttpAdapterHost);

  app.useGlobalFilters(new ExceptionFilter(httpAdapter));
  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      whitelist: false,
      skipMissingProperties: true,
    }),
  );

  const config = app.get(ConfigService, { strict: false });
  const port = config.get<number>('app.port') ?? 8080;
  console.log(`Listening on port ${port}`);

  await app.listen(port);
}
bootstrap();
