import { Component } from '@angular/core';
import { Card } from '@components/common/card/card';
import { Container } from '@components/common/container/container';
import { Textarea } from '@components/common/textarea/textarea';
import { Sentiment } from '@components/organism/sentiment/sentiment';
import { AudioRecorder } from '@components/organism/audio-recorder/audio-recorder';

@Component({
  selector: 'app-audio',
  imports: [Card, Container, Textarea, Sentiment, AudioRecorder],
  templateUrl: './audio.html',
  styleUrl: './audio.scss',
})
export class Audio {}
