import { NextRequest, NextResponse } from 'next/server';
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

export async function POST(req: NextRequest, res: NextResponse) {
  console.log("inside checkout_sessions post");
  try {
    // Create Checkout Sessions from body params.
    const session = await stripe.checkout.sessions.create({
      ui_mode: 'embedded',
      line_items: [
        {
          // Provide the exact Price ID (for example, pr_1234) of
          // the product you want to sell
          price: 'price_1PBMUURq87V8v4DoqOANLa6O',
          quantity: 1,
        },
      ],
      mode: 'payment',
      return_url:
        `http://localhost:3000/return?session_id={CHECKOUT_SESSION_ID}`,
    });

    return NextResponse.json({ clientSecret: session.client_secret });
  } catch (err) {
    return NextResponse.json({ err: "Failed" }, { status: 500 })
  }
}


// export default async function handler(req: NextRequest, res: NextResponse) {
//   switch (req.method) {
//     case "POST":
//       try {
//         // Create Checkout Sessions from body params.
//         const session = await stripe.checkout.sessions.create({
//           ui_mode: 'embedded',
//           line_items: [
//             {
//               // Provide the exact Price ID (for example, pr_1234) of
//               // the product you want to sell
//               price: '{{PRICE_ID}}',
//               quantity: 1,
//             },
//           ],
//           mode: 'payment',
//           return_url:
//             `${req.headers.origin}/return?session_id={CHECKOUT_SESSION_ID}`,
//         });

//         NextResponse.json({clientSecret: session.client_secret});
//       } finally {
//       // } catch (err) {
//       //   res.status(err.statusCode || 500).json(err.message);
//       // }
//       break; }
//     case "GET":
//       try {
//         const session =
//           await stripe.checkout.sessions.retrieve(req.query.session_id);

//         NextResponse.json({
//           status: session.status,
//           customer_email: session.customer_details.email
//         });
//       // } catch (err) {
//       //   res.status(err.statusCode || 500).json(err.message);
//       // }
//       } finally {
//       break;
//       }
//     default:
//       NextResponse.setHeader('Allow', req.method!);
//       NextResponse.status(405).end('Method Not Allowed');
//   }
// }