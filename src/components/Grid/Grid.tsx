import { Cell } from '../Cell/Cell';
import './Grid.css';

type GridProps = {
  handleClick: (id: number) => void;
  currentCells: { id: number; zero: boolean; cross: boolean }[];
};

export function Grid({ handleClick, currentCells }: GridProps) {
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
    </section>
  );
}
