import type { Plan } from './plans';
import { addCredits, recordPurchase } from './plans';

export interface RazorpayPaymentResponse {
  razorpay_payment_id: string;
  razorpay_order_id: string;
  razorpay_signature: string;
}

interface RazorpayInstance {
  on(event: string, callback: (response: RazorpayPaymentResponse) => void): void;
  open(): void;
}

interface RazorpayConstructorOptions {
  key: string;
  amount: number;
  currency: string;
  name: string;
  description: string;
  order_id: string;
  prefill?: { name?: string; email?: string; contact?: string };
  notes?: Record<string, string>;
  handler: (response: RazorpayPaymentResponse) => void;
  modal?: { ondismiss?: () => void };
  theme?: { color?: string };
}

declare global {
  interface Window {
    Razorpay: new (options: RazorpayConstructorOptions) => RazorpayInstance;
  }
}

let loadPromise: Promise<void> | null = null;

function loadRazorpayScript(): Promise<void> {
  if (typeof window !== 'undefined' && window.Razorpay) {
    return Promise.resolve();
  }
  if (!loadPromise) {
    loadPromise = new Promise((resolve, reject) => {
      const existing = document.querySelector('script[data-razorpay-checkout]');
      if (existing) {
        (existing as HTMLScriptElement).addEventListener('load', () => resolve());
        (existing as HTMLScriptElement).addEventListener('error', () => reject(new Error('Failed to load Razorpay. Check your connection.')));
        return;
      }
      const script = document.createElement('script');
      script.src = 'https://checkout.razorpay.com/v1/checkout.js';
      script.dataset.razorpayCheckout = 'true';
      script.onload = () => resolve();
      script.onerror = () => {
        loadPromise = null;
        reject(new Error('Failed to load Razorpay. Check your connection.'));
      };
      document.body.appendChild(script);
    });
  }
  return loadPromise;
}

async function postJSON<T>(url: string, body: unknown): Promise<T> {
  const res = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });
  if (!res.ok) {
    let message = `Server error: ${res.status}`;
    try {
      const data = (await res.json()) as { error?: string };
      if (data?.error) message = data.error;
    } catch {
      // keep status message
    }
    throw new Error(message);
  }
  return (await res.json()) as T;
}

export interface CheckoutResult {
  paymentId: string;
  orderId: string;
  signature: string;
}

export interface PlanCheckoutOptions {
  plan: Plan;
  prefill?: { name?: string; email?: string; contact?: string };
  themeColor?: string;
}

/**
 * Opens the Razorpay checkout for a credit plan. On a verified payment the
 * plan's credits are added and the purchase is recorded (export access etc).
 * Throws if the user closes the modal or payment fails.
 */
export async function openPlanCheckout(
  options: PlanCheckoutOptions
): Promise<CheckoutResult> {
  const { plan, prefill, themeColor } = options;

  const order = await postJSON<{
    orderId: string;
    amount: number;
    currency: string;
    keyId: string;
    demo?: boolean;
  }>('/api/razorpay/create-order', {
    amount: plan.price,
    notes: { planId: plan.id, planName: plan.name, credits: plan.credits },
  });

  // Demo mode (no real Razorpay keys configured): simulate a successful,
  // verified payment so the whole purchase flow can be tested.
  if (order.demo) {
    await new Promise((r) => setTimeout(r, 900));
    const paymentId = `pay_demo_${Math.random().toString(36).slice(2, 12)}`;
    const result: CheckoutResult = {
      paymentId,
      orderId: order.orderId,
      signature: `demo_${Math.random().toString(36).slice(2, 12)}`,
    };
    try {
      const verified = await postJSON<{ verified: boolean; demo?: boolean }>(
        '/api/razorpay/verify-payment',
        {
          orderId: result.orderId,
          paymentId: result.paymentId,
          signature: result.signature,
        }
      );
      if (!verified.verified) {
        throw new Error('Payment was not verified. Please contact support.');
      }
    } catch (err) {
      throw err instanceof Error ? err : new Error('Payment verification failed');
    }
    recordPurchase(plan);
    if (plan.credits > 0) addCredits(plan.credits);
    return result;
  }

  await loadRazorpayScript();

  return new Promise<CheckoutResult>((resolve, reject) => {
    let settled = false;

    const rzp = new window.Razorpay({
      key: order.keyId,
      amount: order.amount,
      currency: order.currency,
      name: 'Website Builder',
      description: `${plan.name} — ${plan.credits} credits`,
      order_id: order.orderId,
      prefill,
      theme: { color: themeColor || '#111111' },
      handler: async (response) => {
        try {
          const verified = await postJSON<{ verified: boolean }>('/api/razorpay/verify-payment', {
            orderId: response.razorpay_order_id,
            paymentId: response.razorpay_payment_id,
            signature: response.razorpay_signature,
          });
          if (!verified.verified) {
            settled = true;
            reject(new Error('Payment was not verified. Please contact support.'));
            return;
          }
          recordPurchase(plan);
          if (plan.credits > 0) addCredits(plan.credits);
          settled = true;
          resolve({
            paymentId: response.razorpay_payment_id,
            orderId: response.razorpay_order_id,
            signature: response.razorpay_signature,
          });
        } catch (err) {
          settled = true;
          reject(err instanceof Error ? err : new Error('Payment verification failed'));
        }
      },
      modal: {
        ondismiss: () => {
          if (!settled) {
            settled = true;
            reject(new Error('Checkout cancelled'));
          }
        },
      },
    });

    rzp.open();
  });
}