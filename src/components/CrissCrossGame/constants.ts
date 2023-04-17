import { WinCombination } from './types';

export const WIN_COMBINATIONS: WinCombination[] = [
  [0, 1, 2],
  [3, 4, 5],
  [6, 7, 8],
  [0, 3, 6],
  [1, 4, 7],
  [2, 5, 8],
  [0, 4, 8],
  [2, 4, 6],
];

export const INITIAL_CELLS = Array.from(Array(9).keys()).map((n) => ({
  id: n,
  zero: false,
  cross: false,
}));
