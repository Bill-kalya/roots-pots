import { apiClient } from './client';
import { Order } from '../types';

export const ordersApi = {
  getAll: async (): Promise<Order[]> => {
    const response = await apiClient.get('/admin/orders');
    return response.data;
  },

  getByDate: async (date: string): Promise<Order[]> => {
    const response = await apiClient.get('/admin/orders', {
      params: { date }
    });
    return response.data;
  },

  getByTable: async (tableNumber: number): Promise<Order[]> => {
    const response = await apiClient.get(`/admin/orders/table/${tableNumber}`);
    return response.data;
  },

  updateStatus: async (orderId: string, status: string): Promise<Order> => {
    const response = await apiClient.patch(`/admin/orders/${orderId}`, {
      status
    });
    return response.data;
  },

  create: async (reservationId: string, items: any[]): Promise<Order> => {
    const response = await apiClient.post('/admin/orders', {
      reservationId,
      items
    });
    return response.data;
  }
};
