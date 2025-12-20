import {
  AfterViewInit,
  Component,
  ElementRef,
  inject,
  OnDestroy,
  OnInit,
  signal,
  ViewChild,
} from '@angular/core';
import { Box } from '@components/common/box/box';
import { FormsModule } from '@angular/forms';
import { AudioService } from '@services/audio.service';
import { IconButton } from '@components/common/icon-button/icon-button';
import { FormatSecondPipe } from '@pipes/format.second';
import { take } from 'rxjs';
import { ActivatedRoute } from '@angular/router';
import { environment } from '@environments/environment.development';
import { AudioMetadata } from 'app/types/audio.type';
@Component({
  selector: 'app-audio-player',
  imports: [Box, IconButton, FormsModule, FormatSecondPipe],
  templateUrl: './audio-player.html',
  styleUrl: './audio-player.scss',
})
export class AudioPlayer implements OnInit, AfterViewInit, OnDestroy {
  private route = inject(ActivatedRoute);
  private audioService = inject(AudioService);
  @ViewChild('audioElement') audioElementRef!: ElementRef<HTMLAudioElement>;
  audioElement!: HTMLAudioElement;
  audioId!: string;
  playbackUrl!: string;
  metadata!: AudioMetadata;
  private audioMetadataHandler!: () => void;
  isPlaying = signal(false);
  playbackSpeeds = [0.5, 1, 1.5, 2];
  currentSecond = signal(0);
  audioDuration = signal(0);

  ngOnInit() {
    this.audioId = this.route.snapshot.paramMap.get('audioId') || '';
    this.audioService
      .getAudioInfo(this.audioId)
      .pipe(take(1))
      .subscribe(audioInfo => {
        this.metadata = audioInfo.metadata;
        this.playbackUrl = `${environment.apiUrl}${audioInfo.playbackUrl}`;
      });
  }

  ngAfterViewInit() {
    this.audioElement = this.audioElementRef.nativeElement;
    this.audioElement.src = this.playbackUrl;
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
    this.audioElement.load();
  }

  ngOnDestroy(): void {
    this.audioElement.removeEventListener(
      'loadedmetadata',
      this.audioMetadataHandler
    );
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
    a.href = this.playbackUrl;
    a.download = this.metadata.fileName;
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
