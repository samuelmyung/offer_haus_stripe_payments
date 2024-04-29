import Stripe from "stripe";
import React from "react";
const api_key: string = process.env.TEST_API_KEY!
const stripe = new Stripe(api_key);

export async function Payment() {

const session = await stripe.checkout.sessions.create({
    line_items: [{
        price_data: {
            currency: 'usd',
            product_data: {
                name: 'T-shirt',
            },
            unit_amount: 2000,
        },
        quantity: 1,
    }],
    mode: 'payment',
    ui_mode: 'embedded',
    return_url: 'https://example.com/checkout/return?session_id={CHECKOUT_SESSION_ID}'
}

const App = () => {
    const fetchClientSecret = useCallback(() => {
      // Create a Checkout Session
      return fetch("/create-checkout-session", {
        method: "POST",
      })
        .then((res) => res.json())
        .then((data) => data.clientSecret);
    }, []);

    const options = {fetchClientSecret};
  );


return (
    <div>
        <h2>Hi</h2>
    </div>
)
}
