import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { AppModule } from './app.module';
import * as bodyParser from 'body-parser';
import * as dotenv from 'dotenv';
// import * as cors from 'cors';

async function bootstrap() {
  dotenv.config();
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(new ValidationPipe());
  app.use(bodyParser.json({ limit: '50kb' })); // 50 KB * 1024 bytes/KB / 1 byte/caractere = 51200 caracteres
  app.use(bodyParser.urlencoded({ extended: true, limit: '50kb' }));
  app.enableShutdownHooks();
  // app.use(cors());
  app.enableCors({
    origin: process.env.CORS_ORIGIN, // Permitir apenas essa origem
    methods: ['GET', 'POST', 'PATCH', 'DELETE'], // Permitir apenas esses métodos HTTP
  });
  await app.listen(3333);
}
bootstrap();
