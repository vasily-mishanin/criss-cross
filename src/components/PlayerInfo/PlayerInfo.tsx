import { Component, ReactNode } from 'react';
import './PlayerInfo.css';
import IconRobot from '../../assets/robot.png';
import IconHuman from '../../assets/human.png';
import { Cross } from '../Cross/Cross';
import { Zero } from '../Zero/Zero';

type PlayerInfoProps = {
  nextTurn: 'X' | 'O' | 'NONE';
  player: { sign: 'X' | 'O' | 'NONE'; type: 'HUMAN' | 'ROBOT' | 'NONE' };
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
        ? 'payer-info__title player-active'
        : 'payer-info__title';

    const playerClass = isWinner ? 'payer-wrapper winner' : 'payer-wrapper';

    return (
      <div className={playerClass}>
        <p className='payer-info'>
          <span className={playerTitleClass}>{title}</span>
          <img
            src={player.type === 'HUMAN' ? IconHuman : IconRobot}
            alt={player.type === 'HUMAN' ? 'human' : 'robot'}
          />
          <span className='payer-info__sign'>
            {player.sign === 'X' ? <Cross /> : <Zero />}
          </span>
          <span className='payer-info__win'>{isWinner && 'WIN!'}</span>
        </p>
      </div>
    );
  }
}
