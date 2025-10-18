import { Component, inject } from '@angular/core';
import { MatIcon } from '@angular/material/icon';
import { Router } from '@angular/router';

@Component({
  selector: 'app-header',
  imports: [MatIcon],
  templateUrl: './header.html',
  styleUrl: './header.scss',
})
export class Header {
  private router = inject(Router);
  navigateToHome() {
    this.router.navigate(['/home']);
  }
  logout() {
    console.log('Logout');
  }
  openSettings() {
    console.log('Open dialog');
  }
}
