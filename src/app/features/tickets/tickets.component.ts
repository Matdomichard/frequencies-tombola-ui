import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatListModule } from '@angular/material/list';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { ApiService } from '../../core/services/api.service';
import { Ticket } from '../../core/models/ticket.model';

@Component({
  selector: 'app-tickets',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatListModule,
    MatButtonModule,
    MatIconModule
  ],
  template: `
    <div class="tickets-container">
      <mat-card>
        <mat-card-header>
          <mat-card-title>🎟️ Gestion des Tickets</mat-card-title>
        </mat-card-header>
        <mat-card-content>
          <mat-list>
            <mat-list-item *ngFor="let ticket of tickets">
              <div class="ticket-info">
                <span>Ticket #{{ ticket.id }}</span>
                <span
                  [class.claimed]="ticket.claimed"
                  [style.color]="ticket.claimed ? '#d32f2f' : '#1976d2'"
                >
                  {{ ticket.claimed ? 'Réclamé' : 'Disponible' }}
                </span>
              </div>
              <button
                mat-icon-button
                color="primary"
                (click)="claimTicket(ticket.id)"
                [disabled]="ticket.claimed"
              >
                <mat-icon>done</mat-icon>
              </button>
            </mat-list-item>
          </mat-list>
        </mat-card-content>
      </mat-card>
    </div>
  `,
  styles: [`
    .tickets-container {
      padding: 20px;
    }

    .ticket-info {
      display: flex;
      justify-content: space-between;
      width: 100%;
      padding-right: 16px;
    }

    .claimed {
      font-weight: bold;
    }
  `]
})
export class TicketsComponent {
  tickets: Ticket[] = [];

  constructor(private apiService: ApiService) {
    this.loadTickets();
  }

  loadTickets(): void {
    this.apiService.getTickets().subscribe({
      next: (data) => this.tickets = data,
      error: (err) => console.error('Erreur chargement tickets', err)
    });
  }

  claimTicket(id: number): void {
    this.apiService.claimTicket(id).subscribe({
      next: () => this.loadTickets(),
      error: (err) => console.error('Erreur réclamation ticket', err)
    });
  }
}
