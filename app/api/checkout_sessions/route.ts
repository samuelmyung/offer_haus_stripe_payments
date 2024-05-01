import { NextRequest, NextResponse } from 'next/server';
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

export async function POST() {
  try {
    // Create Checkout Sessions from body params.
    const session = await stripe.checkout.sessions.create({
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

    return NextResponse.json({ clientSecret: session.client_secret });
  } catch (err) {
    return NextResponse.json({ err: "Failed" }, { status: 500 });
  }
}

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const query = searchParams.get('session_id');

    const session =
      await stripe.checkout.sessions.retrieve(query);

    return NextResponse.json({
      status: session.status,
      customer_email: session.customer_details.email
    });
  } catch (err) {
    return NextResponse.json({ err: "Failed" }, { status: 500 });
  }
}


//     default:
//       NextResponse.setHeader('Allow', req.method!);
//       NextResponse.status(405).end('Method Not Allowed');
