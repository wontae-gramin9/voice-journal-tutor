import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { Card } from '@components/common/card/card';
import { Container } from '@components/common/container/container';
import { AudioRecording } from '@components/organism/audio-recording/audio-recording';
import { SentimentGraph } from '@components/organism/sentiment-graph/sentiment-graph';
import { AudioService } from '@services/audio.service';
import { IconButton } from '@components/common/icon-button/icon-button';

@Component({
  selector: 'app-home',
  imports: [Card, Container, AudioRecording, SentimentGraph, IconButton],
  templateUrl: './home.html',
  styleUrl: './home.scss',
})
export class Home {
  private audioService = inject(AudioService);
  private router = inject(Router);
  recordedAudioUrl = this.audioService.audioFile;

  audioIDs = ['rec1', 'rec2', 'rec3', 'rec4'];
  trackByRecordingId(_index: number, id: string) {
    return id;
  }

  navigateToNewRecording() {
    this.router.navigate(['/audio']);
  }
  navigateToRecording(audioId: string) {
    this.router.navigate(['/audio', audioId]);
  }
}
