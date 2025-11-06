import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '@environments/environment.development';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AudioService {
  private audioApiUrl = environment.apiUrl + '/audio';
  private http = inject(HttpClient);
  recordedAudio = new BehaviorSubject({
    objectUrl: '',
    fileName: '',
  });
  recognizedAudioText$ = new BehaviorSubject<string>('');

  generateAudioFilename() {
    return `recording-${new Date().toLocaleString()}.mp3`;
  }

  uploadAudio(file: File) {
    // Observable 반환
    const formData = new FormData();
    formData.append('file', file);
    // 반환하는 타입 잘 봐야함
    return this.http.post(this.audioApiUrl, formData);
  }
}
