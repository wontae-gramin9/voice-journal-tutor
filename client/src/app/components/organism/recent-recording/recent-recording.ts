import { Component } from '@angular/core';
import { Box } from '@components/common/box/box';
import { IconButton } from '@components/common/icon-button/icon-button';

@Component({
  selector: 'app-recent-recording',
  imports: [Box, IconButton],
  templateUrl: './recent-recording.html',
  styleUrl: './recent-recording.scss',
})
export class RecentRecording {}
