import { Component, inject, signal } from '@angular/core';
import { Card } from '@components/common/card/card';
import { Container } from '@components/common/container/container';
import { AudioPlayer } from '@components/organism/audio-player/audio-player';
import { Textarea } from '@components/common/textarea/textarea';
import { Sentiment } from '@components/organism/sentiment/sentiment';
import { ActivatedRoute } from '@angular/router';
import { IconButton } from '@components/common/icon-button/icon-button';
import { Backspace } from '@components/common/backspace/backspace';

@Component({
  selector: 'app-audio-detail',
  imports: [
    Card,
    Container,
    AudioPlayer,
    Textarea,
    Sentiment,
    IconButton,
    Backspace,
  ],
  templateUrl: './audio-detail.html',
  styleUrl: './audio-detail.scss',
})
export class AudioDetail {
  private activatedRoute = inject(ActivatedRoute);
  recordingId = signal('');

  constructor() {
    this.activatedRoute.params.subscribe(params => {
      this.recordingId.set(params['recordingId']);
    });
  }
}
