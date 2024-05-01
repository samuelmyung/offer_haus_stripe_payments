import React from 'react';
import { redirect } from 'next/navigation';

const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

/** Retrieves Checkout Session data through a session id and based on the status property
 * either returns a redirect or displays a payment success page
 */
export default async function Return(data: { searchParams: { session_id: string; }; }) {

    const sessionId = data.searchParams.session_id;
    const sessionData = await stripe.checkout.sessions.retrieve(sessionId);
    console.log("####################", sessionData)
    // const response = await fetch(`http://localhost:3000/api/checkout_sessions?session_id=${sessionId}`, {
    //     method: "GET",
    // });
    // const sessionData = await response.json();

    if (sessionData!.status === 'open') {
        return (
            redirect('/')
        );
    }

    if (sessionData!.status === 'complete') {
        return (
            <section id="success">
                <p>
                    We appreciate your business! A confirmation email will be sent to {sessionData!.customer_email}.

                    If you have any questions, please email <a href="mailto:orders@example.com">orders@example.com</a>.
                </p>
            </section>
        );
    }

    return null;
}