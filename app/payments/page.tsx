import React from 'react';
import PaymentForm from '../components/stripe_page/page';
import Stripe from 'stripe';
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);


/** Passes the Post function that creates a Checkout Session which
 * returns a client secret as a prop and initializes the checkout
*/
export default async function Payments() {
  // Create Checkout Sessions from body params.
  const session = await stripe.checkout.sessions.create({
    // customer: '{{CUSTOMER_ID}}',
    ui_mode: 'embedded',
    line_items: [
      {
        // Provide the exact Price ID (for example, pr_1234) of
        // the product you want to sell
        price: process.env.PRICE_ID,
        quantity: 1,
      },
    ],
    mode: 'payment',
    return_url:
      `http://localhost:3000/return?session_id={CHECKOUT_SESSION_ID}`,
  });

  const clientSecret: string = session.client_secret!

  return (
    <div id="checkout">
      <PaymentForm clientSecret={clientSecret}/>
    </div>
  );
}
