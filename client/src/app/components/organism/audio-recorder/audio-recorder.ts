import { Component, inject } from '@angular/core';
import { IconButton } from '@components/common/icon-button/icon-button';
import { Box } from '@components/common/box/box';
import { AudioService } from '@services/audio.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-audio-recorder',
  imports: [IconButton, Box, CommonModule],
  templateUrl: './audio-recorder.html',
  styleUrl: './audio-recorder.scss',
})
export class AudioRecorder {
  private audioService = inject(AudioService);
  private mediaRecorder!: MediaRecorder;
  private audioChunks: Blob[] = [];
  private stream!: MediaStream;
  recordedAudioUrlContext = this.audioService.recordedAudio;
  isRecording = false;
  isPaused = false;

  async startRecording() {
    try {
      this.stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      this.mediaRecorder = new MediaRecorder(this.stream);
      this.audioChunks = [];

      this.mediaRecorder.addEventListener('dataavailable', e =>
        this.audioChunks.push(e.data)
      );
      this.mediaRecorder.addEventListener('stop', () => {
        const audioBlob = new Blob(this.audioChunks, { type: 'audio/wav' });
        this.recordedAudioUrlContext.next({
          objectUrl: URL.createObjectURL(audioBlob),
          fileName: this.audioService.generateAudioFilename(),
        });
      });

      this.mediaRecorder.start();
      this.isRecording = true;
    } catch (error) {
      alert('Microphone access is required to record audio.');
      console.error('Error accessing microphone:', error);
      return;
    }
  }

  resumeRecording() {
    this.mediaRecorder.resume();
    this.isPaused = false;
  }
  pauseRecording() {
    this.mediaRecorder.pause();
    this.isPaused = true;
  }

  stopRecording() {
    if (this.mediaRecorder && this.isRecording) {
      this.mediaRecorder.stop();
      this.isRecording = false;
    }
  }
  uploadRecording() {
    const audioBlob = new Blob(this.audioChunks, { type: 'audio/wav' });
    const audioFile = new File(
      [audioBlob],
      this.recordedAudioUrlContext.value.fileName,
      {
        type: 'audio/wav',
      }
    );
    const result = this.audioService.uploadAudio(audioFile);
    return result;
  }
}
