import { query as q } from 'faunadb';
import { NextApiHandler } from 'next';
import { getSession } from 'next-auth/client';
import { fauna } from '../../services/fauna';
import { stripe } from '../../services/stripe';

interface User {
  ref: {
    id: string;
  };
  data: {
    email: string;
    stripe_customer_id?: string;
  };
}

const subscribeHandler: NextApiHandler = async (request, response) => {
  if (request.method === 'POST') {
    const session = await getSession({
      req: request,
    });

    const user = await fauna.query<User>(
      q.Get(q.Match(q.Index('user_by_email'), q.Casefold(session.user.email))),
    );

    let stripeCustomerId = user.data.stripe_customer_id;

    if (!stripeCustomerId) {
      const stripeCustomer = await stripe.customers.create({
        email: session.user.email,
      });

      stripeCustomerId = stripeCustomer.id;

      await fauna.query(
        q.Update(q.Ref(q.Collection('users'), user.ref.id), {
          data: {
            stripe_customer_id: stripeCustomerId,
          },
        }),
      );
    }

    const stripeCheckoutSession = await stripe.checkout.sessions.create({
      customer: stripeCustomerId,
      payment_method_types: ['card'],
      billing_address_collection: 'required',
      line_items: [
        {
          price: process.env.STRIPE_SUBSCRIPTION_PRODUCT_ID,
          quantity: 1,
        },
      ],
      mode: 'subscription',
      allow_promotion_codes: true,
      success_url: `${process.env.NEXT_PUBLIC_APP_URL}/posts`,
      cancel_url: process.env.NEXT_PUBLIC_APP_URL,
    });

    response.status(200).json({
      sessionId: stripeCheckoutSession.id,
    });
  } else {
    response.setHeader('Allow', 'POST');
    response.status(405).end('Method not allowed');
  }
};

export default subscribeHandler;
