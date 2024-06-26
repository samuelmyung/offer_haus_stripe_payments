import React from 'react';
import { redirect } from 'next/navigation';
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

/** Retrieves Checkout Session data through a session id and based on the status property
 * either returns a redirect or displays a payment success page
 */
export default async function Return(data: { searchParams: { session_id: string; }; }) {

    const sessionId = data.searchParams.session_id;
    const sessionData = await stripe.checkout.sessions.retrieve(sessionId);

    // Commented out code left for reference as API method
    // const response = await fetch(`http://localhost:3000/api/checkout_sessions?session_id=${sessionId}`, {
    //     method: "GET",
    // });
    // const sessionData = await response.json();

        return (
            sessionData!.status === 'complete'
                ? <section id="success">
                    <p>
                        We appreciate your business! A confirmation email will be sent to {sessionData!.customer_details!.email}.

                        If you have any questions, please email <a href="mailto:orders@example.com">orders@example.com</a>.
                    </p>
                </section>
                : redirect('/')
        );
    }