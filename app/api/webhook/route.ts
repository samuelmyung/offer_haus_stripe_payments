import Stripe from 'stripe';
import { NextRequest, NextResponse } from 'next/server';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);
const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET!;

/** Webhook route that accepts API calls from Stripe to handle events.
 *
 * This allows Stripe to provide information to us upon successful payment.
 */
export async function POST(req: NextRequest) {

  // creates a usable event from the req body
  const buf = await req.text();
  const signature = req.headers.get('stripe-signature')!;

  let event;
  try {
    event = stripe.webhooks.constructEvent(
      buf,
      signature,
      webhookSecret
    );
  } catch (err) {
    // On error, log and return the error message.
    console.log(`❌ Error message: ${err}`);
    return NextResponse.json({ err }, { status: 400 });
  }

  // Successfully constructed event.
  console.log('✅ Success:', event.id);

  // handles different event types
  switch (event.type) {
    case 'payment_intent.succeeded': {
      const paymentIntent = event.data.object;
      console.log(`PaymentIntent status: ${paymentIntent.status}`);
      break;
    }
    case 'payment_intent.payment_failed': {
      const paymentIntent = event.data.object;
      console.log(
        `❌ Payment failed: ${paymentIntent.last_payment_error?.message}`
      );
      break;
    }
    case 'charge.succeeded': {
      const charge = event.data.object;
      console.log(`Charge id: ${charge.id}`);
      break;
    }
    default: {
      console.warn(`Unhandled event type: ${event.type}`);
      break;
    }
  }

  // Return a response to acknowledge receipt of the event.
  return NextResponse.json({ received: "true" });
};

// template of an event object received in this route
// {
//   "id": "evt_1NG8Du2eZvKYlo2CUI79vXWy",
//   "object": "event",
//   "api_version": "2019-02-19",
//   "created": 1686089970,
//   "data": {
//     "object": {
//       "id": "seti_1NG8Du2eZvKYlo2C9XMqbR0x",
//       "object": "setup_intent",
//       "application": null,
//       "automatic_payment_methods": null,
//       "cancellation_reason": null,
//       "client_secret": "seti_1NG8Du2eZvKYlo2C9XMqbR0x_secret_O2CdhLwGFh2Aej7bCY7qp8jlIuyR8DJ",
//       "created": 1686089970,
//       "customer": null,
//       "description": null,
//       "flow_directions": null,
//       "last_setup_error": null,
//       "latest_attempt": null,
//       "livemode": false,
//       "mandate": null,
//       "metadata": {},
//       "next_action": null,
//       "on_behalf_of": null,
//       "payment_method": "pm_1NG8Du2eZvKYlo2CYzzldNr7",
//       "payment_method_options": {
//         "acss_debit": {
//           "currency": "cad",
//           "mandate_options": {
//             "interval_description": "First day of every month",
//             "payment_schedule": "interval",
//             "transaction_type": "personal"
//           },
//           "verification_method": "automatic"
//         }
//       },
//       "payment_method_types": [
//         "acss_debit"
//       ],
//       "single_use_mandate": null,
//       "status": "requires_confirmation",
//       "usage": "off_session"
//     }
//   },
//   "livemode": false,
//   "pending_webhooks": 0,
//   "request": {
//     "id": null,
//     "idempotency_key": null
//   },
//   "type": "setup_intent.created"
// }
