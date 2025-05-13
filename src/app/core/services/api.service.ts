import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { Ticket } from '../models/ticket.model';
import { Statistics } from '../models/statistics.model';
import { Tombola } from '../models/tombola.model';
import { Player } from '../models/player.model';
import { HelloAssoForm } from '../models/hello-asso-form.model';
import { HelloAssoParticipant } from '../models/hello-asso-participant.model';
import { Lot } from '../models/lot.model';
import { DrawResult } from '../models/draw-result.model';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  private apiUrl = environment.apiEndpoint;

  constructor(private http: HttpClient) {}

  // 🎟️ TICKETS

  getTickets(): Observable<Ticket[]> {
    return this.http.get<Ticket[]>(`${this.apiUrl}/tickets`);
  }

  claimTicket(ticketId: number): Observable<void> {
    return this.http.put<void>(`${this.apiUrl}/tickets/${ticketId}/claim`, {});
  }

  markTicketAsWinner(ticketId: number): Observable<void> {
    return this.http.put<void>(`${this.apiUrl}/tickets/${ticketId}/winner`, {});
  }

  getWinners(): Observable<Ticket[]> {
    return this.http.get<Ticket[]>(`${this.apiUrl}/tickets/winners`);
  }

  getTicketById(id: number): Observable<Ticket> {
    return this.http.get<Ticket>(`${this.apiUrl}/tickets/${id}`);
  }

  getTicketsByPlayer(playerId: number): Observable<Ticket[]> {
    return this.http.get<Ticket[]>(`${this.apiUrl}/tickets/player/${playerId}`);
  }

  createTicket(data: any): Observable<Ticket> {
    return this.http.post<Ticket>(`${this.apiUrl}/tickets`, data);
  }

  // 👥 PLAYERS (Participants)

  getParticipants(): Observable<Player[]> {
    return this.http.get<Player[]>(`${this.apiUrl}/players`);
  }

  getParticipant(id: number): Observable<Player> {
    return this.http.get<Player>(`${this.apiUrl}/players/${id}`);
  }

  addParticipant(tombolaId: number, player: Player): Observable<Player> {
    return this.http.post<Player>(
      `${this.apiUrl}/tombolas/${tombolaId}/players`,
      player
    );
  }

  updateParticipant(id: number, data: Player): Observable<Player> {
    return this.http.put<Player>(`${this.apiUrl}/players/${id}`, data);
  }

  patchParticipant(id: number, changes: Partial<Player>): Observable<Player> {
    return this.http.patch<Player>(`${this.apiUrl}/players/${id}`, changes);
  }

  deleteParticipant(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/players/${id}`);
  }

  // 🌀 DRAW

  draw(
    tombolaId: number,
    guaranteeOneLotPerParticipant: boolean = false
  ): Observable<DrawResult> {
    return this.http
      .post<DrawResult>(
        `${this.apiUrl}/tombolas/${tombolaId}/draw`,
        {},
        {
          params: { guaranteeOneLotPerParticipant: `${guaranteeOneLotPerParticipant}` }
        }
      )
      .pipe(
        map(result => {
          if (result.players && result.lots) {
            result.players = result.players.map(player => ({
              ...player,
              assignedLots: result.lots.filter(lot => lot.assignedToId === player.id)
            }));
          }
          return result;
        })
      );
  }

  // 📊 STATISTICS

  getStatistics(): Observable<Statistics> {
    return this.http.get<Statistics>(`${this.apiUrl}/stats`);
  }

  // ▶️ HELLOASSO FORMS

  getHelloAssoForms(): Observable<HelloAssoForm[]> {
    return this.http
      .get<{ data: HelloAssoForm[] }>(`${this.apiUrl}/helloasso/forms`)
      .pipe(map(resp => resp.data || []));
  }

  // ▶️ HELLOASSO PARTICIPANTS

  /** GET participants payés d’un formulaire HelloAsso */
  getHelloAssoPaidParticipants(
    formType: string,
    formSlug: string
  ): Observable<HelloAssoParticipant[]> {
    const params = new HttpParams()
      .set('formType', formType)
      .set('formSlug', formSlug);
    return this.http.get<HelloAssoParticipant[]>(
      `${this.apiUrl}/helloasso/participants`,
      { params }
    );
  }

  /** GET tous les participants (payés + gratuits) d’un formulaire HelloAsso */
  getHelloAssoAllParticipants(
    formType: string,
    formSlug: string
  ): Observable<HelloAssoParticipant[]> {
    const params = new HttpParams()
      .set('formType', formType)
      .set('formSlug', formSlug);
    return this.http.get<HelloAssoParticipant[]>(
      `${this.apiUrl}/helloasso/all-participants`,
      { params }
    );
  }

  // ▶️ TOMBOLAS

  getTombolas(): Observable<Tombola[]> {
    return this.http.get<Tombola[]>(`${this.apiUrl}/tombolas`);
  }

  getTombola(id: number): Observable<Tombola> {
    return this.http.get<Tombola>(`${this.apiUrl}/tombolas/${id}`);
  }

  createTombola(data: Partial<Tombola>): Observable<Tombola> {
    return this.http.post<Tombola>(`${this.apiUrl}/tombolas`, data);
  }

  deleteTombola(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/tombolas/${id}`);
  }

  // ▶️ TOMBOLA PLAYERS

  getPlayers(tombolaId: number): Observable<Player[]> {
    return this.http.get<Player[] | { data: Player[] }>(
      `${this.apiUrl}/tombolas/${tombolaId}/players`
    ).pipe(
      map(resp => Array.isArray(resp) ? resp : (resp.data || []))
    );
  }

  // 🎁 LOTS

  getLots(): Observable<Lot[]> {
    return this.http.get<Lot[]>(`${this.apiUrl}/lots`);
  }

  getLot(id: number): Observable<Lot> {
    return this.http.get<Lot>(`${this.apiUrl}/lots/${id}`);
  }

  addGlobalLot(lot: Partial<Lot>): Observable<Lot> {
    return this.http.post<Lot>(`${this.apiUrl}/lots`, lot);
  }

  updateGlobalLot(id: number, data: Partial<Lot>): Observable<Lot> {
    return this.http.put<Lot>(`${this.apiUrl}/lots/${id}`, data);
  }

  deleteLot(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/lots/${id}`);
  }

  getLotsForTombola(tombolaId: number): Observable<Lot[]> {
    return this.http.get<Lot[]>(`${this.apiUrl}/tombolas/${tombolaId}/lots`);
  }

  addLot(tombolaId: number, lot: Partial<Lot>): Observable<Lot> {
    return this.http.post<Lot>(
      `${this.apiUrl}/tombolas/${tombolaId}/lots`,
      lot
    );
  }

  updateLot(lotId: number, data: Partial<Lot>): Observable<Lot> {
    return this.http.put<Lot>(`${this.apiUrl}/lots/${lotId}`, data);
  }
}
