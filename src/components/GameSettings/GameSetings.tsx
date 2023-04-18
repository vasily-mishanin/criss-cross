import { Component } from 'react';
import { Cross } from '../Cross/Cross';
import { Zero } from '../Zero/Zero';
import styles from './GameSettings.module.css';
import { ESign } from '../CrissCrossGame/types';

type GameSettingsProps = {
  playerOneSign: ESign;
  onHumanClick: () => void;
  onRobotClick: () => void;
  onCrossClick: (sign: Exclude<ESign, ESign.NONE>) => void;
  onZeroClick: (sign: Exclude<ESign, ESign.NONE>) => void;
};

type GameSettingsState = {};

export class GameSettings extends Component<
  GameSettingsProps,
  GameSettingsState
> {
  constructor(props: GameSettingsProps, state: GameSettingsState) {
    super(props);
  }

  render() {
    const signsClassX =
      this.props.playerOneSign === ESign.X
        ? [styles.modal__btn, styles.checked].join(' ')
        : styles.modal__btn;
    const signsClassO =
      this.props.playerOneSign === ESign.O
        ? [styles.modal__btn, styles.checked].join(' ')
        : styles.modal__btn;

    return (
      <div className={styles.modal}>
        <div className={styles.modal__heading}>
          <h2>Hi! Choose your sign</h2>
          <p>Crosses start the game</p>
        </div>
        <div className={styles.modal__signs}>
          <button
            className={signsClassX}
            onClick={() => this.props.onCrossClick(ESign.X)}
          >
            <Cross />
          </button>
          <button
            className={signsClassO}
            onClick={() => this.props.onZeroClick(ESign.O)}
          >
            <Zero />
          </button>
        </div>

        <div className={styles.modal__controls}>
          <button
            className={styles.modal__btn}
            onClick={this.props.onRobotClick}
            disabled={this.props.playerOneSign === ESign.NONE}
          >
            Play With Robot
          </button>
          <button
            className={styles.modal__btn}
            onClick={this.props.onHumanClick}
            disabled={this.props.playerOneSign === ESign.NONE}
          >
            Play With Human
          </button>
        </div>
      </div>
    );
  }
}
