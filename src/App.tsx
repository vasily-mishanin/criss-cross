import { Component, ReactNode } from 'react';
import './App.css';
import { Grid } from './components/Grid/Grid';
import { Modal } from './components/Modal/Modal';
import { getRandomNumber } from './utils/helpers';

interface AppProps {}

interface AppState {
  mode: 'PLAY_WITH_HUMAN' | 'PLAY_WITH_ROBOT' | 'NONE';
  playerOneSign: 'X' | 'O' | 'NONE';
  nextTurn: 'X' | 'O' | 'NONE';
  currentCells: { id: number; zero: boolean; cross: boolean }[];
  winCombinations: [number, number, number][];
}

const initialState: AppState = {
  mode: 'NONE',
  playerOneSign: 'NONE',
  nextTurn: 'NONE',
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

  // state: MyState = {
  //   currentCells: Array.from(Array(9).keys()).map((n) => ({
  //     id: n,
  //     zero: false,
  //     cross: false,
  //   })),
  // };

  handleCellClick(id: number) {
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
      () => {
        //setTimeout(this.robotTurn, 1000);
      }
    );
  }

  robotTurn = (sign: 'zero' | 'cross' = 'zero') => {
    const randomCellId = getRandomNumber(0, 8);
    this.setState((prev) => {
      const clickedCellIndex = prev.currentCells.findIndex(
        (cell) => cell.id === randomCellId
      );

      let updatedCells = [...prev.currentCells];
      updatedCells[clickedCellIndex] = {
        ...updatedCells[clickedCellIndex],
        cross: sign === 'cross' ? true : false,
        zero: sign === 'zero' ? true : false,
      };
      const newState = { ...prev, currentCells: updatedCells };
      return newState;
    });
  };

  handleStartNewGame = () => {
    this.setState(initialState);
  };

  handleHelp = () => {
    this.robotTurn();
  };

  //MODAL OPTIONS
  handleonCrossClick = (sign: 'X' | 'O') => {
    this.setState({ playerOneSign: 'X' });
  };

  handleonZeroClick = (sign: 'X' | 'O') => {
    this.setState({ playerOneSign: 'O' });
  };

  handlePlayWithRobot = () => {
    this.setState({ mode: 'PLAY_WITH_ROBOT', nextTurn: 'X' });
  };

  handlePlayWithHuman = () => {
    this.setState({ mode: 'PLAY_WITH_HUMAN', nextTurn: 'X' });
  };

  render(): ReactNode {
    const nextTurn =
      this.state.nextTurn === 'O'
        ? ' O'
        : this.state.nextTurn === 'X'
        ? ' X'
        : '';
    return (
      <div className='app'>
        <h1 className='app__heading'> Criss-Cross Game</h1>
        <p className='app__message'>Next turn: {nextTurn}</p>
        <Grid
          handleClick={this.handleCellClick.bind(this)}
          currentCells={this.state.currentCells}
        />
        <div className='controls'>
          <button className='controls__btn' onClick={this.handleStartNewGame}>
            Start New Game
          </button>
          <button className='controls__btn' onClick={this.handleHelp}>
            Help Turn
          </button>
        </div>
        {/* MODAL */}
        {this.state.mode === 'NONE' && <div className='backdrop'></div>}
        {this.state.mode === 'NONE' && (
          <Modal
            playerOneSign={this.state.playerOneSign}
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
