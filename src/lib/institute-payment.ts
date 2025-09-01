declare global {
  interface Window {
    Razorpay: any;
  }
}

export interface InstitutePaymentOptions {
  amount: number;
  currency?: string;
  receipt?: string;
  notes?: Record<string, string>;
  instituteData: {
    name: string;
    email: string;
    phone: string;
    [key: string]: any;
  };
}

export interface InstitutePaymentInstance {
  razorpay: any;
  orderData: any;
  openPayment: () => Promise<any>;
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

export const createInstitutePaymentOrder = async (
  amount: number, 
  currency: string = 'INR', 
  receipt?: string, 
  notes?: Record<string, string>,
  instituteData?: any
) => {
  const response = await fetch('/api/payments/institute-registration', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      amount,
      currency,
      receipt,
      notes,
      instituteData,
    }),
  });

  if (!response.ok) {
    throw new Error('Failed to create payment order');
  }

  return response.json();
};

export const verifyInstitutePayment = async (
  razorpay_order_id: string,
  razorpay_payment_id: string,
  razorpay_signature: string,
  instituteData: any,
  amount: number
) => {
  const response = await fetch('/api/payments/verify-institute-registration', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
      instituteData,
      amount,
    }),
  });

  if (!response.ok) {
    throw new Error('Failed to verify payment');
  }

  return response.json();
};

export const initiateInstitutePayment = async (options: InstitutePaymentOptions): Promise<InstitutePaymentInstance> => {
  try {
    // Load Razorpay script
    await loadRazorpayScript();

    // Create payment order
    const orderResponse = await createInstitutePaymentOrder(
      options.amount,
      options.currency,
      options.receipt,
      options.notes,
      options.instituteData
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
      description: `Institute Registration - ${options.instituteData.name}`,
      order_id: orderResponse.order.id,
      prefill: {
        name: options.instituteData.name,
        email: options.instituteData.email,
        contact: options.instituteData.phone || '',
      },
      notes: {
        paymentType: 'institute_registration',
        instituteName: options.instituteData.name,
        instituteEmail: options.instituteData.email,
        ...options.notes,
      },
      theme: {
        color: '#3B82F6',
      },
      handler: async function (response: any) {
        try {
          // Verify payment on server
          const verificationResponse = await verifyInstitutePayment(
            response.razorpay_order_id,
            response.razorpay_payment_id,
            response.razorpay_signature,
            options.instituteData,
            orderResponse.order.amount
          );

          if (verificationResponse.success) {
            return {
              success: true,
              paymentId: response.razorpay_payment_id,
              registrationId: verificationResponse.registrationId,
            };
          } else {
            throw new Error('Payment verification failed');
          }
        } catch (error) {
          throw error;
        }
      },
    };

    // Create Razorpay instance but don't open automatically
    const razorpay = new window.Razorpay(razorpayOptions);
    
    // Return the configured Razorpay instance and order data
    return {
      razorpay,
      orderData: orderResponse.order,
      openPayment: () => {
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
      }
    };
  } catch (error) {
    throw error;
  }
};
