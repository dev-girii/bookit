import { apiClient } from './client';
import { PromoValidationResponse } from '../types';

export const promoApi = {
  validate: async (code: string, amount: number): Promise<PromoValidationResponse> => {
    const response = await apiClient.post<PromoValidationResponse>('/promo/validate', {
      code,
      amount,
    });
    return response.data;
  },
};

