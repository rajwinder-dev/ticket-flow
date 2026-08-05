// Pretend this file is inside node_modules — a third-party SDK.
// You should never need to look inside this file to write your test;
// you only need to know its public shape (constructor + 2 methods),
// same as you would with a real library's type definitions.

export class PaymentSdk {
  constructor(private readonly config: { apiKey: string }) {}

  async createCharge(params: { customerId: string; amount: number; currency: string }): Promise<{
    id: string;
    status: 'succeeded' | 'failed';
  }> {
    // Real implementation would call out to a payment provider's API.
    throw new Error('Not implemented — this is a stand-in for a real SDK call');
  }

  async createRefund(chargeId: string): Promise<{ status: 'succeeded' | 'failed' }> {
    throw new Error('Not implemented — this is a stand-in for a real SDK call');
  }
}
