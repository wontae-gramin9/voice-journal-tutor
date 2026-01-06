import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '@environments/environment.development';
import { BehaviorSubject } from 'rxjs';
import { AudioInfo, AudioMetadata } from 'app/types/audio.type';
import RecordRTC from 'recordrtc';
import { v4 as uuidv4 } from 'uuid';
import { AudioSocketService } from './audio-socket.service';

@Injectable({
  providedIn: 'root',
})
export class AudioService {
  private audioApiUrl = environment.apiUrl + '/audio';
  private http = inject(HttpClient);
  private socketService = inject(AudioSocketService);
  private stream!: MediaStream;
  private recorder!: RecordRTC;
  AUDIO_MIME_TYPE = 'audio/wav';
  finalBlob!: Blob;
  isRecording$ = new BehaviorSubject(false);
  isPaused$ = new BehaviorSubject(false);
  isFinished$ = new BehaviorSubject(false);
  recordingUuid = '';
  generatedFileName$ = new BehaviorSubject('');

  recognizedAudioText$ = new BehaviorSubject<string>('');

  async startRecording() {
    this.generatedFileName$.next('');
    try {
      // 1. WebSocket 연결
      this.socketService.connect();
      // 2. 마이크 접근 권한 요청 및 MediaRecorder 생성
      this.stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      this.recorder = new RecordRTC(this.stream, {
        type: 'audio',
        mimeType: 'audio/wav', // Azure가 좋아하는 WAV(PCM) 형식 지정
        recorderType: RecordRTC.StereoAudioRecorder,
        numberOfAudioChannels: 1, // Mono (Azure 권장)
        desiredSampRate: 16000, // Mono (Azure 권장)
        timeSlice: 250, // 250ms 단위로 dataavailable 이벤트 발생
        ondataavailable: async (blob: Blob) => {
          const arrayBuffer = await blob.arrayBuffer();
          // 3. 소켓을 통해 서버로 오디오 데이터 전송, 담아두지 않음
          this.socketService.startStreaming(arrayBuffer);
        },
      });

      this.recorder.startRecording();
      this.isRecording$.next(true);
    } catch (error) {
      alert('Microphone access is required to record audio.');
      console.error('Error accessing microphone:', error);
      return;
    }
  }

  resumeRecording() {
    this.recorder.resumeRecording();
    this.isPaused$.next(false);
  }

  pauseRecording() {
    this.recorder.pauseRecording();
    this.isPaused$.next(true);
  }

  stopRecording() {
    if (this.isRecording$.value) {
      this.recorder.stopRecording(() => {
        this.finalBlob = this.recorder.getBlob(); // RecordRTC가 생성한 최종 Blob
        this.recordingUuid = uuidv4();
        this.socketService.close();
        this.stream.getTracks().forEach(track => track.stop());
        this.isRecording$.next(false);
        this.isFinished$.next(true);
      });
    }
  }

  // GET /audio/:id
  getAudioInfo(uuid: string) {
    return this.http.get<AudioInfo>(`${this.audioApiUrl}/${uuid}`);
  }

  // POST /audio/:id
  uploadAudio() {
    const audioFile = new File([this.finalBlob], this.recordingUuid, {
      type: this.AUDIO_MIME_TYPE,
    });

    const formData = new FormData();
    // NestJs Controller FileInterceptor에서 audioFile로 받도록 되어있음
    formData.append('audioFile', audioFile);

    this.http
      .post<AudioMetadata>(
        `${this.audioApiUrl}/${this.recordingUuid}`,
        formData
      )
      .subscribe({
        next: res => {
          console.log('Audio uploaded successfully:', res);
          // 서비스도 여서 와야겠네
          this.generatedFileName$.next(res.fileName);
        },
        error: err => {
          console.error('Error uploading audio:', err);
        },
      });
  }

  // GET /audio/list?after=IS0_DATE
  getRecordingMetadataList(after: string) {
    return this.http.get<AudioMetadata[]>(`${this.audioApiUrl}/list`, {
      params: { after },
    });
  }
}
