import { Component, ReactNode } from 'react';
import './App.css';
import { Grid } from './components/Grid/Grid';

interface MyProps {}

interface MyState {
  // current cells
  currentCells: { id: number; zero: boolean; cross: boolean }[];
  // win cells
}

class App extends Component<MyProps, MyState> {
  constructor(props: MyProps) {
    super(props);
    this.state = {
      currentCells: Array.from(Array(9).keys()).map((n) => ({
        id: n,
        zero: false,
        cross: false,
      })),
    };
  }

  // state: MyState = {
  //   currentCells: Array.from(Array(9).keys()).map((n) => ({
  //     id: n,
  //     zero: false,
  //     cross: false,
  //   })),
  // };

  handleCellClick(id: number) {
    this.setState((prev) => {
      const clickedCellIndex = prev.currentCells.findIndex(
        (cell) => cell.id === id
      );

      let updatedCells = [...prev.currentCells];
      updatedCells[clickedCellIndex] = {
        ...updatedCells[clickedCellIndex],
        cross: true,
      };
      const newState = { ...prev, currentCells: updatedCells };
      return newState;
    });
  }

  render(): ReactNode {
    return (
      <div className='app'>
        <h1> Criss-Cross Game</h1>
        <Grid
          handleClick={this.handleCellClick.bind(this)}
          currentCells={this.state.currentCells}
        />
      </div>
    );
  }
}

export default App;
