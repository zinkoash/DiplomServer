import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { join } from 'path';
import * as express from 'express';

async function start() {
  const PORT = process.env.PORT||3000
  const app = await NestFactory.create(AppModule);
  app.use('/static', express.static(join(__dirname, '..','..', 'static')));
  app.enableCors({ credentials: true, origin: true });
  await app.listen(PORT, ()=>console.log(`Server started on port ${PORT}`));
}
start();
