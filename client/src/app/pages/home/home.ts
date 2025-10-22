import { Component } from '@angular/core';
import { Card } from '@components/common/card/card';
import { Container } from '@components/common/container/container';
import { Textarea } from '@components/common/textarea/textarea';
import { AudioRecorder } from '@components/organism/audio-recorder/audio-recorder';
import { AudioPlayer } from '@components/organism/audio-player/audio-player';
import { RecentRecording } from '@components/organism/recent-recording/recent-recording';
import { Sentiment } from '@components/organism/sentiment/sentiment';

@Component({
  selector: 'app-home',
  imports: [
    Card,
    Container,
    Textarea,
    AudioRecorder,
    AudioPlayer,
    RecentRecording,
    Sentiment,
  ],
  templateUrl: './home.html',
  styleUrl: './home.scss',
})
export class Home {}
