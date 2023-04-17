import { Component, ReactNode } from 'react';
import './CrissCrossGame.css';
import IconGitHub from '../../assets/github.png';
import { findOptimalIndex, getWinner } from '../../utils/helpers';
import { Zero } from '../Zero/Zero';
import { Cross } from '../Cross/Cross';
import { PlayerInfo } from '../PlayerInfo/PlayerInfo';
import { Grid } from '../Grid/Grid';
import { Modal } from '../Modal/Modal';
import { GameSettings } from '../GameSettings/GameSetings';
import { AppProps, AppState, EMode, EPlayerType, ESign } from './types';
import {
  AUDIO_CROSS,
  AUDIO_RESTART,
  AUDIO_ZERO,
  INITIAL_CELLS,
  WIN_COMBINATIONS,
} from './constants';

const initialState: AppState = {
  mode: EMode.NONE,
  playerOne: { sign: ESign.NONE, type: EPlayerType.NONE },
  playerTwo: { sign: ESign.NONE, type: EPlayerType.NONE },
  nextTurn: ESign.NONE,
  gameOver: false,
  winner: null,
  currentCells: INITIAL_CELLS,
  winCombinations: WIN_COMBINATIONS,
  helpTurn: false,
};

class CrissCrossGame extends Component<AppProps, AppState> {
  constructor(props: AppProps) {
    super(props);
    this.state = initialState;
  }

  componentDidMount(): void {
    const canvas = document.getElementById('canvas') as HTMLCanvasElement;
    const ctx = canvas.getContext('2d') as CanvasRenderingContext2D;

    ctx.fillStyle = 'gray';
    ctx.fillRect(0, 0, 240, 240);
  }

  handleCellClick(id: number) {
    if (this.state.gameOver) {
      return;
    }

    this.setState(
      (prev) => {
        const clickedCellIndex = prev.currentCells.findIndex(
          (cell) => cell.id === id
        );

        if (clickedCellIndex === -1) {
          return;
        }

        let updatedCells = [...prev.currentCells];

        if (
          updatedCells[clickedCellIndex].cross ||
          updatedCells[clickedCellIndex].zero
        ) {
          return;
        }

        updatedCells[clickedCellIndex] = {
          ...updatedCells[clickedCellIndex],
          cross: prev.nextTurn === ESign.X ? true : false,
          zero: prev.nextTurn === ESign.O ? true : false,
        };

        const updatedNextTurn =
          prev.nextTurn !== ESign.NONE && prev.nextTurn === ESign.X
            ? ESign.O
            : ESign.X;
        const newState: AppState = {
          ...prev,
          currentCells: updatedCells,
          nextTurn: updatedNextTurn,
        };
        this.playSound();
        return newState;
      },
      // after state chages, like useEffect, find winner/DRAW and game over
      // OR continue the game (HUMAN or ROBOT)
      () => {
        const newWinner = getWinner(
          this.state.currentCells,
          this.state.winCombinations
        );

        if (newWinner) {
          this.setState({
            winner: { win: newWinner.win, combination: newWinner.combination },
            gameOver: true,
          });
          return;
        }

        // every cell was checked => game over
        if (this.state.currentCells.every((cell) => cell.zero || cell.cross)) {
          this.setState({ gameOver: true });
          return;
        }

        // keep playing
        if (this.state.mode === EMode.PLAY_WITH_ROBOT) {
          setTimeout(this.robotTurn, 1000);
        }
      }
    );
  }

  // ROBOT TURN

  robotTurn = () => {
    if (this.state.gameOver) {
      return;
    }

    const robotGuessId = findOptimalIndex(
      this.state.currentCells,
      this.state.winCombinations,
      this.state.playerOne
    );

    this.setState(
      (prev) => {
        let updatedCells = [...prev.currentCells];

        updatedCells[robotGuessId] = {
          ...updatedCells[robotGuessId],
          cross: prev.nextTurn === 'X' ? true : false,
          zero: prev.nextTurn === 'O' ? true : false,
        };

        const updatedNextTurn =
          prev.nextTurn !== ESign.NONE && prev.nextTurn === ESign.X
            ? ESign.O
            : ESign.X;
        const newState: AppState = {
          ...prev,
          currentCells: updatedCells,
          nextTurn: updatedNextTurn,
        };
        this.playSound();
        return newState;
      },
      // AFTER STATE CHANGES
      () => {
        const newWinner = getWinner(
          this.state.currentCells,
          this.state.winCombinations
        );

        if (newWinner) {
          this.setState({
            winner: { win: newWinner.win, combination: newWinner.combination },
            gameOver: true,
          });
          return;
        }

        // every cell was checked => game over
        if (this.state.currentCells.every((cell) => cell.zero || cell.cross)) {
          this.setState({ gameOver: true });
          return;
        }

        // if you play with robot and click 'help' then robot should make two turns (help and his ones)
        if (this.state.helpTurn && this.state.mode === EMode.PLAY_WITH_ROBOT) {
          this.setState({ helpTurn: false }, () =>
            setTimeout(this.robotTurn, 1000)
          );
        }
      }
    );
  };

  handleStartNewGame = () => {
    this.setBackdrop();
    AUDIO_RESTART.play();
    this.setState(initialState);
  };

  handleHelpTurn = () => {
    if (this.state.gameOver) {
      return;
    }
    this.setState({ helpTurn: true }, () => {
      setTimeout(this.robotTurn, 1000);
    });
  };

  //MODAL OPTIONS
  handleonCrossClick = (sign: 'X' | 'O') => {
    this.setState({ playerOne: { sign: ESign.X, type: EPlayerType.HUMAN } });
  };

  handleonZeroClick = (sign: 'X' | 'O') => {
    this.setState({ playerOne: { sign: ESign.O, type: EPlayerType.HUMAN } });
  };

  handlePlayWithRobot = () => {
    this.removeBackdrop();

    this.setState(
      {
        mode: EMode.PLAY_WITH_ROBOT,
        nextTurn: ESign.X,
        playerTwo: {
          sign: this.state.playerOne.sign === ESign.X ? ESign.O : ESign.X,
          type: EPlayerType.ROBOT,
        },
      },
      () => {
        // start with robot turn if enabled
        if (
          this.state.mode === EMode.PLAY_WITH_ROBOT &&
          this.state.playerTwo.type === EPlayerType.ROBOT &&
          this.state.playerTwo.sign === ESign.X
        ) {
          setTimeout(this.robotTurn, 1000);
        }
      }
    );
  };

  handlePlayWithHuman = () => {
    this.removeBackdrop();
    this.setState({
      mode: EMode.PLAY_WITH_HUMAN,
      nextTurn: ESign.X,
      playerTwo: {
        sign: this.state.playerOne.sign === ESign.X ? ESign.O : ESign.X,
        type: EPlayerType.HUMAN,
      },
    });
  };

  playSound() {
    if (this.state.nextTurn === ESign.X) {
      AUDIO_CROSS.play();
    }
    if (this.state.nextTurn === ESign.O) {
      AUDIO_ZERO.play();
    }
  }

  removeBackdrop() {
    const portal = document.getElementById('backdrop');
    portal?.classList.remove('backdrop');
  }

  setBackdrop() {
    const portal = document.getElementById('backdrop');
    portal?.classList.add('backdrop');
  }

  render(): ReactNode {
    const nextTurn =
      this.state.nextTurn === 'O' ? (
        <Zero />
      ) : this.state.nextTurn === 'X' ? (
        <Cross />
      ) : (
        ''
      );

    const gameResult =
      this.state.gameOver &&
      this.state.winner &&
      this.state.winner.win === ESign.X
        ? ESign.X
        : this.state.gameOver &&
          this.state.winner &&
          this.state.winner.win === ESign.O
        ? ESign.O
        : ESign.NONE;

    return (
      <div className='app'>
        <a
          className='app__heading'
          href='https://github.com/vasily-mishanin/criss-cross'
        >
          <img src={IconGitHub} alt="project's github" />
          <h1>Criss-Cross Game</h1>
        </a>
        <div className='app__message'>
          {this.state.gameOver && (
            <>
              <span className='app__message_title'> Game Over! </span>
              <span className='app__message_result'>
                {gameResult === ESign.NONE ? 'DRAW' : ''}
              </span>{' '}
            </>
          )}
        </div>
        <section className='players-info'>
          <PlayerInfo
            title='Player 1'
            player={this.state.playerOne}
            nextTurn={this.state.nextTurn}
            isWinner={gameResult === this.state.playerOne.sign}
          />
          <PlayerInfo
            title='Player 2'
            player={this.state.playerTwo}
            nextTurn={this.state.nextTurn}
            isWinner={gameResult === this.state.playerTwo.sign}
          />
        </section>
        <Grid
          handleClick={this.handleCellClick.bind(this)}
          currentCells={this.state.currentCells}
          winCombination={
            this.state.winner ? this.state.winner.combination : null
          }
          winner={this.state.winner}
        />
        <div className='controls'>
          <button className='controls__btn' onClick={this.handleStartNewGame}>
            Restart
          </button>
          <button className='controls__btn' onClick={this.handleHelpTurn}>
            Help Turn
          </button>
        </div>
        {/* MODAL */}
        {this.state.mode === EMode.NONE && (
          <Modal>
            <GameSettings
              playerOneSign={this.state.playerOne.sign}
              onRobotClick={this.handlePlayWithRobot}
              onHumanClick={this.handlePlayWithHuman}
              onCrossClick={this.handleonCrossClick}
              onZeroClick={this.handleonZeroClick}
            />
          </Modal>
        )}
      </div>
    );
  }
}

export default CrissCrossGame;
