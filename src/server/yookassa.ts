import { randomUUID } from 'crypto';

// Minimal YooKassa REST client (https://yookassa.ru/developers/api).
// Auth is HTTP Basic with shopId:secretKey. Every POST needs an Idempotence-Key.

const YOOKASSA_API = 'https://api.yookassa.ru/v3';

const shopId = process.env.YOOKASSA_SHOP_ID;
const secretKey = process.env.YOOKASSA_SECRET_KEY;

export const isYookassaConfigured = Boolean(shopId && secretKey);

export interface YookassaPayment {
  id: string;
  status: 'pending' | 'waiting_for_capture' | 'succeeded' | 'canceled';
  paid: boolean;
  amount: { value: string; currency: string };
  confirmation?: { type: string; confirmation_url?: string };
  metadata?: Record<string, string>;
}

const authHeader = () =>
  'Basic ' + Buffer.from(`${shopId}:${secretKey}`).toString('base64');

async function yookassaFetch(path: string, init: RequestInit = {}): Promise<any> {
  const res = await fetch(`${YOOKASSA_API}${path}`, {
    ...init,
    headers: {
      'Authorization': authHeader(),
      'Content-Type': 'application/json',
      ...init.headers,
    },
  });
  const body = await res.json().catch(() => ({}));
  if (!res.ok) {
    throw new Error(`YooKassa ${res.status}: ${body.description || body.code || 'request failed'}`);
  }
  return body;
}

export async function createYookassaPayment(opts: {
  amountRub: number;
  description: string;
  returnUrl: string;
  metadata?: Record<string, string>;
}): Promise<YookassaPayment> {
  return yookassaFetch('/payments', {
    method: 'POST',
    headers: { 'Idempotence-Key': randomUUID() },
    body: JSON.stringify({
      amount: { value: opts.amountRub.toFixed(2), currency: 'RUB' },
      capture: true,
      confirmation: { type: 'redirect', return_url: opts.returnUrl },
      description: opts.description,
      metadata: opts.metadata || {},
    }),
  });
}

// Used both by the webhook (to verify a notification is authentic — we never trust
// the notification body, we re-fetch the payment from YooKassa) and by the
// return-from-checkout verify endpoint.
export async function getYookassaPayment(paymentId: string): Promise<YookassaPayment> {
  return yookassaFetch(`/payments/${encodeURIComponent(paymentId)}`);
}
