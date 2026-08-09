import api from './api';

export async function startMpesaStkPush({ planId, phoneNumber, site }) {
  const { data } = await api.post('/payment/mpesa/stk-push', {
    plan_id: planId,
    phone_number: phoneNumber,
    site,
  });
  return data;
}

export async function getMpesaPaymentStatus({ checkoutRequestId, paymentId }) {
  const { data } = await api.get('/payment/mpesa/status', {
    params: {
      checkout_request_id: checkoutRequestId || undefined,
      payment_id: paymentId || undefined,
    },
  });
  return data;
}

export async function getMpesaPayConfig(site) {
  const { data } = await api.get('/payment/mpesa/config', {
    params: { site },
  });
  return data;
}

/**
 * Poll until paid/failed or timeout.
 */
export async function pollMpesaUntilSettled({
  checkoutRequestId,
  paymentId,
  intervalMs = 3000,
  timeoutMs = 90000,
  onTick,
}) {
  const started = Date.now();
  while (Date.now() - started < timeoutMs) {
    const result = await getMpesaPaymentStatus({ checkoutRequestId, paymentId });
    const status = result?.data?.status_label;
    if (typeof onTick === 'function') onTick(result);
    if (status === 'paid' || status === 'failed') {
      return result;
    }
    await new Promise((r) => setTimeout(r, intervalMs));
  }
  return getMpesaPaymentStatus({ checkoutRequestId, paymentId });
}
