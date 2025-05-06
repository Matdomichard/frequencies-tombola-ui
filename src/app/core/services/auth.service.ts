import { Injectable, signal } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private _username = signal<string | null>(null);
  private _password = signal<string | null>(null);

  // user connected or not
  isAuthenticated = signal(false);

  setCredentials(username: string, password: string): void {
    this._username.set(username);
    this._password.set(password);
    this.isAuthenticated.set(true);
  }

  clearCredentials(): void {
    this._username.set(null);
    this._password.set(null);
    this.isAuthenticated.set(false);
  }

  getAuthHeader(): string | null {
    const user = this._username();
    const pass = this._password();
    if (!user || !pass) return null;
    const credentials = btoa(`${user}:${pass}`);
    return `Basic ${credentials}`;
  }

  get username(): string | null {
    return this._username();
  }
}
