import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { Router } from '@angular/router';
import { ApiService } from '../../core/services/api.service';
import { Tombola } from '../../core/models/tombola.model';
import { HelloAssoForm } from '../../core/models/hello-asso-form.model';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, MatCardModule, MatIconModule, MatButtonModule],
  template: `
    <div class="dashboard">
      <mat-card>
        <mat-card-title>🎯 Tombolas en base de données</mat-card-title>
        <mat-card-content>
          <div *ngIf="tombolas.length === 0">Aucune tombola enregistrée.</div>
          <div *ngFor="let tombola of tombolas">
            <mat-card class="tombola-card">
              <mat-card-title>{{ tombola.name }}</mat-card-title>
              <mat-card-subtitle>{{ tombola.createdAt | date:'shortDate' }}</mat-card-subtitle>
              <button mat-raised-button color="primary" (click)="selectTombola(tombola)">
                Voir détails
              </button>
              <span *ngIf="tombola.helloAssoFormSlug" class="active-badge">LINKED</span>
            </mat-card>
          </div>
        </mat-card-content>
      </mat-card>

      <mat-card>
        <mat-card-title>📥 Formulaires HelloAsso disponibles</mat-card-title>
        <mat-card-content>
          <div *ngIf="helloAssoForms.length === 0">Aucun formulaire HelloAsso disponible.</div>
          <div *ngFor="let form of helloAssoForms">
            <mat-card class="tombola-card">
              <mat-card-title>{{ form.title }}</mat-card-title>
              <mat-card-subtitle>{{ form.formType }} - {{ form.state }}</mat-card-subtitle>
              <a [href]="form.url" target="_blank">Ouvrir sur HelloAsso</a>
              <div>Créé le : {{ form.meta.createdAt | date:'short' }}</div>
              <button mat-raised-button color="accent" (click)="createTombolaFromForm(form)">
                Créer une tombola à partir de ce formulaire
              </button>
            </mat-card>
          </div>
        </mat-card-content>
      </mat-card>
    </div>
  `,
  styles: [`
    .dashboard { padding: 20px; }
    mat-card { max-width: 600px; margin: auto; margin-bottom: 20px; }
    .active-badge { color: green; font-weight: bold; margin-left: 10px; }
    .tombola-card { margin-bottom: 10px; }
  `]
})
export class DashboardComponent implements OnInit {
  tombolas: Tombola[] = [];
  helloAssoForms: HelloAssoForm[] = [];

  constructor(
    private apiService: ApiService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.apiService.getTombolas().subscribe({
      next: (data: Tombola[]) => this.tombolas = data,
      error: (err: any) => console.error('Erreur chargement tombolas', err)
    });

    this.apiService.getHelloAssoForms().subscribe({
      next: (forms: HelloAssoForm[]) => this.helloAssoForms = forms,
      error: (err: any) => console.error('Error loading HelloAsso forms', err)
    });
  }

  selectTombola(tombola: Tombola): void {
    console.log('Tombola sélectionnée:', tombola);
    this.router.navigate(['/tombolas', tombola.id]);
  }

  createTombolaFromForm(form: HelloAssoForm): void {
    const newTombola = {
      name: form.title,
      helloAssoFormSlug: form.formSlug
    };

    this.apiService.createTombola(newTombola).subscribe({
      next: (saved: Tombola) => {
        console.log('Tombola créée depuis HelloAsso', saved);
        this.tombolas.push(saved);
      },
      error: (err: any) => console.error('Erreur création tombola', err)
    });
  }
}
