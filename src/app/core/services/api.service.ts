import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { Observable } from 'rxjs';
import { Ticket } from '../models/ticket.model';
import { Statistics } from '../models/statistics.model';
import { Tombola } from '../models/tombola.model';
import { Player } from '../models/player.model';
import { HelloAssoForm } from '../models/hello-asso-form.model';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  private apiUrl = environment.apiEndpoint;

  constructor(private http: HttpClient) {}

  // 🎟️ Tickets
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

  /** GET all winning tickets */
  getWinners(): Observable<Ticket[]> {
    return this.http.get<Ticket[]>(`${this.apiUrl}/tickets/winners`);
  }

  /** GET ticket by its ID */
  getTicketById(id: number): Observable<Ticket> {
    return this.http.get<Ticket>(`${this.apiUrl}/tickets/${id}`);
  }

  /** GET tickets for a specific player */
  getTicketsByPlayer(playerId: number): Observable<Ticket[]> {
    return this.http.get<Ticket[]>(`${this.apiUrl}/tickets/player/${playerId}`);
  }

  /** Create a new ticket */
  createTicket(data: any): Observable<Ticket> {
    return this.http.post<Ticket>(`${this.apiUrl}/tickets`, data);
  }

  // 👥 Players (Participants)
  /** GET all participants across all tombolas */
  getParticipants(): Observable<Player[]> {
    return this.http.get<Player[]>(`${this.apiUrl}/players`);
  }

  /** GET a single participant by their ID */
  getParticipant(id: number): Observable<Player> {
    return this.http.get<Player>(`${this.apiUrl}/players/${id}`);
  }

  /** CREATE a new participant for a given tombola */
  addParticipant(tombolaId: number, participant: Player): Observable<Player> {
    return this.http.post<Player>(`${this.apiUrl}/tombolas/${tombolaId}/players`, participant);
  }

  /** UPDATE an existing participant */
  updateParticipant(id: number, data: Player): Observable<Player> {
    return this.http.put<Player>(`${this.apiUrl}/players/${id}`, data);
  }

  /** DELETE a participant by their ID */
  deleteParticipant(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/players/${id}`);
  }

  // 🎁 Lots
  /** GET all lots */
  getLots(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/lots`);
  }

  /** GET a single lot by its ID */
  getLot(id: number): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/lots/${id}`);
  }

  /** CREATE a new lot */
  addLot(lot: any): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/lots`, lot);
  }

  /** UPDATE an existing lot */
  updateLot(id: number, data: any): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/lots/${id}`, data);
  }

  /** DELETE a lot by its ID */
  deleteLot(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/lots/${id}`);
  }

  // 🌀 Lottery draw
  /** Trigger the draw for a winner */
  drawWinner(): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/lottery/draw`, {});
  }

  // 📊 Statistics
  /** GET overall statistics */
  getStatistics(): Observable<Statistics> {
    return this.http.get<Statistics>(`${this.apiUrl}/stats`);
  }

  // ⚙️ Configuration
  /** GET application configuration */
  getConfiguration(): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/config`);
  }

  /** UPDATE application configuration */
  updateConfiguration(config: any): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/config`, config);
  }

  // ▶️ HelloAsso forms
  /** GET list of available HelloAsso forms */
  getHelloAssoForms(): Observable<HelloAssoForm[]> {
    return this.http.get<HelloAssoForm[]>(`${this.apiUrl}/helloasso/forms`);
  }

  // ▶️ Tombolas
  /** GET all tombolas */
  getTombolas(): Observable<Tombola[]> {
    return this.http.get<Tombola[]>(`${this.apiUrl}/tombolas`);
  }

  /** GET a single tombola by its ID */
  getTombola(id: number): Observable<Tombola> {
    return this.http.get<Tombola>(`${this.apiUrl}/tombolas/${id}`);
  }

  /** CREATE a new tombola */
  createTombola(data: Partial<Tombola>): Observable<Tombola> {
    return this.http.post<Tombola>(`${this.apiUrl}/tombolas`, data);
  }

  // ▶️ Players of a specific tombola
  /** GET all players for a given tombola */
  getPlayers(tombolaId: number): Observable<Player[]> {
    return this.http.get<Player[]>(`${this.apiUrl}/tombolas/${tombolaId}/players`);
  }
}
