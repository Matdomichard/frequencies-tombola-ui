import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { ApiService } from '../../core/services/api.service';

@Component({
  selector: 'app-draw',
  standalone: true,
  imports: [CommonModule, MatCardModule, MatButtonModule, MatIconModule],
  template: `
    <div class="draw-container">
      <mat-card>
        <mat-card-title>🎲 Tirage au Sort</mat-card-title>
        <mat-card-content>
          <p *ngIf="!isDrawing && !winner">Cliquez pour tirer un gagnant.</p>
          <p *ngIf="isDrawing">⏳ Tirage en cours...</p>
          <p *ngIf="winner">🎉 Gagnant : <strong>{{ winner.name }}</strong></p>

          <button mat-raised-button color="primary" (click)="drawWinner()" [disabled]="isDrawing">
            <mat-icon>casino</mat-icon>
            Tirer un gagnant
          </button>
        </mat-card-content>
      </mat-card>
    </div>
  `,
  styles: [`
    .draw-container {
      padding: 20px;
      text-align: center;
    }
    mat-card {
      max-width: 500px;
      margin: auto;
    }
    button {
      margin-top: 20px;
    }
  `]
})
export class DrawComponent {
  isDrawing = false;
  winner: any = null;

  constructor(private apiService: ApiService) {}

  drawWinner(): void {
    this.isDrawing = true;
    this.winner = null;

    setTimeout(() => {
      this.apiService.drawWinner().subscribe({
        next: (data: any) => {
          this.winner = data;
          this.isDrawing = false;
        },
        error: (err: any) => {
          console.error('❌ Erreur tirage', err);
          this.isDrawing = false;
        }
      });
    }, 2000);
  }
}
