import { Component, EventEmitter, input, Output } from '@angular/core';
import { MatIcon } from '@angular/material/icon';

@Component({
  selector: 'app-icon-button',
  imports: [MatIcon],
  templateUrl: './icon-button.html',
  styleUrl: './icon-button.scss',
})
export class IconButton {
  iconName = input<string>();
  @Output() clicked = new EventEmitter<MouseEvent>();

  onClick(event: MouseEvent) {
    this.clicked.emit(event);
  }
}
