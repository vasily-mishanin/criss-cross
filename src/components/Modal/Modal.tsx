import { Component } from 'react';
import { Cross } from '../Cross/Cross';
import { Zero } from '../Zero/Zero';
import './Modal.css';

type ModalProps = {
  playerOneSign: 'X' | 'O' | 'NONE';
  onHumanClick: () => void;
  onRobotClick: () => void;
  onCrossClick: (sign: 'X' | 'O') => void;
  onZeroClick: (sign: 'X' | 'O') => void;
};

type ModalState = {};

export class Modal extends Component<ModalProps, ModalState> {
  constructor(props: ModalProps, state: ModalState) {
    super(props);
  }

  render() {
    const signsClassX =
      this.props.playerOneSign === 'X' ? 'modal__btn checked' : 'modal__btn';
    const signsClassO =
      this.props.playerOneSign === 'O' ? 'modal__btn checked' : 'modal__btn';

    return (
      <div className='modal'>
        <div className='modal__heading'>
          <h2>Hi! Choose your sign</h2>
          <p>Crosses start the game</p>
        </div>
        <div className='modal_signs'>
          <button
            className={signsClassX}
            onClick={() => this.props.onCrossClick('X')}
          >
            <Cross />
          </button>
          <button
            className={signsClassO}
            onClick={() => this.props.onZeroClick('O')}
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
