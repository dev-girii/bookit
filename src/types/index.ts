export interface Experience {
  id: number;
  title: string;
  description: string;
  location: string;
  price: number;
  image_url: string | null;
  duration_hours: number | null;
  max_group_size: number | null;
  created_at: string;
  updated_at: string;
}

export interface Slot {
  id: number;
  experience_id: number;
  date: string;
  start_time: string;
  end_time: string;
  available_spots: number;
  is_active: boolean;
  created_at: string;
}

export interface Booking {
  id: number;
  experience_id: number;
  slot_id: number;
  customer_name: string;
  customer_email: string;
  customer_phone: string | null;
  number_of_guests: number;
  promo_code: string | null;
  discount_amount: number;
  total_amount: number;
  status: string;
  created_at: string;
}

export interface BookingRequest {
  experience_id: number;
  slot_id: number;
  customer_name: string;
  customer_email: string;
  customer_phone?: string;
  number_of_guests: number;
  promo_code?: string;
}

export interface PromoValidationResponse {
  valid: boolean;
  discount_amount: number;
  message?: string;
}

