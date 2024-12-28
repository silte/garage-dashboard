import { NestFactory } from '@nestjs/core';

import { AppModule } from './app.module';

const port = 4000; // default port to listen

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.setGlobalPrefix(process.env.BASE_PATH);
  await app.listen(port);
}
bootstrap();
