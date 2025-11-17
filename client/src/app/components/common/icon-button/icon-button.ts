import { Component, EventEmitter, input, Output } from '@angular/core';
import { Icon } from '../icon/icon';

@Component({
  selector: 'app-icon-button',
  imports: [Icon],
  templateUrl: './icon-button.html',
  styleUrl: './icon-button.scss',
})
export class IconButton {
  iconName = input('');

  outlined = input(true);
  disabled = input(false);
  @Output() clicked = new EventEmitter<void>();

  onClick(event: MouseEvent) {
    if (this.disabled()) {
      event.preventDefault();
      return;
    }
    this.clicked.emit();
  }
}
