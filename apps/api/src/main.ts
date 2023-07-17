import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as cookieParser from 'cookie-parser'; 
import { NestExpressApplication } from "@nestjs/platform-express";
import * as path from "path";

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  app.enableCors();
  app.setGlobalPrefix("/api");
  app.useStaticAssets(path.join(__dirname,"/uploads/files"))
  app.use(cookieParser());
  await app.listen(3000);
}
bootstrap();
