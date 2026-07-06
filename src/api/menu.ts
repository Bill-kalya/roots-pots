import { apiClient } from './client';
import { MenuItem } from '../types';

export const menuApi = {
  getAll: async (): Promise<MenuItem[]> => {
    const response = await apiClient.get('/menu');
    return response.data;
  },

  getByCategory: async (category: string): Promise<MenuItem[]> => {
    const response = await apiClient.get('/menu', {
      params: { category }
    });
    return response.data;
  },

  getById: async (id: string): Promise<MenuItem> => {
    const response = await apiClient.get(`/menu/${id}`);
    return response.data;
  },
};
