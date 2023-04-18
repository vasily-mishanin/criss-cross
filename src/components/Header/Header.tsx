import styles from './Header.module.css';
import IconGitHub from '../../assets/github.png';
import { ESign } from '../CrissCrossGame/types';

type HeaderProps = {
  gameOver: boolean;
  gameResult: ESign;
};

export function Header({ gameOver, gameResult }: HeaderProps) {
  return (
    <header>
      <a
        className={styles.heading}
        href='https://github.com/vasily-mishanin/criss-cross'
      >
        <img src={IconGitHub} alt="Project's github" />
        <h1>Criss-Cross Game</h1>
      </a>
      <div className={styles.message}>
        {gameOver && (
          <>
            <span className={styles.message__title}> Game Over! </span>
            <span className={styles.message__result}>
              {gameResult === ESign.NONE ? 'DRAW' : ''}
            </span>{' '}
          </>
        )}
      </div>
    </header>
  );
}
