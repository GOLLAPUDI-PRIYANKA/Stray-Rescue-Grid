export type Priority =
  | "Critical"
  | "High"
  | "Normal"
  | "Low";

export type TicketStatus =
  | "New"
  | "Under Review"
  | "Assigned"
  | "Accepted"
  | "En Route"
  | "Rescued"
  | "Referred"
  | "Closed";

export type AnimalType =
  | "Dog"
  | "Cat"
  | "Bird"
  | "Other";

export interface Ticket {
  id: number;
  ticket_code: string;
  animal_type: AnimalType;
  description: string;
  priority_level: Priority;
  status: TicketStatus;
  latitude: number;
  longitude: number;
  address: string;
  created_at: string;
}