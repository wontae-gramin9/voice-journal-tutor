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
  isSliderDragging = false;
  playbackSpeeds = [0.5, 1, 1.5, 2];
  currentPlaybackTime = signal(0);
  audioDuration = signal(0);

  ngOnInit() {
    this.audioId = this.route.snapshot.paramMap.get('audioId') || '';
    this.audioService.getAudioInfo(this.audioId).subscribe(audioInfo => {
      this.metadata = audioInfo.metadata;
      this.playbackUrl = `${environment.apiUrl}${audioInfo.playbackUrl}`;
    });
  }

  ngAfterViewInit() {
    this.audioElement = this.audioElementRef.nativeElement;
    this.audioElement.src = this.playbackUrl;
    if (this.audioMetadataHandler) {
      this.audioElement.removeEventListener(
        'durationchange',
        this.audioMetadataHandler
      );
    }
    this.audioMetadataHandler = () => {
      const duration = this.audioElement.duration;
      if (duration && duration !== Infinity && !isNaN(duration)) {
        this.audioDuration.set(duration);
      }
    };

    // loadedmetadata는 파일의 헤더만 읽기에, wav같은경우 duration이 Infinity로 나오는 문제가 있다.
    this.audioElement.addEventListener(
      'durationchange',
      this.audioMetadataHandler
    );
    this.audioElement.load();
  }

  ngOnDestroy(): void {
    this.audioElement.removeEventListener(
      'durationchange',
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

  updateCurrentPlaybackTime(event: Event) {
    const player = event?.target as HTMLAudioElement;
    // 오디오가 0.00001초라도 재생되면 timeupdate 이벤트가 발생함
    // this.audioElement.currentTime을 직접 대입하면, 외부에서 대입하는걸로 알고
    // 재생 위치가 바뀐걸로 알아서 스트림을 다시 요청하고, 이게 0.00001초에서 계속 발생해서
    // 무한루프에 빠지는 문제가 있어, 절대 audioElement의 prop을 직접 참조하지말고
    // 변수만 바꿔주기
    if (this.isSliderDragging) return;
    this.currentPlaybackTime.set(player.currentTime);
  }

  onSliderStart() {
    this.isSliderDragging = true;
  }

  onSliderChange(event: Event) {
    // 그러나 여기도, 아무런 장치가 없으면 동시에 updateCurrentPlaybackTime이 불리는
    // Race condition이 발생한다
    // onSliderChange중에는 조작을 멈춰줘야 한다.
    const slider = event?.target as HTMLInputElement;
    const newTime = slider.valueAsNumber;

    if (this.audioElement) {
      this.audioElement.currentTime = newTime; // 새로운 값을 넣어서 새 스트림 받기
    }
    this.isSliderDragging = false; // 다시 updateCurrentPlaybackTime 허용
  }

  changePlaybackSpeed(event: Event) {
    const speed = (event?.target as HTMLSelectElement).value;
    this.audioElement.playbackRate = parseFloat(speed);
  }
}
