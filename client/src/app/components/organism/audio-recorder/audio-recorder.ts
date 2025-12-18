import { Component, inject, OnDestroy } from '@angular/core';
import { IconButton } from '@components/common/icon-button/icon-button';
import { Box } from '@components/common/box/box';
import { AudioService } from '@services/audio.service';
import { CommonModule } from '@angular/common';
import { v4 as uuidv4 } from 'uuid';
@Component({
  selector: 'app-audio-recorder',
  imports: [IconButton, Box, CommonModule],
  templateUrl: './audio-recorder.html',
  styleUrl: './audio-recorder.scss',
})
export class AudioRecorder implements OnDestroy {
  private audioService = inject(AudioService);
  private mediaRecorder!: MediaRecorder;
  private audioChunks: Blob[] = [];
  private stream!: MediaStream;
  audioFileContext = this.audioService.audioFile;
  isRecording = false;
  isFinished = false;
  isPaused = false;

  ngOnDestroy(): void {
    this.audioFileContext.next({ objectUrl: '', fileName: '' });
  }

  async startRecording() {
    this.audioFileContext.next({ objectUrl: '', fileName: '' });
    try {
      this.stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      this.mediaRecorder = new MediaRecorder(this.stream);
      this.audioChunks = [];

      this.mediaRecorder.addEventListener('dataavailable', e =>
        this.audioChunks.push(e.data)
      );
      this.mediaRecorder.addEventListener('stop', () => {
        const audioBlob = new Blob(this.audioChunks, { type: 'audio/wav' });
        const uuid = uuidv4();
        this.audioFileContext.next({
          objectUrl: URL.createObjectURL(audioBlob),
          fileName: uuid,
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
      this.isFinished = true;
    }
  }

  uploadRecording() {
    const audioBlob = new Blob(this.audioChunks, { type: 'audio/wav' });
    const audioFile = new File(
      [audioBlob],
      this.audioFileContext.value.fileName,
      {
        type: 'audio/wav',
      }
    );
    const result = this.audioService
      .uploadAudio(this.audioFileContext.value.fileName, audioFile)
      .subscribe({
        next: res => {
          console.log('Audio uploaded successfully:', res);
        },
        error: err => {
          console.error('Error uploading audio:', err);
        },
      });
    this.audioFileContext.next({ objectUrl: '', fileName: '' });
    this.isFinished = false;
    this.isRecording = false;
    return result;
  }
}
