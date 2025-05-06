import { Injectable, signal } from '@angular/core';
import { Tombola } from '../models/tombola.model';

@Injectable({
  providedIn: 'root'
})
export class TombolaService {
  private _activeTombola = signal<Tombola | null>(null);

  selectTombola(tombola: Tombola): void {
    this._activeTombola.set(tombola);
  }

  get activeTombola(): Tombola | null {
    return this._activeTombola();
  }

  clearSelection(): void {
    this._activeTombola.set(null);
  }
}
