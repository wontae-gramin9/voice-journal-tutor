import {
  AfterViewInit,
  Component,
  ElementRef,
  inject,
  OnDestroy,
  signal,
  ViewChild,
} from '@angular/core';
import { Box } from '@components/common/box/box';
import { FormsModule } from '@angular/forms';
import { AudioService } from '@services/audio.service';
import { IconButton } from '@components/common/icon-button/icon-button';
import { FormatSecondPipe } from '@pipes/format.second';
import { Subscription } from 'rxjs';
@Component({
  selector: 'app-audio-player',
  imports: [Box, IconButton, FormsModule, FormatSecondPipe],
  templateUrl: './audio-player.html',
  styleUrl: './audio-player.scss',
})
export class AudioPlayer implements AfterViewInit, OnDestroy {
  private audioService = inject(AudioService);
  audioFileContext = this.audioService.audioFile;
  @ViewChild('audioElement') audioElementRef!: ElementRef<HTMLAudioElement>;
  audioElement!: HTMLAudioElement;
  private audioSub!: Subscription;
  private audioMetadataHandler!: () => void;
  isPlaying = signal(false);
  playbackSpeeds = [0.5, 1, 1.5, 2];

  currentSecond = 0;
  audioDuration = signal(0);
  ngAfterViewInit() {
    this.audioElement = this.audioElementRef.nativeElement;
    this.audioSub = this.audioService.audioFile.subscribe(audio => {
      if (audio.objectUrl) {
        if (this.audioMetadataHandler) {
          this.audioElement.removeEventListener(
            'loadedmetadata',
            this.audioMetadataHandler
          );
        }
        this.audioMetadataHandler = () => {
          this.audioDuration.set(this.audioElement.duration);
        };

        this.audioElement.addEventListener(
          'loadedmetadata',
          this.audioMetadataHandler
        );
        this.audioElement.src = audio.objectUrl;
        this.audioElement.load();
      }
    });
  }

  ngOnDestroy(): void {
    this.audioSub.unsubscribe();
    this.audioElement.removeEventListener(
      'loadedmetadata',
      this.audioMetadataHandler
    );
  }

  onNewRecordClick() {
    this.audioFileContext.next({
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
    a.href = this.audioFileContext.value.objectUrl;
    a.download = this.audioFileContext.value.fileName;
    a.click();
  }

  updateSlider(event: Event) {
    this.audioElement.currentTime = (
      event?.target as HTMLAudioElement
    ).currentTime;
  }

  onSliderChange(event: Event) {
    this.audioElement.currentTime = (
      event?.target as HTMLInputElement
    ).valueAsNumber;
  }

  changePlaybackSpeed(event: Event) {
    const speed = (event?.target as HTMLSelectElement).value;
    this.audioElement.playbackRate = parseFloat(speed);
  }
}
