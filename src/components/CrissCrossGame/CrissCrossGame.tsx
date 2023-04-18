import { Component, ReactNode } from 'react';
import styles from './CrissCrossGame.module.css';
import { findOptimalIndex, getWinner } from '../../utils/helpers';
import { Zero } from '../ui/Zero/Zero';
import { Cross } from '../ui/Cross/Cross';
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
import { CellData } from '../Cell/types';
import { Button } from '../ui/Button/Button';
import { Header } from '../Header/Header';

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
        const clickedCellInd = prev.currentCells.findIndex(
          (cell) => cell.id === id
        );

        const updatedCells = [...prev.currentCells];

        if (
          this.isNoSuchCellOrCellIsAlreadySelected(updatedCells, clickedCellInd)
        ) {
          return;
        }

        updatedCells[clickedCellInd] = {
          ...updatedCells[clickedCellInd],
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
      () => this.findWinnerOrContinue({ robotTurn: true })
    );
  }

  isNoSuchCellOrCellIsAlreadySelected(cells: CellData[], id: number) {
    return id === -1 || cells[id].cross || cells[id].zero;
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
        const updatedCells = [...prev.currentCells];

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
      () => this.findWinnerOrContinue({ robotTurn: false })
    );
  };

  // after state chages, like useEffect, find winner/DRAW and game over
  // OR continue the game (HUMAN or ROBOT)
  findWinnerOrContinue(turn: { robotTurn: boolean }) {
    const { robotTurn } = turn;
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

    // if you play with robot - keep playing
    if (this.state.mode === EMode.PLAY_WITH_ROBOT) {
      // if you play with robot and click 'help' then robot should make two turns (help turn and its own turn)
      if (this.state.helpTurn) {
        this.setState({ helpTurn: false }, () =>
          setTimeout(this.robotTurn, 1000)
        );
      } else if (robotTurn) {
        setTimeout(this.robotTurn, 1000);
      }
    }
  }

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
      <div className={styles.app}>
        <Header gameOver={this.state.gameOver} gameResult={gameResult}></Header>
        <section className={styles.playersinfo}>
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
        <div className={styles.controls}>
          <Button onClick={this.handleStartNewGame}>Restart</Button>
          <Button onClick={this.handleHelpTurn}>Help Turn</Button>
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
