export interface Lot {
  id: number;
  name: string;
  donorFirstName?: string;
  donorLastName?: string;
  donorCompany?: string;
  donorEmail: string;
  donorPhone?: string;
  value?: number;
  imageUrl?: string;
  status: 'UNASSIGNED' | 'ASSIGNED' | 'COLLECTED' | 'CANCELED';
  assignedToId?: number;
  claimed: boolean;
  tombolaId?: number;
}
