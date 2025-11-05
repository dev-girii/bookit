import { apiClient } from './client';
import { Experience, Slot } from '../types';

export const experiencesApi = {
  getAll: async (): Promise<Experience[]> => {
    const response = await apiClient.get<Experience[]>('/experiences');
    return response.data;
  },

  getById: async (id: number): Promise<Experience> => {
    const response = await apiClient.get<Experience>(`/experiences/${id}`);
    return response.data;
  },

  getSlots: async (experienceId: number): Promise<Slot[]> => {
    const response = await apiClient.get<Slot[]>(`/experiences/${experienceId}/slots`);
    return response.data;
  },
};

