import { apiClient } from './client';
import { Restaurant, Table } from '../types';

export const restaurantsApi = {
  getAll: async (): Promise<Restaurant[]> => {
    const response = await apiClient.get('/restaurants');
    return response.data;
  },

  getById: async (id: string): Promise<Restaurant> => {
    const response = await apiClient.get(`/restaurants/${id}`);
    return response.data;
  },

  getTables: async (restaurantId: string): Promise<Table[]> => {
    const response = await apiClient.get(`/restaurants/${restaurantId}/tables`);
    return response.data;
  },

  getAvailability: async (restaurantId: string, date: string): Promise<any> => {
    const response = await apiClient.get(`/restaurants/${restaurantId}/availability`, {
      params: { date }
    });
    return response.data;
  }
};