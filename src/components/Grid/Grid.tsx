import { Component, createRef } from 'react';
import { Cell } from '../Cell/Cell';
import './Grid.css';
import soundStroke from '../../assets/sound-stroke.m4a';
import type { Winner } from '../../App';

type GridProps = {
  handleClick: (id: number) => void;
  currentCells: { id: number; zero: boolean; cross: boolean }[];
  winCombination: [number, number, number] | 'NONE';
  winner: Winner;
};

interface GridState {}

export class Grid extends Component<GridProps, GridState> {
  //
  constructor(props: GridProps) {
    super(props);
  }

  componentDidMount() {
    console.log('componentDidMount');
  }

  componentDidUpdate() {
    const canvas = document.getElementById('canvas') as HTMLCanvasElement;
    const ctx = canvas.getContext('2d') as CanvasRenderingContext2D;
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    setTimeout(() => {
      console.log('DRAW LINE');
      if (this.props.winCombination !== 'NONE') {
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
      ctx.strokeStyle =
        winner !== 'NONE' && winner.win === 'X' ? 'black' : 'blue';
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
    let currentAudioSourse = soundStroke;
    let audioCross = new Audio(currentAudioSourse);
    audioCross.play();
  }

  render() {
    const { handleClick, currentCells } = this.props;

    return (
      <section className='grid'>
        <Cell
          id={0}
          top={false}
          right
          bottom
          left={false}
          handleClick={handleClick}
          zero={currentCells[0].zero}
          cross={currentCells[0].cross}
        />
        <Cell
          id={1}
          top={false}
          right
          bottom
          left
          handleClick={handleClick}
          zero={currentCells[1].zero}
          cross={currentCells[1].cross}
        />
        <Cell
          id={2}
          top={false}
          right={false}
          bottom
          left
          handleClick={handleClick}
          zero={currentCells[2].zero}
          cross={currentCells[2].cross}
        />
        {/* /second row/ */}
        <Cell
          id={3}
          top
          right
          bottom
          left={false}
          handleClick={handleClick}
          zero={currentCells[3].zero}
          cross={currentCells[3].cross}
        />
        <Cell
          id={4}
          top
          right
          bottom
          left
          handleClick={handleClick}
          zero={currentCells[4].zero}
          cross={currentCells[4].cross}
        />
        <Cell
          id={5}
          top
          right={false}
          bottom
          left
          handleClick={handleClick}
          zero={currentCells[5].zero}
          cross={currentCells[5].cross}
        />
        {/* /third row/ */}
        <Cell
          id={6}
          top
          right
          bottom={false}
          left={false}
          handleClick={handleClick}
          zero={currentCells[6].zero}
          cross={currentCells[6].cross}
        />
        <Cell
          id={7}
          top
          right
          bottom={false}
          left
          handleClick={handleClick}
          zero={currentCells[7].zero}
          cross={currentCells[7].cross}
        />
        <Cell
          id={8}
          top
          right={false}
          bottom={false}
          left
          handleClick={handleClick}
          zero={currentCells[8].zero}
          cross={currentCells[8].cross}
        />

        <canvas id='canvas' width='240' height='240'></canvas>
      </section>
    );
  }
}
