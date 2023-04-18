import { Cross } from '../ui/Cross/Cross';
import { Zero } from '../ui/Zero/Zero';
import './Cell.css';
import { CellData } from './types';

type CellProps = {
  top: boolean;
  right: boolean;
  bottom: boolean;
  left: boolean;
  handleClick: (id: number) => void;

  cellData: CellData;
};

export function Cell({
  top,
  right,
  bottom,
  left,
  cellData,
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
      onClick={() => handleClick(cellData.id)}
    >
      {cellData.zero && <Zero />} {cellData.cross && <Cross />}
    </div>
  );
}
