import { Component } from 'react';
import { Cell } from '../Cell/Cell';
import styles from './Grid.module.css';
import { ESign, Winner } from '../CrissCrossGame/types';
import { AUDIO_STROKE } from './constants';

type GridProps = {
  handleClick: (id: number) => void;
  currentCells: { id: number; zero: boolean; cross: boolean }[];
  winCombination: [number, number, number] | null;
  winner: Winner;
};

interface GridState {}

export class Grid extends Component<GridProps, GridState> {
  //
  constructor(props: GridProps) {
    super(props);
  }

  componentDidUpdate() {
    const canvas = document.getElementById('canvas') as HTMLCanvasElement;
    const ctx = canvas.getContext('2d') as CanvasRenderingContext2D;
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    setTimeout(() => {
      console.log('DRAW LINE');
      if (this.props.winCombination !== null) {
        this.playSound();
        this.drawLine(this.props.winCombination);
      }
    }, 1000);
  }

  drawLine(combination: [number, number, number]) {
    console.log('drawLine');
    const { winner } = this.props;

    const canvas = document.getElementById('canvas') as HTMLCanvasElement;
    if (canvas.getContext) {
      const ctx = canvas.getContext('2d') as CanvasRenderingContext2D;
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.lineWidth = 4;
      ctx.strokeStyle = winner && winner.win === ESign.X ? 'black' : 'blue';
      let combinationStr = combination.join('');

      switch (combinationStr) {
        case '012':
          ctx.beginPath();
          ctx.moveTo(0, 40);
          ctx.lineTo(240, 40);
          ctx.closePath();
          ctx.stroke();
          break;
        case '345':
          ctx.beginPath();
          ctx.moveTo(0, 120);
          ctx.lineTo(240, 120);
          ctx.closePath();
          ctx.stroke();
          break;
        case '678':
          ctx.beginPath();
          ctx.moveTo(0, 200);
          ctx.lineTo(240, 200);
          ctx.closePath();
          ctx.stroke();
          break;
        case '036':
          ctx.beginPath();
          ctx.moveTo(40, 0);
          ctx.lineTo(40, 240);
          ctx.closePath();
          ctx.stroke();
          break;
        case '147':
          ctx.moveTo(120, 0);
          ctx.lineTo(120, 240);
          ctx.closePath();
          ctx.stroke();
          break;
        case '258':
          ctx.beginPath();
          ctx.moveTo(200, 0);
          ctx.lineTo(200, 240);
          ctx.closePath();
          ctx.stroke();
          break;
        case '048':
          ctx.beginPath();
          ctx.moveTo(0, 0);
          ctx.lineTo(240, 240);
          ctx.closePath();
          ctx.stroke();
          break;
        case '246':
          ctx.beginPath();
          ctx.moveTo(240, 0);
          ctx.lineTo(0, 240);
          ctx.closePath();
          ctx.stroke();
          break;
      }
    }
  }

  playSound() {
    AUDIO_STROKE.play();
  }

  render() {
    const { handleClick, currentCells } = this.props;
    console.log('currentCells ', currentCells);

    return (
      <section className={styles.grid}>
        {currentCells.map((cell) => {
          const cellData = { id: cell.id, cross: cell.cross, zero: cell.zero };
          const id = cellData.id;
          return (
            <Cell
              cellData={cellData}
              top={id !== 0 && id !== 1 && id !== 2}
              right={id !== 2 && id !== 5 && id !== 8}
              bottom={id !== 6 && id !== 7 && id !== 8}
              left={id !== 0 && id !== 3 && id !== 6}
              handleClick={handleClick}
              key={cell.id}
            />
          );
        })}

        <canvas id='canvas' width='240' height='240'></canvas>
      </section>
    );
  }
}
