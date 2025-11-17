import { Component, signal } from '@angular/core';
import { TitleCasePipe } from '@angular/common';
import { TypeSentiment } from 'app/types/sentiment';
import { Icon } from '@components/common/icon/icon';

@Component({
  selector: 'app-sentiment',
  imports: [TitleCasePipe, Icon],
  templateUrl: './sentiment.html',
  styleUrl: './sentiment.scss',
})
export class Sentiment {
  sentiment = signal<TypeSentiment>('neutral');
  sentimentPercent = signal<number>(85);
}
