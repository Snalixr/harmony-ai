export interface User {
  id: string;
  email: string;
  free_messages_left: number;
  is_subscribed: boolean; // derived server-side: premium_expires_at > now
  premium_expires_at?: string | null;
  onboarded: boolean;
  name?: string;
  age?: string;
  concerns?: string;
  goals?: string;
}

export interface Payment {
  id: string;
  user_id: string;
  yookassa_payment_id: string;
  amount: number;
  currency: string;
  status: 'pending' | 'succeeded' | 'canceled';
  created_at: string;
  updated_at: string;
}

export interface BillingConfig {
  price_rub: number;
  duration_days: number;
  payments_enabled: boolean;
}

export interface Chat {
  id: string;
  user_id: string;
  title: string;
  created_at: string;
}

export interface Message {
  id: string;
  chat_id: string;
  role: 'user' | 'model'; // 'user' or 'model' for Gemini
  content: string;
  created_at: string;
}

export interface AuthResponse {
  user: User;
  token: string;
}

export interface ErrorResponse {
  error: string;
}
