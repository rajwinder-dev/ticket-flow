import { describe, vi, it, expect, afterEach } from 'vitest';
import { PaymentService } from './payment.service';
import { PaymentSdk } from './payment-sdk';
const createChargeMock = vi.fn();
const createRefundMock = vi.fn();
vi.mock('./payment-sdk', () => ({
  PaymentSdk: vi.fn(
    class {
      createCharge = createChargeMock;
      createRefund = createRefundMock;
    },
  ),
}));

describe('payment service', () => {
  afterEach(() => {
    vi.clearAllMocks();
  });
  it('should charge customer', async () => {
    createChargeMock.mockReturnValue({
      id: 'xyz',
      status: 'succeeded',
    });
    const paymentService = new PaymentService();

    const result = await paymentService.charge('abc', 100);

    expect(result).toEqual({
      status: 'success',
      chargeId: 'xyz',
    });
  });
  it('should throw error if amount is <= 0', async () => {
    const paymentService = new PaymentService();
    const paymentSdk = new PaymentSdk({ apiKey: 'test-key' });
    expect(() => paymentService.charge('abc', 0)).rejects.toThrow(
      'amountCents must be positive',
    );
    expect(paymentSdk.createCharge).not.toHaveBeenCalled();
  });
  it('it should return payment error', async () => {
    createChargeMock.mockReturnValue({
      id: 'xyz',
      status: 'failed',
    });
    const paymentService = new PaymentService();
    const result = await paymentService.charge('abc', 100);
    expect(result).toEqual({
      status: 'failed',
    });
  });
  it('should refund charge', async () => {
    createRefundMock.mockReturnValue({
      status: 'succeeded',
    });
    const paymentService = new PaymentService();
    const result = await paymentService.refund('abc');
    expect(result).toBe(true);
  });
  it('should throw error if refund fails', async () => {
    createRefundMock.mockReturnValue({
      status: 'failed',
    });
    const paymentService = new PaymentService();
    const result = await paymentService.refund('abc');
    expect(result).toBe(false);
  });
});
