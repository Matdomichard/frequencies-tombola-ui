import { Routes } from '@angular/router';
import { authGuard } from './core/guards/auth.guard';

export const appRoutes: Routes = [
  {
    path: '',
    canActivate: [authGuard],
    loadComponent: () => import('./features/dashboard/dashboard.component').then(m => m.DashboardComponent),
  },
  {
    path: 'tickets',
    canActivate: [authGuard],
    loadComponent: () => import('./features/tickets/tickets.component').then(m => m.TicketsComponent),
  },
  {
    path: 'prizes',
    canActivate: [authGuard],
    loadComponent: () => import('./features/prizes/prizes.component').then(m => m.PrizesComponent),
  },
  {
    path: 'draw',
    canActivate: [authGuard],
    loadComponent: () => import('./features/draw/draw.component').then(m => m.DrawComponent),
  },
  {
    path: 'configuration',
    canActivate: [authGuard],
    loadComponent: () => import('./features/configuration/configuration.component').then(m => m.ConfigurationComponent),
  },
  {
    path: 'tombolas/:id',
    canActivate: [authGuard],
    loadComponent: () => import('./features/tombola-detail/tombola-detail.component').then(m => m.TombolaDetailComponent),
  },
  {
    path: 'login',
    loadComponent: () => import('./features/login/login.component').then(m => m.LoginComponent),
  },
  {
    path: '**',
    redirectTo: ''
  }
];
