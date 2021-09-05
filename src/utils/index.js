import { DIRS } from '../constants';

export function getSign(number) {
  return number < 0 ? -1 : number > 0 ? 1 : 0;
}

export function getDx(dir, speed) {
  return dir === DIRS.RIGHT ? speed : dir === DIRS.LEFT ? -speed : 0;
}

export function getDy(dir, speed) {
  return dir === DIRS.DOWN ? speed : dir === DIRS.UP ? -speed : 0;
}

// current time (t) to move from point b to point c in a certain
// duration (d)
export function easeLinear(t, b, c, d) {
  return (c * t) / d + b;
}