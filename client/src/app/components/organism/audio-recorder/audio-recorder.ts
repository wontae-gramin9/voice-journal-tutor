import { Component } from '@angular/core';
import { IconButton } from '@components/common/icon-button/icon-button';
import { Box } from '@components/common/box/box';

@Component({
  selector: 'app-audio-recorder',
  imports: [IconButton, Box],
  templateUrl: './audio-recorder.html',
  styleUrl: './audio-recorder.scss',
})
export class AudioRecorder {}
