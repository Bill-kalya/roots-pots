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

export interface Order {
  id: string;
  reservationId: string;
  tableNumber: number;
  items: OrderItem[];
  status: 'PENDING' | 'PREPARING' | 'READY' | 'SERVED' | 'CANCELLED' | 'PAID' | 'COMPLETED';
  total: number;
  createdAt: string;
  updatedAt: string;
}

export interface OrderItem {
  id: string;
  name: string;
  quantity: number;
  price: number;
  specialRequests?: string;
}

export interface MenuItem {
  id: string;
  name: string;
  description: string;
  category: string;
  price: number;
  image_url: string;
  available: boolean;
  preparationTime: number;
}

export interface Payment {
  id: string;
  reservationId: string;
  amount: number;
  currency: string;
  status: 'PENDING' | 'PROCESSING' | 'COMPLETED' | 'FAILED' | 'REFUNDED';
  paymentMethod: 'MPESA' | 'CARD' | 'CASH';
  transactionReference?: string;
  paidAt?: string;
  createdAt: string;
}