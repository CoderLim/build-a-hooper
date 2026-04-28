import { NextResponse } from 'next/server';
import { envConfigs } from '@/config';
import { handlePaymentCallback } from '@/modules/payment/service';

/**
 * GET /api/payment/callback?order_no=xxx&redirect=xxx
 *
 * After payment (e.g. Alipay return_url), this endpoint:
 * 1. Queries the payment provider for the latest order status
 * 2. Updates the order in DB if paid
 * 3. Redirects to the final destination
 */
export async function GET(req: Request) {
  const url = new URL(req.url);
  const orderNo = url.searchParams.get('order_no');
  const redirect = url.searchParams.get('redirect');
  const fallback = `${envConfigs.app_url}/settings/billing`;

  try {
    if (orderNo) {
      await handlePaymentCallback(orderNo);
    }
  } catch (error: any) {
    console.error('payment callback error:', error);
  }

  return NextResponse.redirect(redirect || fallback);
}
