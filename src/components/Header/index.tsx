import Link from 'next/link';
import Image from 'next/image';
import styles from './header.module.scss';

export default function Header(): JSX.Element {
  return (
    <div className={styles.container}>
      <div className={styles.logoContainer}>
        <Link href="/">
          <Image src="/Logo.svg" alt="logo" width={200} height={40} />
        </Link>
      </div>
    </div>
  );
}
