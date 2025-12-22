import { Component, EventEmitter, input, Output } from '@angular/core';
import { Box } from '@components/common/box/box';

@Component({
  selector: 'app-audio-recording',
  imports: [Box],
  templateUrl: './audio-recording.html',
  styleUrl: './audio-recording.scss',
})
export class AudioRecording {
  audioId = input('');

  @Output() clicked = new EventEmitter<string>();

  handleClick() {
    this.clicked.emit(this.audioId());
  }
}
