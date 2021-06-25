import Image from 'next/image';
import Link from 'next/link';

import styles from './styles.module.scss';

import logo from '../../../public/images/logo.svg';
import { SignInButton } from '../SignInButton';

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
          <a href="/home" className={styles.active}>
            Home
          </a>
          <a href="/posts">Posts</a>
        </nav>

        <SignInButton />
      </div>
    </header>
  );
}
