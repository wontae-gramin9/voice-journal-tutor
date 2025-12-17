import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // CORS 허용
  app.enableCors({
    origin: 'http://localhost:4200', // 클라이언트 주소
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
    credentials: true, // 쿠키 등을 주고받을때 필요
  });
  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
