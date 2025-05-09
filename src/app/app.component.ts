import { Component, computed } from '@angular/core';
import { RouterModule, RouterOutlet, Router } from '@angular/router';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { AuthService } from './core/services/auth.service';
import { NgIf } from '@angular/common';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    RouterOutlet,
    RouterModule,
    NgIf,
    MatToolbarModule,
    MatButtonModule
  ],
  template: `
    <mat-toolbar *ngIf="auth.isAuthenticated()" color="primary">
      🎟️ Frequencies Tombola
      <span class="spacer"></span>
      <button mat-button routerLink="/">Dashboard</button>
      <button mat-button routerLink="/configuration">Configuration</button>
      <button mat-button (click)="logout()">Déconnexion</button>
    </mat-toolbar>

    <router-outlet />
  `,
  styles: [`
    mat-toolbar {
      display: flex;
      justify-content: space-between;
      align-items: center;
    }
    .spacer {
      flex: 1;
    }
  `]
})
export class AppComponent {
  constructor(public auth: AuthService, private router: Router) {}

  logout(): void {
    this.auth.clearCredentials();
    this.router.navigate(['/login']);
  }
}
