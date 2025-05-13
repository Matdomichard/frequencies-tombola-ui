import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
  ],
  template: `
    <div class="login-container">
      <mat-card>
        <mat-card-title>🔐 Connexion</mat-card-title>
        <mat-card-content>
          <form (ngSubmit)="login()">
            <mat-form-field appearance="fill">
              <mat-label>Nom d'utilisateur</mat-label>
              <input matInput [(ngModel)]="username" name="username" required />
            </mat-form-field>

            <mat-form-field appearance="fill">
              <mat-label>Mot de passe</mat-label>
              <input matInput [(ngModel)]="password" name="password" type="password" required />
            </mat-form-field>

            <button mat-raised-button color="primary" type="submit">Se connecter</button>
          </form>

          <div *ngIf="authError" class="error-message">
            <mat-icon color="warn">error</mat-icon>
            <span>Identifiants incorrects. Veuillez réessayer.</span>
          </div>
        </mat-card-content>
      </mat-card>
    </div>
  `,
  styles: [`
    .login-container {
      padding: 20px;
      max-width: 400px;
      margin: 60px auto;
    }
    mat-form-field {
      width: 100%;
      margin-bottom: 16px;
    }
    button {
      width: 100%;
      margin-top: 8px;
      padding: 8px;
    }
    .error-message {
      display: flex;
      align-items: center;
      gap: 8px;
      margin-top: 16px;
      padding: 12px;
      border-radius: 4px;
      background-color: #fdecea;
      color: #d32f2f;
    }
    mat-icon {
      font-size: 20px;
      height: 20px;
      width: 20px;
    }
  `]
})
export class LoginComponent {
  username = '';
  password = '';
  authError = false;
  isLoading = false;

  constructor(private authService: AuthService, private router: Router) {}

  login(): void {
    this.authError = false;
    this.authService.login(this.username, this.password).subscribe({
      next: (success) => {
        if (success) {
          this.router.navigateByUrl('/');
        } else {
          this.authError = true;
        }
      },
      error: () => {
        this.authError = true;
      }
    });
  }
}
