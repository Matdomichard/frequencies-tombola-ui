// src/app/features/tombola-detail/tombola-detail.component.ts
import { Component, OnInit, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { MatChipsModule } from '@angular/material/chips';
import { ActivatedRoute }    from '@angular/router';
import { CommonModule }      from '@angular/common';
import { MatCardModule }     from '@angular/material/card';
import { MatTableModule }    from '@angular/material/table';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatButtonModule }   from '@angular/material/button';
import { ApiService }        from '../../core/services/api.service';
import { Tombola }           from '../../core/models/tombola.model';
import { Player }            from '../../core/models/player.model';
import { Lot }               from '../../core/models/lot.model';
import { PrizesComponent }   from '../prizes/prizes.component';
import { DrawResult }        from '../../core/models/draw-result.model';

@Component({
  selector: 'app-tombola-detail',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatTableModule,
    MatCheckboxModule,
    MatButtonModule,
    MatChipsModule,
    PrizesComponent
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  template: `
    <div class="container">
      <mat-card *ngIf="tombola" class="tombola-card">
        <mat-card-header>
          <mat-card-title class="text-center">{{ tombola.name }}</mat-card-title>
          <mat-card-subtitle class="text-center">
            <strong>Créée le:</strong> {{ tombola.createdAt | date:'medium' }}
          </mat-card-subtitle>
        </mat-card-header>
        <mat-card-content class="text-center">
          <button mat-raised-button color="primary"
                  (click)="draw()" 
                  [disabled]="isDrawing">
            🎲 Tirage au sort
          </button>
        </mat-card-content>
      </mat-card>

      <mat-card *ngIf="players.length" class="players-card">
        <mat-card-header>
          <mat-card-title>
            👥  Participants 
          </mat-card-title>
        </mat-card-header>
        
        <mat-card-content>
          <table mat-table [dataSource]="players"
                 class="mat-elevation-z8 players-table">
            <!-- Player Name -->
            <ng-container matColumnDef="player">
              <th mat-header-cell *matHeaderCellDef>Participant</th>
              <td mat-cell *matCellDef="let p">{{ p.firstName }} {{ p.lastName }}</td>
            </ng-container>

            <!-- Email -->
            <ng-container matColumnDef="email">
              <th mat-header-cell *matHeaderCellDef>Email</th>
              <td mat-cell *matCellDef="let p">{{ p.email }}</td>
            </ng-container>

            <!-- Lots -->
            <ng-container matColumnDef="lots">
              <th mat-header-cell *matHeaderCellDef>Lots gagnés</th>
              <td mat-cell *matCellDef="let p">
                <mat-chip-list *ngIf="p.assignedLots?.length">
                  <mat-chip *ngFor="let lot of p.assignedLots" 
                           [color]="lot.status === 'ASSIGNED' ? 'primary' : 'accent'"
                           [selected]="true">
                    {{ lot.name }}
                    <small class="lot-status">[{{ lot.status }}]</small>
                  </mat-chip>
                </mat-chip-list>
                <span *ngIf="!p.assignedLots?.length" class="no-lots">Aucun lot</span>
              </td>
            </ng-container>

            <!-- Collected -->
            <ng-container matColumnDef="collected">
              <th mat-header-cell *matHeaderCellDef>Collecté ?</th>
              <td mat-cell *matCellDef="let p">
                <mat-checkbox
                  [checked]="p.hasCollectedPrize"
                  (change)="toggleCollected(p)"
                  color="primary">
                </mat-checkbox>
              </td>
            </ng-container>

            <tr mat-header-row *matHeaderRowDef="columns"></tr>
            <tr mat-row *matRowDef="let row; columns: columns"></tr>
          </table>
        </mat-card-content>
      </mat-card>

      <app-prizes *ngIf="tombola && !isDrawing"
                  [tombolaId]="tombola.id"
                  class="prizes-section">
      </app-prizes>
    </div>
  `,
  styles: [`
    .container {
      padding: 20px;
      max-width: 1200px;
      margin: 0 auto;
    }

    .tombola-card {
      margin-bottom: 30px;
    }

    .text-center {
      text-align: center;
    }

    mat-card-header {
      justify-content: center;
    }

    .players-table {
      width: 100%;
      margin-bottom: 30px;
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

    .lot-status {
      margin-left: 4px;
      opacity: 0.7;
    }

    .no-lots {
      color: rgba(0, 0, 0, 0.54);
      font-style: italic;
    }

    mat-chip-list {
      display: inline-block;
    }

    mat-chip {
      margin: 4px;
    }

    .prizes-section {
      margin-top: 30px;
    }

    .players-icon {
      vertical-align: middle;
      margin-right: 8px;
      color: #2196f3;
    }

    .players-card {
      margin-bottom: 30px;
    }
  `]
})
export class TombolaDetailComponent implements OnInit {
  tombola?: Tombola;
  players: Player[] = [];
  columns = ['player', 'email', 'lots', 'collected'];
  isDrawing = false;

  constructor(
    private api: ApiService,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    this.loadAll(id);
  }

  private loadAll(id: number) {
    this.api.getTombola(id).subscribe(t => {
      this.tombola = t;
      this.refreshTombolaData();
    });
  }

  private refreshTombolaData() {
    if (!this.tombola) return;
    this.api.getPlayers(this.tombola.id).subscribe(players => {
      this.players = players;
    });
  }

  draw(): void {
    console.log('Début de la fonction draw');
    if (!this.tombola) {
      console.log('Pas de tombola trouvée');
      return;
    }
    
    console.log('Tombola ID:', this.tombola.id);
    this.isDrawing = true;

    this.api.draw(this.tombola.id).subscribe({
      next: (res: DrawResult) => {
        console.log('Résultat du tirage reçu:', res);
        if (res.players) {
          this.players = res.players;
          console.log('Joueurs mis à jour:', this.players.length);
        } else {
          console.error('Réponse invalide du serveur:', res);
        }
        this.isDrawing = false;
      },
      error: (err) => {
        console.error('Erreur lors du tirage:', err);
        this.isDrawing = false;
      }
    });
  }

  toggleCollected(p: Player): void {
    if (!p.assignedLots.length) return;
    const hasCollectedPrize = !p.hasCollectedPrize;
    // Mettre à jour le statut du joueur
    this.api.patchParticipant(p.id, { hasCollectedPrize })
      .subscribe((updated: Player) => {
        p.hasCollectedPrize = updated.hasCollectedPrize;
      });
  }
}
