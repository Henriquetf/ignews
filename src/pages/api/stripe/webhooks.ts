import { NextApiHandler } from 'next';
import { Readable } from 'stream';
import Stripe from 'stripe';
import { stripe } from '../../../services/stripe';
import { saveSubscription } from '../_lib/manageSubscription';

async function buffer(readable: Readable) {
  const chunks = [];

  for await (const chunk of readable) {
    chunks.push(typeof chunk === 'string' ? Buffer.from(chunk) : chunk);
  }

  return Buffer.concat(chunks);
}

export const config = {
  api: {
    bodyParser: false,
  },
};

const relevantEvents = new Set([
  'checkout.session.completed',
  // 'customer.subscription.created',
  'customer.subscription.updated',
  'customer.subscription.deleted',
]);

const stripeWebhooksHandler: NextApiHandler = async (request, response) => {
  if (request.method === 'POST') {
    const buf = await buffer(request);
    const secret = request.headers['stripe-signature'];

    let event: Stripe.Event;

    try {
      event = stripe.webhooks.constructEvent(buf, secret, process.env.STRIPE_WEBHOOK_SECRET);
    } catch (err) {
      response.status(400).send(`Webhook error: ${err.message}`);

      return;
    }

    const { type } = event;

    if (relevantEvents.has(type)) {
      try {
        switch (type) {
          case 'checkout.session.completed': {
            const checkoutSession = event.data.object as Stripe.Checkout.Session;

            await saveSubscription({
              customerId: checkoutSession.customer.toString(),
              subscriptionId: checkoutSession.subscription.toString(),
            });

            break;
          }

          // case 'customer.subscription.created':
          case 'customer.subscription.updated':
          case 'customer.subscription.deleted': {
            const subscription = event.data.object as Stripe.Subscription;

            await saveSubscription({
              customerId: subscription.customer.toString(),
              subscriptionId: subscription.id,
              // createAction: type === 'customer.subscription.created',
            });

            break;
          }

          default: {
            throw new Error('Unhandled event');
          }
        }
      } catch (err) {
        response.json({
          error: 'Webhook handler failed.',
        });
      }
    } else {
      response.json({ received: true });
    }
  } else {
    response.setHeader('Allow', 'POST');
    response.status(405).end('Method not allowed');
  }
};

export default stripeWebhooksHandler;
