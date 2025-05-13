// src/app/models/hello-asso-participant.model.ts
import { PaymentMethod } from './payment-method.enum';

/**
 * Mapping du DTO Java HelloAssoParticipantDto
 */
export interface HelloAssoParticipant {
  firstName: string;
  lastName:  string;
  email:     string;
  phone?:    string;
  state:     string;          // ex: "Paid"
  ticketNumber: number;
  paymentMethod: PaymentMethod;
}
