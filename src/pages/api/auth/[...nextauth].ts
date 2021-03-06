import { query as q } from 'faunadb';

import NextAuth from 'next-auth';
import Providers from 'next-auth/providers';
import { fauna } from '../../../services/fauna';

export default NextAuth({
  providers: [
    Providers.GitHub({
      clientId: process.env.GITHUB_CLIENT_ID,
      clientSecret: process.env.GITHUB_CLIENT_SECRET,
      scope: 'read:user',
    }),
  ],
  // jwt: {
  //   signingKey: process.env.SIGNING_KEY,
  // },
  callbacks: {
    async session(session) {
      try {
        const userActiveSubscription = await fauna.query(
          q.Get(
            q.Intersection(
              q.Match(
                q.Index('subscription_by_user_ref'),
                q.Select(
                  'ref',
                  q.Get(q.Match(q.Index('user_by_email'), q.Casefold(session.user.email))),
                ),
              ),
              q.Match(q.Index('subscription_by_status'), 'active'),
            ),
          ),
        );

        return {
          ...session,
          activeSubscription: userActiveSubscription,
        };
      } catch {
        return {
          ...session,
          activeSubscription: null,
        };
      }
    },

    async signIn(user) {
      const { email } = user;

      try {
        const userByEmail = q.Match(q.Index('user_by_email'), q.Casefold(user.email));

        await fauna.query(
          q.If(
            q.Not(q.Exists(userByEmail)),

            q.Create(q.Collection('users'), {
              data: { email },
            }),

            q.Get(userByEmail),
          ),
        );

        return true;
      } catch {
        return false;
      }
    },
  },
});
