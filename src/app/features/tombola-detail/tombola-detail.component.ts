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
import { PrizesComponent }   from '../prizes/prizes.component';
import { DrawResult }        from '../../core/models/draw-result.model';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { DrawComponent } from '../draw/draw.component';

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
    MatSlideToggleModule,
    FormsModule,
    PrizesComponent,
    DrawComponent  // Ajout du DrawComponent
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  template: `
    <div class="container">
      <mat-card *ngIf="tombola" class="tombola-card">
        <div class="tombola-header">
          <h1 class="tombola-title">{{ tombola.name }}</h1>
          <p class="tombola-subtitle">
            <strong>Créée le:</strong> {{ tombola.createdAt | date:'medium' }}
          </p>
        </div>
        <mat-card-content class="draw-content">
          <div class="draw-container">
            <mat-slide-toggle
              [(ngModel)]="guaranteeOneLotPerParticipant"
              color="primary"
              class="guarantee-toggle">
              Garantir un lot par participant
            </mat-slide-toggle>
            
            <!-- Remplacer le bouton par le composant de tirage -->
            <app-draw 
              *ngIf="isDrawing"
              [tombolaId]="tombola.id"
              (drawComplete)="onDrawComplete($event)">
            </app-draw>
            
            <button mat-raised-button color="primary"
                    *ngIf="!isDrawing"
                    (click)="startDraw()" 
                    class="draw-button">
              🎲 Lancer le tirage
            </button>
          </div>
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

            <!-- Après la colonne email, ajouter : -->
            <ng-container matColumnDef="ticketNumber">
              <th mat-header-cell *matHeaderCellDef> Tickets</th>
              <td mat-cell *matCellDef="let p">{{ p.ticketNumber || 'Non attribué' }}</td>
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
                  </mat-chip>
                </mat-chip-list>
                <span *ngIf="!p.assignedLots?.length" class="no-lots">Aucun lot</span>
              </td>
            </ng-container>
            <ng-container matColumnDef="paymentMethod">
  <th mat-header-cell *matHeaderCellDef>Méthode de paiement</th>
  <td mat-cell *matCellDef="let p">
  {{ p.paymentMethod?.toLowerCase() === 'card' ? 'Carte' : 'Espèces' }}
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
      padding: 32px;
      background: linear-gradient(135deg, #ffffff, #f8f9fa);
      border-radius: 12px;
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
    }

    .tombola-header {
      text-align: center;
      margin-bottom: 16px;  // Réduit de 32px à 16px
    }

    .tombola-title {
      font-size: 3rem;
      font-weight: 700;
      color: #2c3e50;
      margin: 0 0 16px 0;
      text-transform: uppercase;
      letter-spacing: 2px;
      line-height: 1.2;
    }

    .tombola-subtitle {
      font-size: 1.1rem;
      color: #6c757d;
      margin: 0;
    }

    .draw-content {
      padding: 0;
      margin-top: 20px;
    }

    .draw-container {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 16px;  
      padding: 14px;
      background-color: #f8f9fa;
      border-radius: 12px;
    }

    .guarantee-toggle {
      font-size: 1.1rem;
      border-radius: 8px;
      margin-bottom: 0;  
    }


    .draw-button {
      padding: 16px 48px;
      font-size: 1.2rem;
      font-weight: 500;
      border-radius: 8px;
      transition: all 0.3s ease;
      text-transform: uppercase;
      letter-spacing: 1px;
      box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
    }

    .draw-button:not([disabled]):hover {
      transform: translateY(-2px);
      box-shadow: 0 6px 12px rgba(0, 0, 0, 0.15);
    }

    .draw-button:not([disabled]):active {
      transform: translateY(0);
      box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
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

    .draw-options {
      margin-bottom: 20px;
    }
  `]
})
export class TombolaDetailComponent implements OnInit {
  tombola?: Tombola;
  players: Player[] = [];
  columns = ['player', 'email', 'ticketNumber', 'paymentMethod', 'lots', 'collected'];
  isDrawing = false;

  constructor(
    private api: ApiService,
    private route: ActivatedRoute,
    private router: Router
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
      console.log('Joueurs récupérés:', players);
      console.log('Joueurs payant en espèces:', players.filter(p => p.paymentMethod === 'cash'));
      this.players = players;
    });
  }

  guaranteeOneLotPerParticipant = false;

  draw(): void {
    console.log('%c🎲 DÉBUT TIRAGE', 'background: #2196f3; color: white; padding: 2px 5px; border-radius: 2px');
    if (!this.tombola) {
      console.log('Pas de tombola trouvée');
      return;
    }
    
    // Rediriger vers le composant de tirage
    this.router.navigate(['/tombolas', this.tombola.id, 'draw'], {
      queryParams: {
        guarantee: this.guaranteeOneLotPerParticipant
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

  startDraw(): void {
    this.isDrawing = true;
  }

  onDrawComplete(result: any): void {
    this.isDrawing = false;
    this.refreshTombolaData();
  }

  // Supprimer l'ancienne méthode draw()
}
