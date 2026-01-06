import { Logger } from '@nestjs/common';
import { OnGatewayConnection, WebSocketGateway } from '@nestjs/websockets';
import * as ws from 'ws';
import * as sdk from 'microsoft-cognitiveservices-speech-sdk';
import { ConfigService } from '@nestjs/config';

@WebSocketGateway({ path: '/audio' })
export class AudioGateway implements OnGatewayConnection {
  private logger = new Logger(AudioGateway.name);

  constructor(private configService: ConfigService) {}

  handleConnection(client: ws.WebSocket) {
    this.logger.log('Websocket connected');
    const subscriptionKey = this.configService.get<string>('AZURE_AI_SERVICES_SUBSCRIPTION_KEY')!;
    const region = this.configService.get<string>('AZURE_AI_SERVICES_REGION')!;
    const speechConfig = sdk.SpeechConfig.fromSubscription(subscriptionKey, region);
    speechConfig.speechRecognitionLanguage = 'ko-KR';

    const audioFormat = sdk.AudioStreamFormat.getDefaultInputFormat();
    const audioPushStream = sdk.AudioInputStream.createPushStream(audioFormat);
    const audioConfig = sdk.AudioConfig.fromStreamInput(audioPushStream);
    const recognizer = new sdk.SpeechRecognizer(speechConfig, audioConfig);

    recognizer.recognizing = (s, e) => {
      this.logger.log(`User speaking: ${e.result.text}`);
      client.send(JSON.stringify({ type: 'USER_SPEAKING', text: e.result.text }));
    };

    recognizer.recognized = (s, e) => {
      if (e.result.reason === sdk.ResultReason.RecognizedSpeech) {
        this.logger.log(`User finished: ${e.result.text}`);
        this.getCorrectedText(e.result.text)
          .then((correctedText) => {
            client.send(JSON.stringify({ type: 'USER_FINISHED', original: e.result.text, corrected: correctedText }));
          })
          .catch((err) => {
            this.logger.error('Error during text correction', err);
          });
      }
    };

    recognizer.canceled = (s, e) => {
      this.logger.error(`Recognition canceled: ${e.reason}`);
      client.send(JSON.stringify({ type: 'RECOGNITION_CANCELED', reason: e.reason }));
    };

    recognizer.startContinuousRecognitionAsync();

    // 클라이언트로부터 오디오 데이터 수신
    client.on('message', (data: Buffer) => {
      if (audioPushStream && data.length > 0) {
        const arrayBuffer = data.buffer.slice(data.byteOffset, data.byteOffset + data.byteLength);
        audioPushStream.write(arrayBuffer as ArrayBuffer);
      }
    });
    client.on('close', () => {
      this.logger.log('Websocket disconnected');
      audioPushStream.close();
      recognizer.stopContinuousRecognitionAsync(() => {
        recognizer.close();
      });
    });
    client.on('error', (err) => {
      this.logger.error('WebSocket error occurred', err);
    });
  }

  private async getCorrectedText(text: string): Promise<string> {
    return await Promise.resolve(text);
  }
}
