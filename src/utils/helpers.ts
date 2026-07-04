import { Table } from '../types';

export const formatDate = (date: string | Date): string => {
  const d = new Date(date);
  return d.toLocaleDateString('en-KE', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
};

export const formatTime = (time: string): string => {
  const [hours, minutes] = time.split(':');
  const h = parseInt(hours);
  const ampm = h >= 12 ? 'PM' : 'AM';
  const hour12 = h % 12 || 12;
  return `${hour12}:${minutes} ${ampm}`;
};

export const isTableAvailable = (table: Table, reservations: any[]): boolean => {
  return reservations.every(r => r.tableId !== table.id);
};

export const generateTableKey = (table: Table): string => {
  return `table-${table.id}`;
};

export const getTableStatus = (table: Table): 'available' | 'reserved' | 'pending' => {
  if (table.available === undefined) return 'available';
  return table.available ? 'available' : 'reserved';
};

export const getStatusColor = (status: string): string => {
  const colors = {
    available: 'bg-green-500',
    reserved: 'bg-red-500',
    pending: 'bg-yellow-500',
    confirmed: 'bg-blue-500',
    cancelled: 'bg-gray-500',
    completed: 'bg-purple-500',
  };
  return colors[status as keyof typeof colors] || 'bg-gray-400';
};

export const getStatusText = (status: string): string => {
  const texts = {
    available: 'Available',
    reserved: 'Reserved',
    pending: 'Pending',
    confirmed: 'Confirmed',
    cancelled: 'Cancelled',
    completed: 'Completed',
  };
  return texts[status as keyof typeof texts] || status;
};

export const validatePhoneNumber = (phone: string): boolean => {
  // Kenya phone number validation (simple)
  const kenyanRegex = /^(\+254|0)?[17]\d{8}$/;
  return kenyanRegex.test(phone);
};

export const validateEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

export const generateTimeSlots = (startHour: number = 11, endHour: number = 22): string[] => {
  const slots: string[] = [];
  for (let hour = startHour; hour <= endHour; hour++) {
    slots.push(`${String(hour).padStart(2, '0')}:00`);
    if (hour < endHour) {
      slots.push(`${String(hour).padStart(2, '0')}:30`);
    }
  }
  return slots;
};

export const getDefaultDate = (): string => {
  const date = new Date();
  date.setDate(date.getDate() + 1);
  return date.toISOString().split('T')[0];
};

export const getDefaultTime = (): string => {
  const now = new Date();
  const hours = now.getHours();
  const minutes = now.getMinutes();
  const roundedMinutes = Math.ceil(minutes / 30) * 30;
  const adjustedHours = hours + (roundedMinutes >= 60 ? 1 : 0);
  const finalMinutes = roundedMinutes % 60;
  return `${String(adjustedHours).padStart(2, '0')}:${String(finalMinutes).padStart(2, '0')}`;
};

export const calculateDistance = (lat1: number, lon1: number, lat2: number, lon2: number): number => {
  const R = 6371; // Earth's radius in km
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a = 
    Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
    Math.sin(dLon/2) * Math.sin(dLon/2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  return R * c;
};

export const getImageUrl = (path: string): string => {
  if (path.startsWith('http')) return path;
  return `${import.meta.env.VITE_CDN_URL || ''}${path}`;
};