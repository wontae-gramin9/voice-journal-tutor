import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { IconButton } from '@components/common/icon-button/icon-button';

@Component({
  selector: 'app-header',
  imports: [IconButton],
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
