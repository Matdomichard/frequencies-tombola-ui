import { Component, Input, ChangeDetectorRef, SimpleChanges, ViewChild } from '@angular/core';
import { NgModel } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTableModule } from '@angular/material/table';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { FormsModule } from '@angular/forms';
import { ApiService } from '../../core/services/api.service';
import { MatTooltipModule } from '@angular/material/tooltip';

interface NewLot {
  name: string;
  description: string;
  donorName: string;
}

@Component({
  selector: 'app-prizes',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatTableModule,
    MatFormFieldModule,
    MatInputModule,
    FormsModule,
    MatTooltipModule
  ],
  template: `
    <mat-card class="prizes-card">
      <mat-card-header>
        <mat-card-title>
        🎁 Lots
        </mat-card-title>
      </mat-card-header>
      
      <mat-card-content>
        <div class="inline-form">
          <mat-form-field appearance="outline">
            <mat-label>Nom du lot</mat-label>
            <input matInput [(ngModel)]="newLot.name" #nameInput="ngModel" required placeholder="Ex: iPhone 15">
            <mat-error *ngIf="nameInput.invalid && nameInput.touched">Ce champ est requis</mat-error>
          </mat-form-field>

          <mat-form-field appearance="outline">
            <mat-label>Description</mat-label>
            <input matInput [(ngModel)]="newLot.description" placeholder="Ex: Dernier modèle">
          </mat-form-field>

          <mat-form-field appearance="outline">
            <mat-label>Donateur</mat-label>
            <input matInput [(ngModel)]="newLot.donorName" #donorInput="ngModel" required placeholder="Ex: Apple">
            <mat-error *ngIf="donorInput.invalid && donorInput.touched">Ce champ est requis</mat-error>
          </mat-form-field>

          <button mat-raised-button color="primary" 
                  (click)="addLot()"
                  [disabled]="!newLot.name || !newLot.donorName">
            <mat-icon>add</mat-icon>
            Ajouter
          </button>
        </div>

        <button mat-stroked-button color="accent" class="import-button" (click)="importLots()">
          <mat-icon>upload_file</mat-icon>
          Importer des lots
        </button>

        <table mat-table [dataSource]="lots" class="lots-table">
          <!-- Name Column -->
          <ng-container matColumnDef="name">
            <th mat-header-cell *matHeaderCellDef>Nom du lot</th>
            <td mat-cell *matCellDef="let lot">{{ lot.name }}</td>
          </ng-container>

          <!-- Description Column -->
          <ng-container matColumnDef="description">
            <th mat-header-cell *matHeaderCellDef>Description</th>
            <td mat-cell *matCellDef="let lot">{{ lot.description }}</td>
          </ng-container>

          <!-- Donor Column -->
          <ng-container matColumnDef="donor">
            <th mat-header-cell *matHeaderCellDef>Donateur</th>
            <td mat-cell *matCellDef="let lot">{{ lot.donorName }}</td>
          </ng-container>

          <!-- Status Column -->
          <ng-container matColumnDef="status">
            <th mat-header-cell *matHeaderCellDef>Statut</th>
            <td mat-cell *matCellDef="let lot" [class.assigned]="lot.status === 'ASSIGNED'">
              {{ lot.status }}
            </td>
          </ng-container>

          <!-- Actions Column -->
          <ng-container matColumnDef="actions">
            <th mat-header-cell *matHeaderCellDef></th>
            <td mat-cell *matCellDef="let lot">
              <button mat-icon-button color="warn" 
                      (click)="deleteLot(lot.id)"
                      [disabled]="lot.status === 'ASSIGNED'"
                      matTooltip="Supprimer le lot">
                <mat-icon>delete</mat-icon>
              </button>
            </td>
          </ng-container>

          <tr mat-header-row *matHeaderRowDef="displayedColumns"></tr>
          <tr mat-row *matRowDef="let row; columns: displayedColumns;"></tr>
        </table>
      </mat-card-content>
    </mat-card>
  `,
  styles: [`
    .prizes-card {
      margin: 20px 0;
      padding: 16px;
    }

    .prizes-icon {
      vertical-align: middle;
      margin-right: 8px;
      color: #ff4081;
    }

    .form-container {
      display: flex;
      flex-direction: column;
      gap: 16px;
      margin-bottom: 24px;
      max-width: 600px;
    }

    .actions-bar {
      display: flex;
      gap: 16px;
    }

    .lots-table {
      width: 100%;
    }

    th.mat-header-cell {
      background: #f5f5f5;
      padding: 16px;
      font-weight: bold;
      color: rgba(0, 0, 0, 0.87);
    }

    td.mat-cell {
      padding: 16px;
    }

    .assigned {
      color: #4caf50;
      font-weight: 500;
    }

    .inline-form {
      display: flex;
      gap: 16px;
      align-items: center;
      margin-bottom: 16px;
    }

    .inline-form mat-form-field {
      flex: 1;
    }

    .import-button {
      margin-bottom: 20px;
      display: block;
    }

    .mat-column-actions {
      width: 60px;
      text-align: center;
    }

    button[mat-icon-button] {
      opacity: 0.7;
      transition: opacity 0.2s;
    }

    button[mat-icon-button]:hover:not([disabled]) {
      opacity: 1;
    }

    button[mat-icon-button][disabled] {
      opacity: 0.3;
    }

    .required-field {
      .mat-form-field-label {
        color: inherit !important;
      }
    }

    :host ::ng-deep .mat-form-field-required-marker {
      display: none;
    }

    :host ::ng-deep .mat-form-field-invalid:not(.mat-focused) .mat-form-field-label {
      color: rgba(0, 0, 0, 0.6);
    }

    :host ::ng-deep .mat-form-field:not(.mat-focused):not(.mat-form-field-invalid) .mat-form-field-label {
      color: rgba(0, 0, 0, 0.6);
    }
  `]
})
export class PrizesComponent {
  @ViewChild('nameInput') nameInput!: NgModel;
  @ViewChild('donorInput') donorInput!: NgModel;
  @Input() tombolaId!: number;
  lots: any[] = [];
  displayedColumns: string[] = ['name', 'description', 'donor', 'status', 'actions'];
  newLot: NewLot = { 
    name: '', 
    description: '', 
    donorName: '' 
  };

  constructor(
    private api: ApiService,
    private cd: ChangeDetectorRef
  ) {}

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['tombolaId'] && this.tombolaId != null) {
      this.loadLots();
    }
  }

  loadLots(): void {
    if (this.tombolaId == null) return;
    this.api.getLotsForTombola(this.tombolaId).subscribe({
      next: (lots: any[]) => {
        this.lots = lots;
        this.cd.detectChanges();
      },
      error: (err: Error) => console.error('Error loading lots', err)
    });
  }

  addLot(): void {
    if (this.tombolaId == null) return;
    this.api.addLot(this.tombolaId, this.newLot).subscribe({
      next: () => {
        // Réinitialiser le formulaire et les états de validation
        this.newLot = { 
          name: '', 
          description: '', 
          donorName: '' 
        };
        // Réinitialiser l'état des champs
        if (this.nameInput) this.nameInput.control.markAsUntouched();
        if (this.donorInput) this.donorInput.control.markAsUntouched();
        this.loadLots();
      },
      error: (err: Error) => console.error('Error adding lot', err)
    });
  }

  importLots(): void {
    // TODO: Implémenter l'import des lots via Excel
    console.log('Import des lots à implémenter');
  }

  deleteLot(lotId: number): void {
    if (confirm('Êtes-vous sûr de vouloir supprimer ce lot ?')) {
      this.api.deleteLot(lotId).subscribe({
        next: () => {
          this.lots = this.lots.filter(lot => lot.id !== lotId);
          this.cd.detectChanges();
        },
        error: (err: Error) => console.error('Erreur lors de la suppression du lot', err)
      });
    }
  }
}
