// src/app/models/player.model.ts
import { Lot } from './lot.model';
import { PaymentMethod } from './payment-method.enum';

/**
 * Représentation d'un participant/joueur dans la tombola
 */
export interface Player {
  /** Identifiant unique */
  id: number;
  /** Prénom du joueur */
  firstName: string;
  /** Nom du joueur */
  lastName: string;
  /** Adresse email */
  email: string;
  /** Numéro de téléphone */
  phone: string;
  /** Nombre de tickets achetés ou attribués */
  ticketNumber?: number;
  /** Indique si le joueur a récupéré son lot */
  hasCollectedPrize: boolean;
  /** Indique si un email de notification a été envoyé */
  emailSent: boolean;
  /** Méthode de paiement utilisée pour ce joueur */
  paymentMethod: PaymentMethod;
  /** Lots qui lui ont été attribués */
  assignedLots: Lot[];
}