export interface Restaurant {
  id: string;
  name: string;
  description: string;
  address: string;
  latitude: number;
  longitude: number;
  heroImage: string;
  modelUrl?: string;
}

export interface Table {
  id: string;
  tableNumber: number;
  seats: number;
  x: number;
  y: number;
  zone: string;
  active: boolean;
  available?: boolean;
}

export interface ReservationRequest {
  tableId: string;
  customerName: string;
  customerPhone: string;
  date: string;
  time: string;
}

export interface ReservationResponse {
  id: string;
  tableId: string;
  tableNumber: number;
  customerName: string;
  date: string;
  time: string;
  status: string;
}