export function getRandomNumber(from: number, to: number) {
  let number = from + Math.floor(Math.random() * (to + 1));
  return number;
}
