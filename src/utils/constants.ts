export const API_BASE_URL = import.meta.env.VITE_API_URL || '/api';

export const WS_URL = import.meta.env.VITE_WS_URL || '/ws';

export const RESTAURANT_CONFIG = {
  DEFAULT_RESTAURANT_ID: '1',
  MAX_GUESTS: 20,
  MIN_GUESTS: 1,
  BOOKING_WINDOW_DAYS: 30,
};

export const TABLE_ZONES = [
  { value: 'Indoor', label: '🪴 Indoor' },
  { value: 'Garden', label: '🌿 Garden' },
  { value: 'Rooftop', label: '🌅 Rooftop' },
  { value: 'VIP', label: '⭐ VIP' },
];

export const RESERVATION_STATUS = {
  CONFIRMED: 'CONFIRMED',
  CANCELLED: 'CANCELLED',
  COMPLETED: 'COMPLETED',
  PENDING: 'PENDING',
} as const;

export const TIME_SLOTS = [
  '11:00', '11:30', '12:00', '12:30', '13:00', '13:30',
  '14:00', '14:30', '15:00', '15:30', '16:00', '16:30',
  '17:00', '17:30', '18:00', '18:30', '19:00', '19:30',
  '20:00', '20:30', '21:00', '21:30',
];

export const DEFAULT_TABLE_CONFIG = {
  width: 80,
  height: 80,
  spacing: 20,
};

export const LOADING_MESSAGES = [
  'Preparing your table...',
  'Setting the ambiance...',
  'Lighting the candles...',
  'Almost ready...',
];