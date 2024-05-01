import Stripe from 'stripe';
import { buffer } from 'micro';
import Cors from 'micro-cors';
import type { NextApiRequest, NextApiResponse } from 'next';
import { NextRequest, NextResponse } from 'next/server';
import { IncomingMessage } from 'http';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET!;

// Stripe requires the raw body to construct the event.
// export const config = {
//   api: {
//     bodyParser: false,
//   },
// };

// const cors = Cors({
//   allowMethods: ['POST', 'HEAD'],
// });

export async function POST(req: NextRequest, res: NextApiResponse) {
  // if (req.method === 'POST') {
    console.log("inside webhook handler ********************************************");
    //console.log("req", req);
    const buf = await req.text();
    const signature = req.headers.get('stripe-signature')!;
    console.log("buf", buf, "signature", signature);
    let event;
    try {
      event = stripe.webhooks.constructEvent(
        buf,
        signature,
        webhookSecret
      );
    } catch (err) {
      // On error, log and return the error message.
      console.log(`❌ Error message: Error`); //TODO: figure out real error message
      return NextResponse.json({ err: "Webhook Error" }, { status: 400 })
    }
    console.log("made it to two");
    // Successfully constructed event.
    console.log('✅ Success:', event.id);

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
    //return res.json({ received: true });
    return NextResponse.json({ received: "true" });

  // } else {
  //   res.setHeader('Allow', 'POST');
  //   res.status(405).end('Method Not Allowed');
  // }
};

//export default cors(POST as any);