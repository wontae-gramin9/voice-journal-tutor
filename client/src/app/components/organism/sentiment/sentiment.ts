import { Component, signal } from '@angular/core';
import { TitleCasePipe } from '@angular/common';
import { IconButton } from '@components/common/icon-button/icon-button';
import type { TypeSentiment } from 'types/sentiment.type';

@Component({
  selector: 'app-sentiment',
  imports: [IconButton, TitleCasePipe],
  templateUrl: './sentiment.html',
  styleUrl: './sentiment.scss',
})
export class Sentiment {
  sentiment = signal<TypeSentiment>('neutral');
  sentimentPercent = signal<number>(85);
}
