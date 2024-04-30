"use client"

import { useCallback } from "react";
import {loadStripe} from '@stripe/stripe-js';
import {
    EmbeddedCheckoutProvider,
    EmbeddedCheckout
} from '@stripe/react-stripe-js';

const api_key: string = process.env.TEST_API_KEY!;
const stripePromise = loadStripe(api_key);

export default function Checkout() {
    const fetchClientSecret = useCallback(() => {
        // Create a Checkout Session
        return fetch("/create-checkout-session", {
          method: "POST",
        })
          .then((res) => res.json())
          .then((data) => data.clientSecret);
      }, []);

    const options = {fetchClientSecret};

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