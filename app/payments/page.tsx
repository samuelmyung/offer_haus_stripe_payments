'use client';
import React, { useCallback } from 'react';
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
export default function Payment() {
  const fetchClientSecret = async () => {
    // Create a Checkout Session
    const response = await fetch("/api/checkout_sessions", {
      method: "POST",
    });

    const data = await response.json();
    return data.clientSecret;
  };

  const options = { fetchClientSecret };

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
