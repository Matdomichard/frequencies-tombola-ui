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
import * as XLSX from 'xlsx';

import { Lot } from '../../core/models/lot.model';

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
            <mat-label>Nom du lot*</mat-label>
            <input matInput [(ngModel)]="newLot.name">
          </mat-form-field>
          <mat-form-field appearance="outline">
            <mat-label>Prénom du donateur</mat-label>
            <input matInput [(ngModel)]="newLot.donorFirstName">
          </mat-form-field>
          <mat-form-field appearance="outline">
            <mat-label>Nom du donateur</mat-label>
            <input matInput [(ngModel)]="newLot.donorLastName">
          </mat-form-field>
          <mat-form-field appearance="outline">
            <mat-label>Entreprise</mat-label>
            <input matInput [(ngModel)]="newLot.donorCompany">
          </mat-form-field>
          <mat-form-field appearance="outline">
            <mat-label>Email*</mat-label>
            <input matInput [(ngModel)]="newLot.donorEmail" type="email">
          </mat-form-field>
          <mat-form-field appearance="outline">
            <mat-label>Téléphone (optionnel)</mat-label>
            <input matInput [(ngModel)]="newLot.donorPhone">
          </mat-form-field>
          <button mat-raised-button color="primary"
                  (click)="addLot()"
                  class="add-lot-btn"
                  [disabled]="!canAddLot()">
            <mat-icon>add</mat-icon>
            Ajouter
          </button>
        </div>
        <!-- Import Excel -->
        <input
          type="file"
          accept=".xlsx"
          style="display:none"
          #excelInput
          (change)="onExcelFileSelected($event)"
        />
        <button mat-stroked-button color="accent" class="import-button" (click)="excelInput.click()">
          <mat-icon>upload_file</mat-icon>
          Importer des lots (.xlsx)
        </button>
        <table mat-table [dataSource]="lots" class="lots-table">
          <ng-container matColumnDef="name">
            <th mat-header-cell *matHeaderCellDef>Nom du lot</th>
            <td mat-cell *matCellDef="let lot">{{ lot.name }}</td>
          </ng-container>
          <ng-container matColumnDef="donorFirstName">
            <th mat-header-cell *matHeaderCellDef>Prénom</th>
            <td mat-cell *matCellDef="let lot">{{ lot.donorFirstName }}</td>
          </ng-container>
          <ng-container matColumnDef="donorLastName">
            <th mat-header-cell *matHeaderCellDef>Nom</th>
            <td mat-cell *matCellDef="let lot">{{ lot.donorLastName }}</td>
          </ng-container>
          <ng-container matColumnDef="donorCompany">
            <th mat-header-cell *matHeaderCellDef>Entreprise</th>
            <td mat-cell *matCellDef="let lot">{{ lot.donorCompany }}</td>
          </ng-container>
          <ng-container matColumnDef="donorEmail">
            <th mat-header-cell *matHeaderCellDef>Email</th>
            <td mat-cell *matCellDef="let lot">{{ lot.donorEmail }}</td>
          </ng-container>
          <ng-container matColumnDef="donorPhone">
            <th mat-header-cell *matHeaderCellDef>Téléphone</th>
            <td mat-cell *matCellDef="let lot">{{ lot.donorPhone }}</td>
          </ng-container>
          <ng-container matColumnDef="status">
            <th mat-header-cell *matHeaderCellDef>Statut</th>
            <td mat-cell *matCellDef="let lot" [class.assigned]="lot.status === 'ASSIGNED'">
              {{ lot.status }}
            </td>
          </ng-container>
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
    .lots-table {
      width: 100%;
    }
    .inline-form {
      display: flex;
      gap: 12px;
      align-items: center;
      margin-bottom: 16px;
      flex-wrap: wrap;
    }
    .inline-form mat-form-field {
      flex: 1 1 180px;
      min-width: 150px;
      max-width: 240px;
      margin: 0;
    }
    .add-lot-btn {
      margin-left: 8px;
      height: 40px;
    }
    .import-button {
      margin-bottom: 20px;
      display: block;
    }
    .assigned {
      color: #4caf50;
      font-weight: 500;
    }
  `]
})
export class PrizesComponent {
  @ViewChild('nameInput') nameInput!: NgModel;
  @Input() tombolaId!: number;
  lots: Lot[] = [];
  displayedColumns: string[] = [
    'name', 'donorFirstName', 'donorLastName', 'donorCompany', 'donorEmail', 'donorPhone', 'status', 'actions'
  ];
  newLot: Partial<Lot> = {
    name: '',
    donorFirstName: '',
    donorLastName: '',
    donorCompany: '',
    donorEmail: '',
    donorPhone: ''
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
      next: (lots: Lot[]) => {
        this.lots = lots;
        this.cd.detectChanges();
      },
      error: (err: Error) => console.error('Error loading lots', err)
    });
  }

  canAddLot(): boolean {
    return !!(this.newLot.name && this.newLot.donorEmail);
  }

  addLot(): void {
    if (this.tombolaId == null || !this.canAddLot()) return;
    this.api.addLot(this.tombolaId, this.newLot).subscribe({
      next: () => {
        this.newLot = {
          name: '',
          donorFirstName: '',
          donorLastName: '',
          donorCompany: '',
          donorEmail: '',
          donorPhone: ''
        };
        if (this.nameInput) this.nameInput.control.markAsUntouched();
        this.loadLots();
      },
      error: (err: Error) => console.error('Error adding lot', err)
    });
  }

  onExcelFileSelected(event: any): void {
    const file = event.target.files[0];
    if (!file) return;
    const reader = new FileReader();

    reader.onload = (e: any) => {
      const data = new Uint8Array(e.target.result);
      const workbook = XLSX.read(data, { type: 'array' });
      const sheetName = workbook.SheetNames[0];
      const worksheet = workbook.Sheets[sheetName];

      const lotsFromExcel = XLSX.utils.sheet_to_json(worksheet, { defval: '' });
      // Mapping adapté au fichier fourni
      const mappedLots: Partial<Lot>[] = lotsFromExcel.map((row: any) => ({
        name: row['Nom du lot']?.trim() || '',
        donorFirstName: row['Prénom du donateur']?.trim() || '',
        donorLastName: row['Nom du donateur']?.trim() || '',
        donorCompany: row['Entreprise']?.trim() || '',
        donorEmail: row['Email']?.trim() || '',
        donorPhone: row['Téléphone']?.trim() || ''
      }));

      let createdCount = 0;
      const importNext = (index: number) => {
        if (index >= mappedLots.length) {
          this.loadLots();
          alert(`Import terminé. ${createdCount} lots créés.`);
          return;
        }
        const lot = mappedLots[index];
        if (!lot.name || !lot.donorEmail) {
          importNext(index + 1);
          return;
        }
        this.api.addLot(this.tombolaId, lot).subscribe({
          next: () => {
            createdCount++;
            importNext(index + 1);
          },
          error: (err: Error) => {
            console.error(`Erreur import lot: ${lot.name}`, err);
            importNext(index + 1);
          }
        });
      };
      importNext(0);
    };

    reader.readAsArrayBuffer(file);
    event.target.value = '';
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
