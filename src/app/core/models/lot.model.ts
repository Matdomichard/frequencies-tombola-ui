export interface Lot {
    id: number;
    name: string;
    description?: string;
    donorName?: string;
    donorContact?: string;
    value?: number;
    imageUrl?: string;
    status: 'UNASSIGNED'|'ASSIGNED'|'COLLECTED'|'CANCELED';
    assignedToId?: number;
    claimed: boolean;
    tombolaId?: number;
  }
  