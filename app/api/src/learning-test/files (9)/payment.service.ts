// Level 4 — MOCKING A MODULE, CONSTRUCTED PER-CALL
// Goal: your first real vi.mock() of a class-based external SDK. Notice
// the SDK is instantiated INSIDE the method, not at module load time —
// so there's no import-time side effect to worry about yet, and no
// vi.hoisted() should be necessary. Save that problem for Level 5.
//
// Pretend './payment-sdk.ts' is a third-party package (like Stripe's SDK)
// you don't own and can't change.

import { PaymentSdk } from './payment-sdk.js';

export class PaymentService {
  async charge(customerId: string, amountCents: number): Promise<{ status: 'success' | 'failed'; chargeId?: string }> {
    if (amountCents <= 0) {
      throw new Error('amountCents must be positive');
    }
    const sdk = new PaymentSdk({ apiKey: process.env.PAYMENT_API_KEY ?? 'test-key' });
    const result = await sdk.createCharge({ customerId, amount: amountCents, currency: 'usd' });

    if (result.status !== 'succeeded') {
      return { status: 'failed' };
    }
    return { status: 'success', chargeId: result.id };
  }

  async refund(chargeId: string): Promise<boolean> {
    const sdk = new PaymentSdk({ apiKey: process.env.PAYMENT_API_KEY ?? 'test-key' });
    const result = await sdk.createRefund(chargeId);
    return result.status === 'succeeded';
  }
}
