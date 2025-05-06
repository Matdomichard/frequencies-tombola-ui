import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
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

          <p *ngIf="authError" style="color: red; margin-top: 10px;">
            Identifiants incorrects. Veuillez réessayer.
          </p>
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
  `]
})
export class LoginComponent {
  username = '';
  password = '';
  authError = false;

  constructor(private authService: AuthService, private router: Router) {}

  login(): void {
    this.authService.setCredentials(this.username, this.password);

    this.authError = false;
    this.router.navigateByUrl('/');
  }
}
