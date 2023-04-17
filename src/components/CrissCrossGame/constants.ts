import { WinCombination } from './types';
import soundCross from '../../assets/sound-cross.m4a';
import soundZero from '../../assets/sound-zero.m4a';
import soundOver from '../../assets/sound-game-over.m4a';

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

export const AUDIO_CROSS = new Audio(soundCross);
export const AUDIO_ZERO = new Audio(soundZero);
export const AUDIO_RESTART = new Audio(soundOver);
