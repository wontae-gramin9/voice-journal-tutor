import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs/internal/BehaviorSubject';

@Injectable({
  providedIn: 'root',
})
export class AudioSocketService {
  private socket!: WebSocket;
  asrResults$ = new BehaviorSubject('');

  connect() {
    this.socket = new WebSocket('ws://localhost:3000/audio');
    this.socket.binaryType = 'arraybuffer';
    this.socket.onopen = event => {
      console.log('WebSocket connection opened:', event);
    };
    this.socket.onmessage = event => {
      const data = JSON.parse(event.data);
      this.asrResults$.next(data);
    };
    this.socket.onerror = error => {
      console.error('WebSocket error:', error);
    };
    this.socket.onclose = event => {
      console.log('WebSocket connection closed', event);
    };
  }
  startStreaming(buffer: ArrayBuffer) {
    if (buffer.byteLength > 0 && this.socket.readyState === WebSocket.OPEN) {
      this.socket.send(buffer);
    }
  }

  close() {
    this.socket.close();
  }
}
