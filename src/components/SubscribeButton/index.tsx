import { signIn, useSession } from 'next-auth/client';
import { useRouter } from 'next/dist/client/router';
import { useCallback } from 'react';

import { postSubscribe } from '../../services/api';
import { getStripeJs } from '../../services/stripe-js';
import styles from './styles.module.scss';

interface SubscribeButtonProps {
  priceId: string;
}

export function SubscribeButton({ priceId }: SubscribeButtonProps) {
  const [session] = useSession();
  const router = useRouter();

  const handleSubscribe = useCallback(async () => {
    if (!session) {
      signIn('github');
      return;
    }

    if (session.activeSubscription) {
      router.push('/posts');

      return;
    }

    try {
      const { sessionId } = await postSubscribe();

      const stripe = await getStripeJs();

      await stripe.redirectToCheckout({
        sessionId,
      });
    } catch (err) {
      alert(err.message);
    }
  }, [session, router]);

  return (
    <button type="button" className={styles.subscribeButton} onClick={handleSubscribe}>
      Subscribe now
    </button>
  );
}
