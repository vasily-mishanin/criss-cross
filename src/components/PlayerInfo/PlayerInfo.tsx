import { Component, ReactNode } from 'react';
import styles from './PlayerInfo.module.css';
import IconRobot from '../../assets/robot.png';
import IconHuman from '../../assets/human.png';
import { Cross } from '../ui/Cross/Cross';
import { Zero } from '../ui/Zero/Zero';
import { ESign, EPlayerType, Player } from '../CrissCrossGame/types';

type PlayerInfoProps = {
  nextTurn: ESign;
  player: Player;
  title: string;
  isWinner: boolean;
};

export class PlayerInfo extends Component<PlayerInfoProps> {
  constructor(props: PlayerInfoProps) {
    super(props);
  }

  render(): ReactNode {
    const { title, player, nextTurn, isWinner } = this.props;

    const playerTitleClass =
      nextTurn === player.sign
        ? [styles.info__title, styles.active].join(' ')
        : styles.info__title;
    const playerClass = isWinner
      ? [styles.wrapper, styles.winner].join(' ')
      : styles.wrapper;

    return (
      <div className={playerClass}>
        <p className={styles.info}>
          <span className={playerTitleClass}>{title}</span>
          <img
            src={player.type === EPlayerType.HUMAN ? IconHuman : IconRobot}
            alt={
              player.type === EPlayerType.HUMAN
                ? 'Player human'
                : 'Player robot'
            }
          />
          <span className={styles.info__sign}>
            {player.sign === ESign.X ? <Cross /> : <Zero />}
          </span>
          <span className={styles.info__win}>{isWinner && 'WIN!'}</span>
        </p>
      </div>
    );
  }
}
