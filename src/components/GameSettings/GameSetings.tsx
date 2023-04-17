import { Component } from 'react';
import { Cross } from '../Cross/Cross';
import { Zero } from '../Zero/Zero';
import './GameSettings.css';
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
        ? 'modal__btn checked'
        : 'modal__btn';
    const signsClassO =
      this.props.playerOneSign === ESign.O
        ? 'modal__btn checked'
        : 'modal__btn';

    return (
      <div className='modal'>
        <div className='modal__heading'>
          <h2>Hi! Choose your sign</h2>
          <p>Crosses start the game</p>
        </div>
        <div className='modal_signs'>
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

        <div className='modal__controls'>
          <button
            className='modal__btn'
            onClick={this.props.onRobotClick}
            disabled={this.props.playerOneSign === 'NONE'}
          >
            Play With Robot
          </button>
          <button
            className='modal__btn'
            onClick={this.props.onHumanClick}
            disabled={this.props.playerOneSign === 'NONE'}
          >
            Play With Human
          </button>
        </div>
      </div>
    );
  }
}
