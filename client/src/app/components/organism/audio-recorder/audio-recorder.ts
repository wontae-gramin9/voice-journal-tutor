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
  generatedFileName$ = this.audioService.generatedFileName$;
  isRecording$ = this.audioService.isRecording$;
  isPaused$ = this.audioService.isPaused$;
  isFinished$ = this.audioService.isFinished$;

  async start() {
    await this.audioService.startRecording();
  }

  resume() {
    this.audioService.resumeRecording();
  }

  pause() {
    this.audioService.pauseRecording();
  }

  stop() {
    this.audioService.stopRecording();
  }

  uploadRecording() {
    this.audioService.uploadAudio();
  }
}
