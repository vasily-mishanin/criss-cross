import { Cross } from '../Cross/Cross';
import { Zero } from '../Zero/Zero';
import './Cell.css';
import { CellData } from './types';

type CellProps = {
  id: number;
  top: boolean;
  right: boolean;
  bottom: boolean;
  left: boolean;
  handleClick: (id: number) => void;
  cross?: boolean;
  zero?: boolean;
  //  cellData: CellData;
};

export function Cell({
  top,
  right,
  bottom,
  left,
  id,
  cross,
  zero,
  handleClick,
}: CellProps) {
  const borderWidth = '3px';

  const cellBordersStyle = {
    borderTopWidth: top ? borderWidth : '',
    borderRightWidth: right ? borderWidth : '',
    borderBottomWidth: bottom ? borderWidth : '',
    borderLeftWidth: left ? borderWidth : '',
  };

  return (
    <div
      className='cell'
      style={cellBordersStyle}
      onClick={() => handleClick(id)}
    >
      {zero && <Zero />} {cross && <Cross />}
    </div>
  );
}
