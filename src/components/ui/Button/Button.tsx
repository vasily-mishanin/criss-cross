import { ReactNode } from 'react';
import styles from './Button.module.css';

type ButtonProps = {
  onClick: () => void;
  children: ReactNode;
};

export function Button({ children, onClick }: ButtonProps) {
  return (
    <button className={styles.btn} onClick={onClick}>
      {children}
    </button>
  );
}
