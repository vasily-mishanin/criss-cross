import { Component, ReactNode } from 'react';
import './App.css';
import { Grid } from './components/Grid/Grid';
import { Modal } from './components/Modal/Modal';
import { getRandomNumber } from './utils/helpers';

interface AppProps {}

interface AppState {
  mode: 'PLAY_WITH_HUMAN' | 'PLAY_WITH_ROBOT' | 'NONE';
  playerOne: { sign: 'X' | 'O' | 'NONE'; type: 'HUMAN' | 'NONE' };
  playerTwo: { sign: 'X' | 'O' | 'NONE'; type: 'HUMAN' | 'ROBOT' | 'NONE' };
  nextTurn: 'X' | 'O' | 'NONE';
  gameOver: boolean;
  winner: { win: 'X' | 'O'; combination: [number, number, number] } | 'NONE';
  currentCells: { id: number; zero: boolean; cross: boolean }[];
  winCombinations: [number, number, number][];
}

const initialState: AppState = {
  mode: 'NONE',
  playerOne: { sign: 'NONE', type: 'NONE' },
  playerTwo: { sign: 'NONE', type: 'NONE' },
  nextTurn: 'NONE',
  gameOver: false,
  winner: 'NONE',
  currentCells: Array.from(Array(9).keys()).map((n) => ({
    id: n,
    zero: false,
    cross: false,
  })),
  winCombinations: [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ],
};

class App extends Component<AppProps, AppState> {
  constructor(props: AppProps) {
    super(props);
    this.state = initialState;
  }

  componentDidUpdate(previousProps: any, previousState: any) {
    console.log('componentDidUpdate');
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
          cross: prev.nextTurn === 'X' ? true : false,
          zero: prev.nextTurn === 'O' ? true : false,
        };

        const updatedNextTurn =
          prev.nextTurn !== 'NONE' && prev.nextTurn === 'X' ? 'O' : 'X';
        const newState: AppState = {
          ...prev,
          currentCells: updatedCells,
          nextTurn: updatedNextTurn,
        };
        return newState;
      },
      // after state chages, like useEffect, find winner/DRAW and game over
      // OR continue the game (HUMAN or ROBOT)
      () => {
        const newWinner = getWinner(
          this.state.currentCells,
          this.state.winCombinations
        );

        if (newWinner !== 'NONE') {
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
        if (this.state.mode === 'PLAY_WITH_ROBOT') {
          this.robotTurn();
        }
      }
    );
  }

  // ROBOT TURN

  robotTurn = () => {
    let randomCellId = getRandomNumber(0, 8);
    const selectedCells = this.state.currentCells.map((cell) => cell.id);
    //find uncheecked cell
    while (selectedCells.indexOf(randomCellId) === -1) {
      randomCellId = getRandomNumber(0, 8);
    }

    this.setState((prev) => {
      let updatedCells = [...prev.currentCells];
      updatedCells[clickedCellIndex] = {
        ...updatedCells[clickedCellIndex],
        cross: prev.nextTurn === 'X' ? true : false,
        zero: prev.nextTurn === 'O' ? true : false,
      };

      const updatedNextTurn =
        prev.nextTurn !== 'NONE' && prev.nextTurn === 'X' ? 'O' : 'X';
      const newState: AppState = {
        ...prev,
        currentCells: updatedCells,
        nextTurn: updatedNextTurn,
      };
      return newState;
    });
  };

  handleStartNewGame = () => {
    this.setState(initialState);
  };

  handleHelpTurn = () => {
    this.robotTurn();
  };

  //MODAL OPTIONS
  handleonCrossClick = (sign: 'X' | 'O') => {
    this.setState({ playerOne: { sign: 'X', type: 'HUMAN' } });
  };

  handleonZeroClick = (sign: 'X' | 'O') => {
    this.setState({ playerOne: { sign: 'O', type: 'HUMAN' } });
  };

  handlePlayWithRobot = () => {
    this.setState({
      mode: 'PLAY_WITH_ROBOT',
      nextTurn: 'X',
      playerTwo: {
        sign: this.state.playerOne.sign === 'X' ? 'O' : 'X',
        type: 'ROBOT',
      },
    });
  };

  handlePlayWithHuman = () => {
    this.setState({
      mode: 'PLAY_WITH_HUMAN',
      nextTurn: 'X',
      playerTwo: {
        sign: this.state.playerOne.sign === 'X' ? 'O' : 'X',
        type: 'HUMAN',
      },
    });
  };

  render(): ReactNode {
    const nextTurn =
      this.state.nextTurn === 'O'
        ? ' O'
        : this.state.nextTurn === 'X'
        ? ' X'
        : '';

    const gameResult =
      this.state.gameOver && this.state.winner === 'NONE'
        ? 'DRAW'
        : this.state.gameOver &&
          this.state.winner !== 'NONE' &&
          this.state.winner.win === 'X'
        ? 'X'
        : 'O';

    return (
      <div className='app'>
        <h1 className='app__heading'> Criss-Cross Game</h1>
        {!this.state.gameOver && (
          <p className='app__message'>
            Next turn: <span>{nextTurn}</span>
          </p>
        )}
        {this.state.gameOver && (
          <p className='app__message'>
            Game Over:{' '}
            <span>
              {gameResult !== 'DRAW' ? gameResult + ' wins!' : gameResult}
            </span>{' '}
          </p>
        )}
        <Grid
          handleClick={this.handleCellClick.bind(this)}
          currentCells={this.state.currentCells}
        />
        <div className='controls'>
          <button className='controls__btn' onClick={this.handleStartNewGame}>
            Start New Game
          </button>
          <button className='controls__btn' onClick={this.handleHelpTurn}>
            Help Turn
          </button>
        </div>
        {/* MODAL */}
        {this.state.mode === 'NONE' && <div className='backdrop'></div>}
        {this.state.mode === 'NONE' && (
          <Modal
            playerOneSign={this.state.playerOne.sign}
            onRobotClick={this.handlePlayWithRobot}
            onHumanClick={this.handlePlayWithHuman}
            onCrossClick={this.handleonCrossClick}
            onZeroClick={this.handleonZeroClick}
          />
        )}
      </div>
    );
  }
}

export default App;

function getWinner(
  currentCells: { id: number; zero: boolean; cross: boolean }[],
  winCombinations: [number, number, number][]
): { win: 'X' | 'O'; combination: [number, number, number] } | 'NONE' {
  let currentCrossCombinations = currentCells.reduce(
    (checkedCells: number[], currentCell) => {
      if (currentCell.cross && !currentCell.zero) {
        checkedCells.push(currentCell.id);
      }
      return checkedCells;
    },
    []
  );

  let currentZeroCombinations = currentCells.reduce(
    (checkedCells: number[], currentCell) => {
      if (!currentCell.cross && currentCell.zero) {
        checkedCells.push(currentCell.id);
      }
      return checkedCells;
    },
    []
  );

  let crossWinComb = winCombinations.find((combination) =>
    combination.every((id) => currentCrossCombinations.indexOf(id) > -1)
  );

  let zeroWinComb = winCombinations.find((combination) =>
    combination.every((id) => currentZeroCombinations.indexOf(id) > -1)
  );

  if (crossWinComb && !zeroWinComb) {
    return { win: 'X', combination: crossWinComb };
  }
  if (!crossWinComb && zeroWinComb) {
    return { win: 'O', combination: zeroWinComb };
  }
  return 'NONE';
}
