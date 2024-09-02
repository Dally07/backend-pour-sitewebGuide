import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as  express from 'express';
import { HttpExceptionFilter } from './http-exception-filter/http-exception-filter';
import { ValidationPipe } from '@nestjs/common';


async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.use('/uploads' , express.static('uploads'))
  app.useGlobalFilters(new HttpExceptionFilter());
  app.useGlobalPipes(new ValidationPipe());
  await app.listen(3000);
}
bootstrap();
