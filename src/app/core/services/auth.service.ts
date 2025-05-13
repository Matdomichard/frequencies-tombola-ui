import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private _isAuthenticated = false;
  private apiEndpoint = environment.apiEndpoint;

  constructor(private http: HttpClient) {
    this._isAuthenticated = !!localStorage.getItem('auth_token');
  }

  login(username: string, password: string): Observable<boolean> {
    const credentials = btoa(`${username}:${password}`);
    return this.http.get(`${this.apiEndpoint}/tombolas`, {
      headers: {
        'Authorization': `Basic ${credentials}`
      }
    }).pipe(
      map(() => {
        this._isAuthenticated = true;
        localStorage.setItem('auth_token', credentials);
        return true;
      }),
      catchError(() => {
        this._isAuthenticated = false;
        return of(false);
      })
    );
  }

  getAuthHeader(): string {
    const token = localStorage.getItem('auth_token');
    return token ? `Basic ${token}` : '';
  }

  isAuthenticated(): boolean {
    return this._isAuthenticated;
  }

  clearCredentials(): void {
    this._isAuthenticated = false;
    localStorage.removeItem('auth_token');
  }
}
