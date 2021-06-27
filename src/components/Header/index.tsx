import Image from 'next/image';
import Link from 'next/link';

import styles from './styles.module.scss';
import logo from '../../../public/images/logo.svg';
import { SignInButton } from '../SignInButton';
import { ActiveLink } from '../ActiveLink';

export function Header() {
  return (
    <header className={styles.headerContainer}>
      <div className={styles.headerContent}>
        <Link href="/">
          <a>
            <Image src={logo} alt="ig.news" />
          </a>
        </Link>

        <nav className={styles.headerNav}>
          <ActiveLink activeClassName={styles.active} href="/">
            <a>Home</a>
          </ActiveLink>
          <ActiveLink activeClassName={styles.active} href="/posts" prefetch>
            <a>Posts</a>
          </ActiveLink>
        </nav>

        <SignInButton />
      </div>
    </header>
  );
}
