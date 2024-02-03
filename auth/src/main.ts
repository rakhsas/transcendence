import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import * as session from 'express-session';
import * as passport from 'passport';


async function bootstrap() {

  const app = await NestFactory.create(AppModule);
  // app.use(
  //   session({
  //     secret: 'secret',
  //     resave: false,
  //     saveUninitialized: false,
  //   })
  //   )
  // app.use(passport.initialize());
  // app.use(passport.session());
  app.setGlobalPrefix('api');
  app.enableCors({
    origin: [
      'localhost'
    ]
  })
  const config = new DocumentBuilder()
  .setTitle('NestJS API')
  .setDescription('API documentation for NestJS API')
  .setVersion('1.0')
  .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('swagger-ui', app, document);
  await app.listen(3000);
}
bootstrap();
