import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatButtonModule } from '@angular/material/button';
import { ApiService } from '../../core/services/api.service';


@Component({
    selector: 'app-configuration',
    standalone: true,
    imports: [
      CommonModule,
      FormsModule,
      MatCardModule,
      MatFormFieldModule,
      MatInputModule,
      MatCheckboxModule,
      MatButtonModule,
    ],
    template: `
      <div class="config-container">
        <mat-card>
          <mat-card-title>⚙️ Configuration de la Tombola</mat-card-title>
          <mat-card-content *ngIf="config">
            <form (ngSubmit)="saveConfig()">
              <mat-form-field appearance="fill">
                <mat-label>Nombre de tickets par participant</mat-label>
                <input matInput type="number" [(ngModel)]="config.ticketsPerParticipant" name="ticketsPerParticipant" />
              </mat-form-field>
  
              <mat-checkbox [(ngModel)]="config.guaranteeOneLotPerParticipant" name="guaranteeOneLotPerParticipant">
                Garantir au moins un lot par participant
              </mat-checkbox>
  
              <button mat-raised-button color="primary" type="submit">
                Enregistrer
              </button>
            </form>
          </mat-card-content>
        </mat-card>
      </div>
    `,
    styles: [`
      .config-container {
        padding: 20px;
        max-width: 600px;
        margin: auto;
      }
      mat-form-field {
        width: 100%;
        margin-bottom: 16px;
      }
    `]
  })
  export class ConfigurationComponent {
    config: any = null;
  
    constructor(private apiService: ApiService) {
      this.loadConfig();
    }
  
    loadConfig(): void {
      this.apiService.getConfiguration().subscribe({
        next: (data) => this.config = data,
        error: (err) => console.error('Erreur chargement config', err)
      });
    }
  
    saveConfig(): void {
      this.apiService.updateConfiguration(this.config).subscribe({
        next: () => console.log('Configuration mise à jour'),
        error: (err) => console.error('Erreur maj config', err)
      });
    }
  }