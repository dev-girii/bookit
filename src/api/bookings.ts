import { apiClient } from './client';
import { Booking, BookingRequest } from '../types';

export const bookingsApi = {
  create: async (booking: BookingRequest): Promise<Booking> => {
    const response = await apiClient.post<Booking>('/bookings', booking);
    return response.data;
  },

  getById: async (id: number): Promise<Booking> => {
    const response = await apiClient.get<Booking>(`/bookings/${id}`);
    return response.data;
  },
};

