import styles from './Zero.module.css';

export function Zero() {
  return (
    <svg className={styles.zero} width={60} height={60}>
      <ellipse cx='30' cy='30' rx='20' ry='25' />
    </svg>
  );
}
