import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'home',
    pathMatch: 'full',
  },
  {
    path: 'home',
    loadComponent: () => import('./pages/home/home').then(m => m.Home),
  },
  {
    path: 'audio/:audioId',
    loadComponent: () =>
      import('./pages/audio/detail/audio-detail').then(m => m.AudioDetail),
  },
  {
    path: 'audio',
    loadComponent: () => import('./pages/audio/audio').then(m => m.Audio),
  },
  {
    path: 'login',
    loadComponent: () => import('./pages/login/login').then(m => m.Login),
  },
];
