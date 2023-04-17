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
  let currentCrossCombinations = currentCells.reduce(
    (checkedCells: number[], currentCell) => {
      if (currentCell.cross && !currentCell.zero) {
        checkedCells.push(currentCell.id);
      }
      return checkedCells;
    },
    []
  );

  let currentZeroCombinations = currentCells.reduce(
    (checkedCells: number[], currentCell) => {
      if (!currentCell.cross && currentCell.zero) {
        checkedCells.push(currentCell.id);
      }
      return checkedCells;
    },
    []
  );

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

export function findOptimalIndex(
  currentCells: { id: number; zero: boolean; cross: boolean }[],
  winCombinations: [number, number, number][],
  //rival: { sign: 'X' | 'O' | 'NONE'; type: 'HUMAN' | 'ROBOT' | 'NONE' }
  rival: Player
): number {
  const rivalCells = currentCells
    .filter((cell) => {
      if (rival.sign === 'X') {
        return cell.cross;
      }
      if (rival.sign === 'O') {
        return cell.zero;
      }
    })
    .map((cell) => cell.id);

  const selectedCells = currentCells.reduce((selected: number[], current) => {
    if (current.cross || current.zero) {
      selected.push(current.id);
    }
    return selected;
  }, []);

  // find FIRST combination, that allow rival to make win turn
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

  if (dangerousCombination) {
    console.log('rivalCells', rivalCells);
    console.log('selectedCells', selectedCells);
    console.log('dangerousCombination ', dangerousCombination); // 0 4 8
    // don't let rival to complete combination
    const idToChoose = dangerousCombination.find(
      (cell) => selectedCells.indexOf(cell) === -1
    );
    //idToChoose = 0..8
    console.log('idToChoose', idToChoose);
    if (idToChoose !== undefined) {
      console.log('idToChoose ', idToChoose);
      return idToChoose;
    } else {
      throw new Error('Wrong robot algorithm');
    }
  } else {
    // ELSE => just return random free id
    let randomCellId = getRandomNumber(0, 8);
    //find unchecked cell
    while (selectedCells.indexOf(randomCellId) > -1) {
      randomCellId = getRandomNumber(0, 8);
    }
    return randomCellId;
  }
}
