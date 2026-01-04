import { NestFactory } from '@nestjs/core';
import { WsAdapter } from '@nestjs/platform-ws';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useWebSocketAdapter(new WsAdapter(app));
  // CORS 허용
  app.enableCors({
    origin: 'http://localhost:4200', // 클라이언트 주소
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
    exposedHeaders: ['Accept-Ranges', 'Content-Range', 'Content-Length'], // 브라우저가 이 헤더를 읽을 수 있게 허용
    credentials: true, // 쿠키 등을 주고받을때 필요
  });
  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
