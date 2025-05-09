import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { ActivatedRoute } from '@angular/router';
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
          <p *ngIf="!isDrawing">Cliquez pour tirer les lots.</p>
          <p *ngIf="isDrawing">⏳ Tirage en cours...</p>
        </mat-card-content>
        <mat-card-actions>
          <button
            mat-raised-button
            color="primary"
            (click)="draw()"
            [disabled]="isDrawing || tombolaId === null"
          >
            <mat-icon>casino</mat-icon>
            Tirer les lots
          </button>
        </mat-card-actions>
      </mat-card>
    </div>
  `,
  styles: [`
    .draw-container {
      padding: 20px;
      text-align: center;
    }
    mat-card { max-width: 500px; margin: auto; }
    button { margin-top: 20px; }
  `]
})
export class DrawComponent implements OnInit {
  tombolaId: number | null = null;
  isDrawing = false;

  constructor(
    private apiService: ApiService,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    // read the tombola ID from the URL
    const idParam = this.route.snapshot.paramMap.get('id');
    this.tombolaId = idParam ? +idParam : null;
  }

  /** Trigger the backend draw endpoint for this tombola */
  draw(): void {
    if (this.tombolaId === null) return;
    this.isDrawing = true;

    // call new draw endpoint
    this.apiService.draw(this.tombolaId).subscribe({
      next: () => {
        // you may optionally navigate back to detail or reload data
        this.isDrawing = false;
      },
      error: err => {
        console.error('❌ Erreur tirage', err);
        this.isDrawing = false;
      }
    });
  }
}
