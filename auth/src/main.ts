import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import fs from 'fs';

async function bootstrap() {
  // const httpsOptions = {
  //   key: fs.readFileSync('src/private-key.key'),
  //   cert: fs.readFileSync('src/certificate.crt'),
  // };
  const app = await NestFactory.create(AppModule, 
    // {httpsOptions}
  );
  app.setGlobalPrefix('api');
  app.enableCors({
    // origin: 'https://192.168.8.112',
    origin: '*',
    credentials: true,
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
  })
  const config = new DocumentBuilder()
  .setTitle('NestJS API')
  .setDescription('API documentation for NestJS API')
  .setVersion('1.0')
  .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('swagger-ui', app, document);
  await app.listen(3000, '0.0.0.0');
}
bootstrap();
