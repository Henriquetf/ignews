import Head from 'next/head';
import React from 'react';
import Image from 'next/image';

import { GetStaticProps } from 'next';
import { SubscribeButton } from '../components/SubscribeButton';

import styles from './home.module.scss';

import avatar from '../../public/images/avatar.svg';
import { stripe } from '../services/stripe';

interface HomeProps {
  product: {
    priceId: string;
    amount: string;
  };
}

export default function Home({ product }: HomeProps) {
  return (
    <>
      <Head>
        <title>Home | ig.news</title>
      </Head>

      <main className={styles.contentContainer}>
        <section className={styles.hero}>
          <span>👏 Hey, welcome</span>

          <h1>
            News about
            <br />
            the <span>React</span> world
          </h1>

          <p>
            Get access to all the publications
            <span>for {product.amount} per month</span>
          </p>

          <SubscribeButton priceId={product.priceId} />
        </section>

        <Image src={avatar} alt="Girl coding" />
      </main>
    </>
  );
}

export const getStaticProps: GetStaticProps<HomeProps> = async () => {
  const price = await stripe.prices.retrieve(process.env.STRIPE_SUBSCRIPTION_PRODUCT_ID);

  const product = {
    priceId: price.id,
    amount: new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(price.unit_amount / 100),
  };

  return {
    props: {
      product,
    },
    revalidate: 60 * 60 * 24, // 24 hours
  };
};
