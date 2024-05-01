'use client';

import React from 'react';
import { loadStripe } from '@stripe/stripe-js';
import {
  EmbeddedCheckoutProvider,
  EmbeddedCheckout
} from '@stripe/react-stripe-js';

const apiKey: string = process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!;

// Configure the Stripe library
const stripePromise = loadStripe(apiKey);

/** Passes the Post function that creates a Checkout Session which
 * returns a client secret as a prop and initializes the checkout
*/
export default function PaymentForm({clientSecret}: {clientSecret: string}) {
  const options = {clientSecret}
return (
    <div id="checkout">
      <EmbeddedCheckoutProvider
        stripe={stripePromise}
        options={options}
      >
        <EmbeddedCheckout />
      </EmbeddedCheckoutProvider>
    </div>
  );
}