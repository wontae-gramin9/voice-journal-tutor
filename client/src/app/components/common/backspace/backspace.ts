import { Component, inject } from '@angular/core';
import { Location } from '@angular/common';
import { IconButton } from '@components/common/icon-button/icon-button';

@Component({
  selector: 'app-backspace',
  imports: [IconButton],
  templateUrl: './backspace.html',
  styleUrl: './backspace.scss',
})
export class Backspace {
  private location = inject(Location);
  navigateBack() {
    this.location.back();
  }
}
