import { Lot } from './lot.model';

export interface Player {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  ticketNumber?: number;
  hasCollectedPrize: boolean;
  emailSent: boolean;
  assignedLots: Lot[];   // ← liste complète
}

