import { Component } from '@angular/core';
import { Box } from '@components/common/box/box';
import { IconButton } from '@components/common/icon-button/icon-button';

@Component({
  selector: 'app-audio-player',
  imports: [Box, IconButton],
  templateUrl: './audio-player.html',
  styleUrl: './audio-player.scss',
})
export class AudioPlayer {
  currentTime = '13:14';
  totalDuration = '15:15';
}
