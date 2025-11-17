import { Component } from '@angular/core';
import { Card } from '@components/common/card/card';
import { Container } from '@components/common/container/container';
import { Textarea } from '@components/common/textarea/textarea';
import { Sentiment } from '@components/organism/sentiment/sentiment';
import { AudioRecorder } from '@components/organism/audio-recorder/audio-recorder';
import { Backspace } from '@components/common/backspace/backspace';

@Component({
  selector: 'app-audio',
  imports: [Card, Container, Textarea, Sentiment, AudioRecorder, Backspace],
  templateUrl: './audio.html',
  styleUrl: './audio.scss',
})
export class Audio {}
