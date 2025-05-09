import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule, MatDialog } from '@angular/material/dialog';
import { MatTableModule } from '@angular/material/table';
import { Router } from '@angular/router';
import { ApiService } from '../../core/services/api.service';
import { Tombola } from '../../core/models/tombola.model';
import { HelloAssoForm } from '../../core/models/hello-asso-form.model';
import { ConfirmDialogComponent } from '../../shared/components/confirm-dialog/confirm-dialog.component';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    CommonModule, 
    MatCardModule, 
    MatIconModule, 
    MatButtonModule,
    MatDialogModule,
    MatTableModule
  ],
  template: `
    <div class="dashboard-container">
      <header class="welcome-header">
        <h1>🎉 Bienvenue sur la Tombola Frequencies</h1>
        <p class="subtitle">Gérez vos tombolas associatives en toute simplicité</p>
      </header>

      <div class="dashboard-grid">
        <mat-card class="dashboard-card tombolas-card">
          <mat-card-header>
            <mat-card-title>
              <div class="card-title">
                <mat-icon>emoji_events</mat-icon>
                Tombolas enregistrées
              </div>
            </mat-card-title>
          </mat-card-header>
          <mat-card-content>
            <div *ngIf="tombolas.length === 0" class="empty-state">
              <mat-icon>info</mat-icon>
              <p>Aucune tombola n'est enregistrée pour le moment</p>
            </div>
            <div *ngFor="let tombola of tombolas" class="tombola-item">
              <mat-card class="inner-card">
                <div class="tombola-content">
                  <div class="tombola-info">
                    <h3>{{ tombola.name }}</h3>
                    <p class="date">Créée le {{ tombola.createdAt | date:'shortDate' }}</p>
                  </div>
                  <button mat-raised-button color="primary" (click)="selectTombola(tombola)">
                    <mat-icon>visibility</mat-icon>
                    Voir détails
                  </button>
                </div>
              </mat-card>
            </div>
          </mat-card-content>
        </mat-card>

        <mat-card class="dashboard-card forms-card">
          <mat-card-header>
            <mat-card-title>
              <div class="card-title">
                <mat-icon>description</mat-icon>
                Formulaires HelloAsso disponibles
              </div>
            </mat-card-title>
          </mat-card-header>
          <mat-card-content>
            <div *ngIf="helloAssoForms.length === 0" class="empty-state">
              <mat-icon>info</mat-icon>
              <p>Aucun formulaire HelloAsso disponible</p>
            </div>
            <div *ngFor="let form of helloAssoForms" class="form-item">
              <mat-card class="inner-card">
                <div class="form-content">
                  <div class="form-info">
                    <h3>{{ form.title }}</h3>
                    <p class="type-badge">{{ form.formType }} - {{ form.state }}</p>
                    <p class="date">Créé le {{ form.meta.createdAt | date:'short' }}</p>
                    <a [href]="form.url" target="_blank" class="helloasso-link">
                      <mat-icon>open_in_new</mat-icon>
                      Voir sur HelloAsso
                    </a>
                  </div>
                  <button mat-raised-button color="accent" (click)="createTombolaFromForm(form)">
                    <mat-icon>add_circle</mat-icon>
                    Créer une tombola
                  </button>
                </div>
              </mat-card>
            </div>
          </mat-card-content>
        </mat-card>
      </div>
    </div>
  `,
  styles: [`
    .dashboard-container {
      padding: 2rem;
      max-width: 1200px;
      margin: 0 auto;
    }

    .welcome-header {
      text-align: center;
      margin-bottom: 2rem;
      color: #333;
    }

    .welcome-header h1 {
      font-size: 2.5rem;
      margin-bottom: 0.5rem;
      font-weight: 300;
    }

    .subtitle {
      font-size: 1.2rem;
      color: #666;
      margin: 0;
    }

    .dashboard-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
      gap: 2rem;
    }

    .dashboard-card {
      height: 100%;
      border-radius: 12px;
      box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1) !important;
    }

    .card-title {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      font-size: 1.25rem;
      color: #333;
    }

    .empty-state {
      text-align: center;
      padding: 2rem;
      color: #666;
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 1rem;
    }

    .empty-state mat-icon {
      font-size: 3rem;
      width: 3rem;
      height: 3rem;
      color: #ccc;
    }

    .inner-card {
      margin-bottom: 1rem;
      border-radius: 8px;
      background: #f8f9fa;
      transition: transform 0.2s, box-shadow 0.2s;
    }

    .inner-card:hover {
      transform: translateY(-2px);
      box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
    }

    .tombola-content, .form-content {
      padding: 1rem;
      display: flex;
      justify-content: space-between;
      align-items: center;
    }

    .tombola-info h3, .form-info h3 {
      margin: 0;
      color: #333;
      font-size: 1.1rem;
    }

    .date {
      color: #666;
      font-size: 0.9rem;
      margin: 0.5rem 0;
    }

    .type-badge {
      display: inline-block;
      background: #e3f2fd;
      color: #1976d2;
      padding: 0.25rem 0.5rem;
      border-radius: 4px;
      font-size: 0.9rem;
      margin: 0.5rem 0;
    }

    .helloasso-link {
      display: flex;
      align-items: center;
      gap: 0.25rem;
      color: #1976d2;
      text-decoration: none;
      font-size: 0.9rem;
    }

    .helloasso-link:hover {
      text-decoration: underline;
    }

    button mat-icon {
      margin-right: 0.5rem;
    }
  `]
})
export class DashboardComponent implements OnInit {
  tombolas: Tombola[] = [];
  helloAssoForms: HelloAssoForm[] = [];
  lots: any[] = [];  // Ajoutez le type approprié selon votre modèle
  displayedColumns: string[] = ['name', 'description', 'donor', 'actions'];

  constructor(
    private api: ApiService,
    private router: Router,
    private dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.loadTombolas();
    this.loadHelloAssoForms();
  }

  loadTombolas(): void {
    this.api.getTombolas().subscribe({
      next: (data) => this.tombolas = data,
      error: (err) => console.error('Error loading tombolas', err)
    });
  }

  loadHelloAssoForms(): void {
    this.api.getHelloAssoForms().subscribe({
      next: (data) => this.helloAssoForms = data,
      error: (err) => console.error('Error loading HelloAsso forms', err)
    });
  }

  selectTombola(tombola: Tombola): void {
    this.router.navigate(['/tombolas', tombola.id]);
  }

  createTombolaFromForm(form: HelloAssoForm): void {
    const newTombola: Partial<Tombola> = {
      name: form.title,
      helloAssoFormSlug: form.formSlug
    };

    this.api.createTombola(newTombola).subscribe({
      next: (saved) => {
        this.tombolas.push(saved);
        this.router.navigate(['/tombolas', saved.id]);
      },
      error: (err) => console.error('Error creating tombola', err)
    });
  }

  deleteTombola(tombola: Tombola): void {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      data: {
        title: 'Confirmation de suppression',
        message: `Êtes-vous sûr de vouloir supprimer la tombola "${tombola.name}" ? Cette action est irréversible.`
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.api.deleteTombola(tombola.id).subscribe({
          next: () => {
            this.tombolas = this.tombolas.filter(t => t.id !== tombola.id);
          },
          error: (err: any) => console.error('Erreur lors de la suppression de la tombola', err)
        });
      }
    });
  }
}
