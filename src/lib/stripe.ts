import { initPaymentSheet, presentPaymentSheet } from '@stripe/stripe-react-native';
import * as Linking from 'expo-linking';
import { cardianiApi } from '@/lib/api';

export interface CheckoutResult {
  success: boolean;
  error?: string;
  paymentIntentId?: string;
}

/**
 * Initializes and presents Stripe PaymentSheet.
 * The client_secret is securely created on the Cardiani backend.
 */
export async function payWithStripe(
  orderId: string,
  amount: number,
  customerEmail?: string
): Promise<CheckoutResult> {
  try {
    // 1. Fetch client secret from backend (never create PaymentIntent client-side!)
    const intent = await cardianiApi.createPaymentIntent(orderId, amount);

    if (!intent?.client_secret) {
      return { success: false, error: 'Failed to obtain payment client secret.' };
    }

    const returnUrl = Linking.createURL('stripe-redirect');

    // 2. Initialize PaymentSheet
    const { error: initError } = await initPaymentSheet({
      paymentIntentClientSecret: intent.client_secret,
      merchantDisplayName: 'Cardiani Platform',
      returnURL: returnUrl,
      defaultBillingDetails: {
        email: customerEmail,
      },
      allowsDelayedPaymentMethods: false,
    });

    if (initError) {
      return { success: false, error: initError.message };
    }

    // 3. Present PaymentSheet to user
    const { error: presentError } = await presentPaymentSheet();

    if (presentError) {
      if (presentError.code === 'Canceled') {
        return { success: false, error: 'Payment was canceled.' };
      }
      return { success: false, error: presentError.message };
    }

    return {
      success: true,
      paymentIntentId: intent.payment_intent_id,
    };
  } catch (err: any) {
    return {
      success: false,
      error: err?.message || 'Payment processing failed.',
    };
  }
}
