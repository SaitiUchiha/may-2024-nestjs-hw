import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { ValidationPipe } from '@nestjs/common';
import * as express from 'express';
import * as process from 'process';
import { join } from 'path';
import { PATH_TO_IMAGE } from './common/utils/upload.utils';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.setGlobalPrefix('/api');
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      // disableErrorMessages: true,
    }),
  );
  app.use(`${PATH_TO_IMAGE}`, express.static(join(process.cwd(), 'upload')));

  const config = new DocumentBuilder()
    .setTitle('Nest module HW example')
    .setDescription('The may-2024 API description')
    .setVersion('1.0')
    .addTag('Vira Brods')
    .addBasicAuth({
      type: 'http',
      scheme: 'bearer',
      bearerFormat: 'JWT',
      in: 'header',
    })
    .build();
  const documentFactory = () => SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/docs', app, documentFactory, {
    swaggerOptions: {
      docExpansion: 'list',
      defaultModelsExpandDepth: 1,
      persistAuthorization: true,
    },
  });
  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
