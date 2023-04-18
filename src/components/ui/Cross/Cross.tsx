import styles from './Cross.module.css';

export function Cross() {
  return (
    <svg viewBox='0 0 10 10' width='60px' height='60px' className={styles.svg1}>
      <path d='M2,2 L2,2' className={styles.svg11} />
      <path d='M8,8 L8,8' className={styles.svg12} />
    </svg>
  );
}
