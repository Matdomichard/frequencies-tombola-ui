// features/tombola-detail/tombola-detail.component.ts
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { ApiService } from '../../core/services/api.service';
import { Tombola } from '../../core/models/tombola.model';
import { Player } from '../../core/models/player.model';


@Component({
  selector: 'app-tombola-detail',
  standalone: true,
  imports: [CommonModule, MatCardModule],
  template: `
    <mat-card *ngIf="tombola">
      <mat-card-title>{{ tombola.name }}</mat-card-title>
      <mat-card-content>
        <p><strong>Created at:</strong> {{ tombola.createdAt | date:'fullDate' }}</p>
        <p><strong>Form slug:</strong> {{ tombola.helloAssoFormSlug || '—' }}</p>
        <p><strong>Status:</strong> {{ tombola.active ? 'ACTIVE' : 'INACTIVE' }}</p>

        <h3>Players</h3>
        <ul>
          <li *ngFor="let p of players">
            {{ p.firstName }} {{ p.lastName }} — {{ p.email }}
          </li>
        </ul>
      </mat-card-content>
    </mat-card>
  `,
})
export class TombolaDetailComponent implements OnInit {
  tombola: Tombola | null = null;
  players: Player[] = [];

  constructor(
    private api: ApiService,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    this.api.getTombola(id).subscribe({
      next: t => this.tombola = t,
      error: e => console.error('Error loading tombola', e)
    });
    this.api.getPlayers(id).subscribe({
      next: pl => this.players = pl,
      error: e => console.error('Error loading players', e)
    });
  }
}
