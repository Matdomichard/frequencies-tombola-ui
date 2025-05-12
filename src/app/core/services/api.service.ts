import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { Ticket } from '../models/ticket.model';
import { Statistics } from '../models/statistics.model';
import { Tombola } from '../models/tombola.model';
import { Player } from '../models/player.model';
import { HelloAssoForm } from '../models/hello-asso-form.model';
import { Lot } from '../models/lot.model';
import { DrawResult } from '../models/draw-result.model';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  private apiUrl = environment.apiEndpoint;

  constructor(private http: HttpClient) {}

  // 🎟️ TICKETS

  /** GET all tickets */
  getTickets(): Observable<Ticket[]> {
    return this.http.get<Ticket[]>(`${this.apiUrl}/tickets`);
  }

  /** Mark a ticket as claimed */
  claimTicket(ticketId: number): Observable<void> {
    return this.http.put<void>(`${this.apiUrl}/tickets/${ticketId}/claim`, {});
  }

  /** Mark a ticket as winner */
  markTicketAsWinner(ticketId: number): Observable<void> {
    return this.http.put<void>(`${this.apiUrl}/tickets/${ticketId}/winner`, {});
  }

  /** GET all winners */
  getWinners(): Observable<Ticket[]> {
    return this.http.get<Ticket[]>(`${this.apiUrl}/tickets/winners`);
  }

  /** GET one ticket */
  getTicketById(id: number): Observable<Ticket> {
    return this.http.get<Ticket>(`${this.apiUrl}/tickets/${id}`);
  }

  /** GET tickets by player */
  getTicketsByPlayer(playerId: number): Observable<Ticket[]> {
    return this.http.get<Ticket[]>(`${this.apiUrl}/tickets/player/${playerId}`);
  }

  /** CREATE a ticket */
  createTicket(data: any): Observable<Ticket> {
    return this.http.post<Ticket>(`${this.apiUrl}/tickets`, data);
  }

  // 👥 PLAYERS (Participants)

  /** GET all players */
  getParticipants(): Observable<Player[]> {
    return this.http.get<Player[]>(`${this.apiUrl}/players`);
  }

  /** GET one player */
  getParticipant(id: number): Observable<Player> {
    return this.http.get<Player>(`${this.apiUrl}/players/${id}`);
  }

  /** CREATE a participant in a tombola */
  addParticipant(tombolaId: number, player: Player): Observable<Player> {
    return this.http.post<Player>(
      `${this.apiUrl}/tombolas/${tombolaId}/players`,
      player
    );
  }

  /** UPDATE a participant fully */
  updateParticipant(id: number, data: Player): Observable<Player> {
    return this.http.put<Player>(`${this.apiUrl}/players/${id}`, data);
  }

  /** PATCH a participant partially */
  patchParticipant(id: number, changes: Partial<Player>): Observable<Player> {
    return this.http.patch<Player>(`${this.apiUrl}/players/${id}`, changes);
  }

  /** DELETE a participant */
  deleteParticipant(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/players/${id}`);
  }

  // 🌀 DRAW (lottery)

  /** Trigger a draw for a specific tombola */
/** Trigger a draw and get back updated players+lots */
draw(tombolaId: number, guaranteeOneLotPerParticipant: boolean = false): Observable<DrawResult> {
  console.log(`Appel API draw avec tombolaId=${tombolaId} et guarantee=${guaranteeOneLotPerParticipant}`);
  return this.http.post<DrawResult>(
    `${this.apiUrl}/tombolas/${tombolaId}/draw?guaranteeOneLotPerParticipant=${guaranteeOneLotPerParticipant}`,
    {}
  ).pipe(
    map(result => {
      console.log('Réponse brute du serveur:', result);
      // S'assurer que les lots sont correctement associés aux joueurs
      if (result.players) {
        result.players = result.players.map(player => ({
          ...player,
          assignedLots: result.lots?.filter(lot => lot.assignedToId === player.id) || []
        }));
      }
      console.log('Réponse transformée:', result);
      return result;
    })
  );
}


  // 📊 STATISTICS

  /** GET global statistics */
  getStatistics(): Observable<Statistics> {
    return this.http.get<Statistics>(`${this.apiUrl}/stats`);
  }

  // ▶️ HELLOASSO FORMS
  /** GET HelloAsso forms (unwrap `{ data: [...] }` envelope) */
  getHelloAssoForms(): Observable<HelloAssoForm[]> {
    return this.http
      .get<{ data: HelloAssoForm[] }>(`${this.apiUrl}/helloasso/forms`)
      .pipe(map(resp => resp.data || []));
  }

  // ▶️ TOMBOLAS

  /** GET all tombolas */
  getTombolas(): Observable<Tombola[]> {
    return this.http.get<Tombola[]>(`${this.apiUrl}/tombolas`);
  }

  /** GET one tombola */
  getTombola(id: number): Observable<Tombola> {
    return this.http.get<Tombola>(`${this.apiUrl}/tombolas/${id}`);
  }

  /** CREATE new tombola */
  createTombola(data: Partial<Tombola>): Observable<Tombola> {
    return this.http.post<Tombola>(`${this.apiUrl}/tombolas`, data);
  }

  // ▶️ PLAYERS FOR A TOMBOLA

  /** GET players of a specific tombola */
  getPlayers(tombolaId: number): Observable<Player[]> {
    return this.http
      .get<Player[] | { data: Player[] }>(
        `${this.apiUrl}/tombolas/${tombolaId}/players`
      )
      .pipe(map(resp => Array.isArray(resp) ? resp : (resp.data || [])));
  }

  // 🎁 LOTS (Prizes)

  /** GET all lots globally */
  getLots(): Observable<Lot[]> {
    return this.http.get<Lot[]>(`${this.apiUrl}/lots`);
  }

  /** GET a single lot globally */
  getLot(id: number): Observable<Lot> {
    return this.http.get<Lot>(`${this.apiUrl}/lots/${id}`);
  }

  /** CREATE a lot globally (not tied to a tombola) */
  addGlobalLot(lot: Partial<Lot>): Observable<Lot> {
    return this.http.post<Lot>(`${this.apiUrl}/lots`, lot);
  }

  /** UPDATE a lot globally */
  updateGlobalLot(id: number, data: Partial<Lot>): Observable<Lot> {
    return this.http.put<Lot>(`${this.apiUrl}/lots/${id}`, data);
  }

  /** DELETE a lot globally */
  deleteLot(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/lots/${id}`);
  }

  // ▶️ LOTS FOR A SPECIFIC TOMBOLA

  /** GET lots under a specific tombola */
  getLotsForTombola(tombolaId: number): Observable<Lot[]> {
    return this.http.get<Lot[]>(
      `${this.apiUrl}/tombolas/${tombolaId}/lots`
    );
  }

  /** CREATE a lot under a specific tombola */
  addLot(
    tombolaId: number,
    lot: Partial<Lot>
  ): Observable<Lot> {
    return this.http.post<Lot>(
      `${this.apiUrl}/tombolas/${tombolaId}/lots`,
      lot
    );
  }

  /** UPDATE a lot (claimed/status) */
  updateLot(
    lotId: number,
    data: Partial<Lot>
  ): Observable<Lot> {
    return this.http.put<Lot>(
      `${this.apiUrl}/lots/${lotId}`,
      data
    );
  }
  
  /** DELETE a tombola */
  deleteTombola(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/tombolas/${id}`);
  }
}
