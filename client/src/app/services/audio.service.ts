import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '@environments/environment.development';
import { BehaviorSubject } from 'rxjs';
import { AudioInfo, AudioMetadata } from 'app/types/audio.type';
import { v4 as uuidv4 } from 'uuid';

@Injectable({
  providedIn: 'root',
})
export class AudioService {
  private audioApiUrl = environment.apiUrl + '/audio';
  private http = inject(HttpClient);

  recognizedAudioText$ = new BehaviorSubject<string>('');
  private mediaRecorder!: MediaRecorder;
  private audioChunks: Blob[] = [];
  // 녹음상태를 관찰하는 Observable
  isRecording$ = new BehaviorSubject(false);
  isPaused$ = new BehaviorSubject(false);
  isFinished$ = new BehaviorSubject(false);
  recordingUuid = '';
  generatedFileName$ = new BehaviorSubject('');

  async startRecording() {
    this.generatedFileName$.next('');
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      this.mediaRecorder = new MediaRecorder(stream);
      this.audioChunks = [];

      this.mediaRecorder.addEventListener('dataavailable', e =>
        this.audioChunks.push(e.data)
      );
      this.mediaRecorder.addEventListener('stop', () => {
        this.recordingUuid = uuidv4();
      });

      this.mediaRecorder.start();
      this.isRecording$.next(true);
    } catch (error) {
      alert('Microphone access is required to record audio.');
      console.error('Error accessing microphone:', error);
      return;
    }
  }

  resumeRecording() {
    this.mediaRecorder.resume();
    this.isPaused$.next(false);
  }

  pauseRecording() {
    this.mediaRecorder.pause();
    this.isPaused$.next(true);
  }

  stopRecording() {
    if (this.mediaRecorder && this.isRecording$.value) {
      this.mediaRecorder.stop();
      this.isRecording$.next(false);
      this.isFinished$.next(true);
    }
  }

  // GET /audio/:id
  getAudioInfo(uuid: string) {
    return this.http.get<AudioInfo>(`${this.audioApiUrl}/${uuid}`);
  }

  // POST /audio/:id
  uploadAudio() {
    const audioBlob = new Blob(this.audioChunks, {
      type: this.mediaRecorder.mimeType,
    });
    const audioFile = new File([audioBlob], this.recordingUuid, {
      type: this.mediaRecorder.mimeType,
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
