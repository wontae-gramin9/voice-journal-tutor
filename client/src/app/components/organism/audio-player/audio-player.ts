import { Component, inject, signal } from '@angular/core';
import { Box } from '@components/common/box/box';
import { AudioService } from '@services/audio.service';
import { IconButton } from '@components/common/icon-button/icon-button';
@Component({
  selector: 'app-audio-player',
  imports: [Box, IconButton],
  templateUrl: './audio-player.html',
  styleUrl: './audio-player.scss',
})
export class AudioPlayer {
  private audioService = inject(AudioService);
  recordedAudioUrlContext = this.audioService.recordedAudio;
  playbackSpeeds = [0.5, 1, 1.5, 2];
  audioElement = document.querySelector('audio') as HTMLAudioElement;
  isPlaying = signal(false);

  currentTime = '13:14';
  totalDuration = '15:15';

  onNewRecordClick() {
    this.recordedAudioUrlContext.next({
      objectUrl: '',
      fileName: '',
    });
  }

  playAudio() {
    this.isPlaying.set(true);
    this.audioElement.play();
  }

  pauseAudio() {
    this.isPlaying.set(false);
    this.audioElement.pause();
  }

  jumpBackwardAudio() {
    this.audioElement.currentTime = Math.min(
      0,
      this.audioElement.currentTime - 5
    );
  }

  jumpForwardAudio() {
    this.audioElement.currentTime = Math.min(
      0,
      this.audioElement.currentTime + 5
    );
  }

  downloadAudio() {
    const a = document.createElement('a');
    a.href = this.recordedAudioUrlContext.value.objectUrl;
    a.download = this.recordedAudioUrlContext.value.fileName;
    a.click();
  }
  changePlaybackSpeed(event: Event) {
    const speed = (event?.target as HTMLSelectElement).value;
    this.audioElement.playbackRate = parseFloat(speed);
  }
}
