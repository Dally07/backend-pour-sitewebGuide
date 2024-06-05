import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as  express from 'express';
import { HttpExceptionFilter } from './http-exception-filter/http-exception-filter';


async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.use('/uploads' , express.static('uploads'))
  app.useGlobalFilters(new HttpExceptionFilter());
  await app.listen(3000);
}
bootstrap();
