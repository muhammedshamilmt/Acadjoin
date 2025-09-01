declare global {
  interface Window {
    Razorpay: any;
  }
}

export interface PaymentOptions {
  amount: number;
  currency?: string;
  receipt?: string;
  notes?: Record<string, string>;
  userId: string;
  connectedPersonId: string;
  userName: string;
  userEmail: string;
  userPhone?: string;
  userMobile?: string;
}

export const loadRazorpayScript = (): Promise<void> => {
  return new Promise((resolve, reject) => {
    if (window.Razorpay) {
      resolve();
      return;
    }

    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.onload = () => resolve();
    script.onerror = () => reject(new Error('Failed to load Razorpay script'));
    document.body.appendChild(script);
  });
};

export const createPaymentOrder = async (amount: number, currency: string = 'INR', receipt?: string, notes?: Record<string, string>) => {
  const response = await fetch('/api/payments/create-order', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      amount,
      currency,
      receipt,
      notes,
    }),
  });

  if (!response.ok) {
    throw new Error('Failed to create payment order');
  }

  return response.json();
};

export const verifyPayment = async (
  razorpay_order_id: string,
  razorpay_payment_id: string,
  razorpay_signature: string,
  userId: string,
  connectedPersonId: string,
  amount: number
) => {
  const response = await fetch('/api/payments/verify', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
      userId,
      connectedPersonId,
      amount,
    }),
  });

  if (!response.ok) {
    throw new Error('Failed to verify payment');
  }

  return response.json();
};

export const initiatePayment = async (options: PaymentOptions) => {
  try {
    // Load Razorpay script
    await loadRazorpayScript();

    // Create payment order
    const orderResponse = await createPaymentOrder(
      options.amount,
      options.currency,
      options.receipt,
      options.notes
    );

    if (!orderResponse.success) {
      throw new Error('Failed to create payment order');
    }

    // Configure Razorpay options
    const razorpayOptions = {
      key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID || 'rzp_test_uygrrtKtEWuv1x',
      amount: orderResponse.order.amount,
      currency: orderResponse.order.currency,
      name: 'Acadjoin',
      description: `Quick Connect with ${options.userName}`,
      order_id: orderResponse.order.id,
             prefill: {
         name: options.userName,
         email: options.userEmail,
         contact: options.userMobile || options.userPhone || '',
       },
      notes: {
        userId: options.userId,
        connectedPersonId: options.connectedPersonId,
        ...options.notes,
      },
      theme: {
        color: '#3B82F6',
      },
      handler: async function (response: any) {
        try {
          // Verify payment on server
          const verificationResponse = await verifyPayment(
            response.razorpay_order_id,
            response.razorpay_payment_id,
            response.razorpay_signature,
            options.userId,
            options.connectedPersonId,
            orderResponse.order.amount
          );

          if (verificationResponse.success) {
            return {
              success: true,
              paymentId: response.razorpay_payment_id,
              connectionId: verificationResponse.connectionId,
            };
          } else {
            throw new Error('Payment verification failed');
          }
        } catch (error) {
          console.error('Payment verification error:', error);
          throw error;
        }
      },
    };

    // Open Razorpay modal
    const razorpay = new window.Razorpay(razorpayOptions);
    return new Promise((resolve, reject) => {
      razorpay.on('payment.failed', function (response: any) {
        reject(new Error('Payment failed'));
      });

      razorpay.on('payment.success', async function (response: any) {
        try {
          const result = await razorpayOptions.handler(response);
          resolve(result);
        } catch (error) {
          reject(error);
        }
      });

      razorpay.open();
    });
  } catch (error) {
    console.error('Payment initiation error:', error);
    throw error;
  }
};
