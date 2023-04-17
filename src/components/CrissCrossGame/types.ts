export enum ESign {
  X = 'X',
  O = 'O',
  NONE = 'NONE',
}

export enum EPlayerType {
  HUMAN,
  ROBOT,
  NONE,
}

export type Player = {
  sign: ESign;
  type: EPlayerType;
};

export type Winner = {
  win: Exclude<ESign, ESign.NONE>;
  combination: [number, number, number];
} | null;

export enum EMode {
  PLAY_WITH_HUMAN,
  PLAY_WITH_ROBOT,
  NONE,
}

export interface AppProps {}

export interface AppState {
  mode: EMode;
  playerOne: Player;
  playerTwo: Player;
  nextTurn: ESign;
  gameOver: boolean;
  winner: Winner;
  currentCells: { id: number; zero: boolean; cross: boolean }[];
  winCombinations: [number, number, number][];
  helpTurn: boolean;
}
