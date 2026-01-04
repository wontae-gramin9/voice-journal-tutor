import { Logger } from '@nestjs/common';
import { OnGatewayConnection, OnGatewayDisconnect, WebSocketGateway } from '@nestjs/websockets';
import * as ws from 'ws';

@WebSocketGateway({ path: '/audio' })
export class AudioGateway implements OnGatewayConnection, OnGatewayDisconnect {
  private logger = new Logger(AudioGateway.name);
  handleConnection(client: ws.WebSocket) {
    this.logger.log('Websocket connected');
    client.on('message', (data: Buffer) => {
      // 수신된 오디오 데이터 처리 로직 구현
      this.logger.log(`Data received: ${data.length} bytes`);
    });
    client.on('error', (err) => {
      this.logger.error('WebSocket error occurred', err);
    });
  }

  handleDisconnect(client: ws.WebSocket) {
    this.logger.log('Client disconnected');
    // 필요한 경우 여기서 resource 정리 작업 수행
  }
}
