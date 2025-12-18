import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '@environments/environment.development';
import { BehaviorSubject } from 'rxjs';
import { AudioMetadata } from 'app/types/audio.type';

export interface AudioFile {
  objectUrl: string;
  fileName: string;
}

@Injectable({
  providedIn: 'root',
})
export class AudioService {
  private audioApiUrl = environment.apiUrl + '/audio';
  private http = inject(HttpClient);
  audioFile = new BehaviorSubject({
    objectUrl: '',
    fileName: '',
  });

  recognizedAudioText$ = new BehaviorSubject<string>('');

  // POST /audio/:id/upload
  uploadAudio(uuid: string, file: File) {
    const formData = new FormData();
    // NestJs Controller FileInterceptor에서 audioFile로 받도록 되어있음
    formData.append('audioFile', file);
    return this.http.post<AudioMetadata>(
      `${this.audioApiUrl}/${uuid}`,
      formData
    );
  }

  // DELETE /audio/list?after=IS0_DATE
  getRecordingMetadataList(after: string) {
    return this.http.get<AudioMetadata[]>(`${this.audioApiUrl}/list`, {
      params: { after },
    });
  }
}
