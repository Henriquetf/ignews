import Head from 'next/head';
import React from 'react';
import Image from 'next/image';

import { SubscribeButton } from '../components/SubscribeButton';

import styles from './home.module.scss';

import avatar from '../../public/images/avatar.svg';

export default function Home() {
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
            <span>for $9.90 per month</span>
          </p>

          <SubscribeButton />
        </section>

        <Image src={avatar} alt="Girl coding" />
      </main>
    </>
  );
}
