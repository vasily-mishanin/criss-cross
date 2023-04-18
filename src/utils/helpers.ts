import { ESign, Player } from '../components/CrissCrossGame/types';

export function getRandomNumber(from: number, to: number) {
  let number = from + Math.floor(Math.random() * (to + 1));
  return number;
}

export function getWinner(
  currentCells: { id: number; zero: boolean; cross: boolean }[],
  winCombinations: [number, number, number][]
): {
  win: Exclude<ESign, ESign.NONE>;
  combination: [number, number, number];
} | null {
  let currentCrossCombinations = findCrossCheckedCells(currentCells);

  let currentZeroCombinations = findZeroCheckedCells(currentCells);

  let crossWinComb = winCombinations.find((combination) =>
    combination.every((id) => currentCrossCombinations.indexOf(id) > -1)
  );

  let zeroWinComb = winCombinations.find((combination) =>
    combination.every((id) => currentZeroCombinations.indexOf(id) > -1)
  );

  if (crossWinComb && !zeroWinComb) {
    return { win: ESign.X, combination: crossWinComb };
  }

  if (!crossWinComb && zeroWinComb) {
    return { win: ESign.O, combination: zeroWinComb };
  }

  return null;
}

function findCrossCheckedCells(
  cells: { id: number; zero: boolean; cross: boolean }[]
) {
  return cells.reduce((checkedCells: number[], currentCell) => {
    if (currentCell.cross && !currentCell.zero) {
      checkedCells.push(currentCell.id);
    }
    return checkedCells;
  }, []);
}

function findZeroCheckedCells(
  cells: { id: number; zero: boolean; cross: boolean }[]
) {
  return cells.reduce((checkedCells: number[], currentCell) => {
    if (!currentCell.cross && currentCell.zero) {
      checkedCells.push(currentCell.id);
    }
    return checkedCells;
  }, []);
}

export function findOptimalIndex(
  currentCells: { id: number; zero: boolean; cross: boolean }[],
  winCombinations: [number, number, number][],
  rival: Player
): number {
  const rivalCells = getRivalCells(currentCells, rival);

  const selectedCells = getSelectedCells(currentCells);

  // find FIRST combination, that allow rival to make win turn
  const dangerousCombination = getDangerousCombination(
    winCombinations,
    rivalCells,
    selectedCells
  );

  if (dangerousCombination) {
    // don't let rival to complete combination
    const idToChoose = dangerousCombination.find(
      (cell) => selectedCells.indexOf(cell) === -1
    );
    //idToChoose = 0..8
    if (idToChoose) {
      return idToChoose;
    } else {
      throw new Error('Wrong robot algorithm');
    }
  } else {
    // ELSE => just return random free Cell id
    let randomCellId = getRandomNumber(0, 8);
    //find unchecked cell

    const freeCell = currentCells.find(
      (cell) => selectedCells.indexOf(cell.id) === -1
    );
    randomCellId = freeCell ? freeCell.id : randomCellId;
    return randomCellId;
  }
}

function getRivalCells(
  cells: { id: number; zero: boolean; cross: boolean }[],
  rival: Player
) {
  return cells
    .filter((cell) => {
      if (rival.sign === 'X') {
        return cell.cross;
      }
      if (rival.sign === 'O') {
        return cell.zero;
      }
    })
    .map((cell) => cell.id);
}

function getSelectedCells(
  cells: { id: number; zero: boolean; cross: boolean }[]
) {
  return cells.reduce((selected: number[], current) => {
    if (current.cross || current.zero) {
      selected.push(current.id);
    }
    return selected;
  }, []);
}

function getDangerousCombination(
  winCombinations: [number, number, number][],
  rivalCells: number[],
  selectedCells: number[]
) {
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
    if (
      count === 2 &&
      combination.some((id) => selectedCells.indexOf(id) === -1)
    ) {
      return combination;
    }
  });

  return dangerousCombination;
}
