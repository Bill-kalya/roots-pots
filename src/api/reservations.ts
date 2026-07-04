import { apiClient } from './client';
import { ReservationRequest, ReservationResponse } from '../types';

export const reservationsApi = {
  create: async (data: ReservationRequest): Promise<ReservationResponse> => {
    const response = await apiClient.post('/reservations', data);
    return response.data;
  }
};