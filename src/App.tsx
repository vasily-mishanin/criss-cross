import { Component, ReactNode } from 'react';
import './App.css';
import { Cross } from './components/Cross/Cross';
import { Grid } from './components/Grid/Grid';
import { Modal } from './components/Modal/Modal';
import { PlayerInfo } from './components/PlayerInfo/PlayerInfo';
import { Zero } from './components/Zero/Zero';
import { getRandomNumber } from './utils/helpers';
import soundCross from './assets/sound-cross.m4a';
import soundZero from './assets/sound-zero.m4a';
import soundOver from './assets/sound-game-over.m4a';

interface AppProps {}

interface AppState {
  mode: 'PLAY_WITH_HUMAN' | 'PLAY_WITH_ROBOT' | 'NONE';
  playerOne: { sign: 'X' | 'O' | 'NONE'; type: 'HUMAN' | 'ROBOT' | 'NONE' };
  playerTwo: { sign: 'X' | 'O' | 'NONE'; type: 'HUMAN' | 'ROBOT' | 'NONE' };
  nextTurn: 'X' | 'O' | 'NONE';
  gameOver: boolean;
  winner: { win: 'X' | 'O'; combination: [number, number, number] } | 'NONE';
  currentCells: { id: number; zero: boolean; cross: boolean }[];
  winCombinations: [number, number, number][];
  helpTurn: boolean;
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
  helpTurn: false,
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
          prev.nextTurn !== 'NONE' && prev.nextTurn === 'X' ? 'O' : 'X';
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

        // if you play with robot and click 'help' then robot should make two turns (help and his ones)
        if (this.state.helpTurn && this.state.mode === 'PLAY_WITH_ROBOT') {
          this.setState({ helpTurn: false }, () =>
            setTimeout(this.robotTurn, 1000)
          );
        }
      }
    );
  };

  handleStartNewGame = () => {
    let audioRestart = new Audio(soundOver);
    audioRestart.play();
    this.setState(initialState);
  };

  handleHelpTurn = () => {
    this.setState({ helpTurn: true }, () => {
      setTimeout(this.robotTurn, 1000);
    });
  };

  //MODAL OPTIONS
  handleonCrossClick = (sign: 'X' | 'O') => {
    this.setState({ playerOne: { sign: 'X', type: 'HUMAN' } });
  };

  handleonZeroClick = (sign: 'X' | 'O') => {
    this.setState({ playerOne: { sign: 'O', type: 'HUMAN' } });
  };

  handlePlayWithRobot = () => {
    this.setState(
      {
        mode: 'PLAY_WITH_ROBOT',
        nextTurn: 'X',
        playerTwo: {
          sign: this.state.playerOne.sign === 'X' ? 'O' : 'X',
          type: 'ROBOT',
        },
      },
      () => {
        // start with robot turn if enabled
        if (
          this.state.mode === 'PLAY_WITH_ROBOT' &&
          this.state.playerTwo.type === 'ROBOT' &&
          this.state.playerTwo.sign === 'X'
        ) {
          setTimeout(this.robotTurn, 1000);
        }
      }
    );
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

  playSound() {
    let currentAudioSourse =
      this.state.nextTurn === 'X' ? soundCross : soundZero;
    let audio = new Audio(currentAudioSourse);
    audio.play();
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
      this.state.winner !== 'NONE' &&
      this.state.winner.win === 'X'
        ? 'X'
        : this.state.gameOver &&
          this.state.winner !== 'NONE' &&
          this.state.winner.win === 'O'
        ? 'O'
        : 'NONE';

    return (
      <div className='app'>
        <h1 className='app__heading'> Criss-Cross Game</h1>
        <div className='app__message'>
          {this.state.gameOver && (
            <>
              <span> Game Over! </span>
              <span>{gameResult === 'NONE' ? 'DRAW' : ''}</span>{' '}
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
            this.state.winner !== 'NONE'
              ? this.state.winner.combination
              : 'NONE'
          }
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

function findOptimalIndex(
  currentCells: { id: number; zero: boolean; cross: boolean }[],
  winCombinations: [number, number, number][],
  rival: { sign: 'X' | 'O' | 'NONE'; type: 'HUMAN' | 'ROBOT' | 'NONE' }
): number {
  const rivalCells = currentCells
    .filter((cell) => {
      if (rival.sign === 'X') {
        return cell.cross;
      }
      if (rival.sign === 'O') {
        return cell.zero;
      }
    })
    .map((cell) => cell.id);

  const selectedCells = currentCells.reduce((selected: number[], current) => {
    if (current.cross || current.zero) {
      selected.push(current.id);
    }
    return selected;
  }, []);

  console.log('rivalCells', rivalCells);
  console.log('selectedCells', selectedCells);

  // find FIRST combination, that allow rival to make win turn
  const dangerousCombination = winCombinations.find((combination) => {
    let count = 0;

    combination.forEach((id) => {
      if (rivalCells.includes(id)) {
        count++;
      }
    });

    // if two rival cells are in win combination
    // AND this combinations MUST have FREE CELL (not in selectedCells)
    // => dangerous combination
    if (count === 2 && combination.some((id) => !selectedCells.includes(id))) {
      return combination;
    }
  });

  if (dangerousCombination) {
    const idToChoose = dangerousCombination.find(
      (id) => rivalCells.indexOf(id) === -1
    );
    if (idToChoose) {
      console.log('idToChoose ', idToChoose);
      return idToChoose;
    } else {
      throw new Error('Wrong robot algorithm');
    }
  } else {
    // ELSE => just return random free id
    let randomCellId = getRandomNumber(0, 8);
    //find unchecked cell
    while (selectedCells.indexOf(randomCellId) > -1) {
      randomCellId = getRandomNumber(0, 8);
    }
    return randomCellId;
  }
}
