import { createHmac } from 'crypto';
import type { VercelRequest, VercelResponse } from '@vercel/node';

/**
 * One serverless function serving both Razorpay endpoints:
 *   POST /api/razorpay/create-order
 *   POST /api/razorpay/verify-payment
 * (merged to stay under Vercel Hobby's 12-function cap; dispatch on URL).
 */

// Read live from process.env inside the handler: on the local Express server
// dotenv must load before the handler runs (see server/index.ts).
function razorKeys(): { keyId: string; keySecret: string } {
  return {
    keyId: process.env.RAZORPAY_KEY_ID || '',
    keySecret: process.env.RAZORPAY_KEY_SECRET || '',
  };
}

function currency(): string {
  return process.env.RAZORPAY_CURRENCY || 'INR';
}

function defaultAmount(): number {
  return Number(process.env.RAZORPAY_PRO_PRICE || 499);
}

function demoEnabled(): boolean {
  return process.env.RAZORPAY_DEMO === '1' || process.env.RAZORPAY_DEMO === 'true';
}

function demoOrderId(): string {
  return `demo_${Date.now()}_${Math.random().toString(36).slice(2, 10)}`;
}

function isVerify(req: VercelRequest): boolean {
  return (req.url ?? '').split('?')[0].split('/').includes('verify-payment');
}

// ----------------------------------------------------------------------------
// Create order
// ----------------------------------------------------------------------------

interface RazorpayOrder {
  id: string;
  amount: number;
  currency: string;
  receipt: string;
  status: string;
  attempt: number;
}

async function createRazorpayOrder(amountPaise: number, currency: string): Promise<RazorpayOrder> {
  const keys = razorKeys();
  const auth = Buffer.from(`${keys.keyId}:${keys.keySecret}`).toString('base64');
  const body = JSON.stringify({
    amount: amountPaise,
    currency,
    receipt: `pro_${Date.now()}`,
    notes: { plan: 'pro' },
  });

  const res = await fetch('https://api.razorpay.com/v1/orders', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Basic ${auth}`,
    },
    body,
  });

  if (!res.ok) {
    const text = await res.text();
    console.error(
      `[razorpay] create-order HTTP ${res.status}: ${text.slice(0, 300)} | keyId=${keys.keyId.slice(0, 8)}... len=${keys.keyId.length}/${keys.keySecret.length}`
    );
    throw new Error(`Razorpay order failed (${res.status}): ${text.slice(0, 300)}`);
  }

  return (await res.json()) as RazorpayOrder;
}

async function handleCreateOrder(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  const keys = razorKeys();

  // amount (optional) is in rupees; converted to paise server-side.
  const requested = Number(req.body?.amount);
  const amount = Number.isFinite(requested) && requested > 0 ? requested : defaultAmount();
  const amountPaise = Math.round(amount * 100);

  // Demo mode is EXPLICIT (RAZORPAY_DEMO=1): simulates a payment end-to-end
  // without real keys. It is never active by default.
  if (demoEnabled()) {
    return res.status(200).json({
      orderId: demoOrderId(),
      amount: amountPaise,
      currency: currency(),
      receipt: `demo_${Date.now()}`,
      keyId: keys.keyId || 'rzp_test_demo',
      demo: true,
    });
  }

  // Missing keys: fall back to simulated checkout (same as demo) so the flow
  // never dead-ends while developing, mirroring the historical behaviour.
  if (!keys.keyId || !keys.keySecret) {
    return res.status(200).json({
      orderId: demoOrderId(),
      amount: amountPaise,
      currency: currency(),
      receipt: `demo_${Date.now()}`,
      keyId: 'rzp_test_demo',
      demo: true,
    });
  }

  try {
    const order = await createRazorpayOrder(amountPaise, currency());
    return res.status(200).json({
      orderId: order.id,
      amount: order.amount,
      currency: order.currency,
      receipt: order.receipt,
      keyId: keys.keyId,
    });
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Failed to create Razorpay order';
    return res.status(500).json({ error: message });
  }
}

// ----------------------------------------------------------------------------
// Verify payment
// ----------------------------------------------------------------------------

function verifySignature(orderId: string, paymentId: string, signature: string): boolean {
  const keySecret = process.env.RAZORPAY_KEY_SECRET || '';
  if (!keySecret) return false;
  const expected = createHmac('sha256', keySecret)
    .update(`${orderId}|${paymentId}`)
    .digest('hex');
  return expected === signature;
}

async function handleVerifyPayment(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  const { orderId, paymentId, signature } = req.body ?? {};
  if (typeof orderId !== 'string' || typeof paymentId !== 'string' || typeof signature !== 'string') {
    return res.status(400).json({ error: 'Missing payment details' });
  }

  // Demo orders (fake checkout) are accepted only when the demo flow is
  // actually active — explicit RAZORPAY_DEMO=1, or live keys are not
  // configured. With real keys present a `demo_` id is rejected, so a caller
  // cannot mint free credits by inventing an order id.
  if (orderId.startsWith('demo_')) {
    if (demoEnabled() || !process.env.RAZORPAY_KEY_ID || !process.env.RAZORPAY_KEY_SECRET) {
      return res.status(200).json({ verified: true, demo: true, orderId, paymentId });
    }
    return res.status(400).json({ error: 'Invalid payment signature' });
  }

  if (!verifySignature(orderId, paymentId, signature)) {
    return res.status(400).json({ error: 'Invalid payment signature' });
  }

  return res.status(200).json({ verified: true, orderId, paymentId });
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  return isVerify(req) ? handleVerifyPayment(req, res) : handleCreateOrder(req, res);
}