import { FaGithub } from 'react-icons/fa';
import { FiX } from 'react-icons/fi';
import { signIn, signOut, useSession } from 'next-auth/client';

import { useCallback } from 'react';
import styles from './styles.module.scss';

export function SignInButton() {
  const [session] = useSession();

  const handleSignIn = useCallback(() => {
    signIn('github');
  }, []);

  const handleSignOut = useCallback(() => {
    signOut();
  }, []);

  return session ? (
    <button type="button" className={styles.signInButton} onClick={handleSignOut}>
      <FaGithub color="#04d361" />
      {session.user.name}
      <FiX color="#737380" />
    </button>
  ) : (
    <button type="button" className={styles.signInButton} onClick={handleSignIn}>
      <FaGithub color="#EBA417" />
      Sign in with GitHub
    </button>
  );
}
