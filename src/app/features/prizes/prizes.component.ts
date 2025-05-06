import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatListModule } from '@angular/material/list';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { ApiService } from '../../core/services/api.service';

@Component({
  selector: 'app-prizes',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatCardModule,
    MatListModule,
    MatIconModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule
  ],
  template: `
    <div class="prizes-container">
      <mat-card>
        <mat-card-header>
          <mat-card-title>🎁 Lots disponibles</mat-card-title>
        </mat-card-header>
        <mat-card-content>
          <form (ngSubmit)="addLot()" class="add-form">
            <mat-form-field appearance="fill">
              <mat-label>Nom du lot</mat-label>
              <input matInput [(ngModel)]="newLot.name" name="name" required />
            </mat-form-field>

            <mat-form-field appearance="fill">
              <mat-label>Description</mat-label>
              <input matInput [(ngModel)]="newLot.description" name="description" />
            </mat-form-field>

            <button mat-raised-button color="accent" type="submit" [disabled]="!newLot.name">
              Ajouter
            </button>
          </form>

          <mat-list>
            <mat-list-item *ngFor="let lot of lots">
              <mat-icon matListIcon>redeem</mat-icon>
              <span matLine>{{ lot.name }}</span>
              <span matLine class="description">{{ lot.description }}</span>
            </mat-list-item>
          </mat-list>
        </mat-card-content>
      </mat-card>
    </div>
  `,
  styles: [`
    .prizes-container {
      padding: 20px;
    }
    .add-form {
      display: flex;
      flex-direction: column;
      gap: 12px;
      margin-bottom: 20px;
    }
    mat-form-field {
      width: 100%;
    }
    .description {
      font-size: 12px;
      color: #666;
    }
  `]
})
export class PrizesComponent {
  lots: any[] = [];
  newLot = { name: '', description: '' };

  constructor(private apiService: ApiService) {
    this.loadLots();
  }

  loadLots(): void {
    this.apiService.getLots().subscribe({
      next: (data: any[]) => this.lots = data,
      error: (err: any) => console.error('Erreur chargement lots', err)
    });
  }

  addLot(): void {
    console.log('🟢 Ajout du lot :', this.newLot);

    this.apiService.addLot(this.newLot).subscribe({
      next: () => {
        console.log('✅ Lot ajouté');
        this.newLot = { name: '', description: '' };
        this.loadLots();
      },
      error: (err: any) => console.error('❌ Erreur ajout lot', err)
    });
  }
}
