export const GRID_SIZE = 32;
export const GAME_WIDTH = GRID_SIZE * 32;
export const GAME_HEIGHT = GRID_SIZE * 18;
export const TYPES = {
  BELT: 0,
  COMPONENT: 1
};
// dir values by name, degree, and radian
const RIGHT = { row: 0, col: 1 };
const DOWN = { row: 1, col: 0 };
const LEFT = { row: 0, col: -1 };
const UP = { row: -1, col: 0 };
export const DIRS = {
  RIGHT,
  0: RIGHT,
  DOWN,
  [Math.PI / 2]: DOWN,
  90: DOWN,
  LEFT,
  [Math.PI]: LEFT,
  180: LEFT,
  UP,
  [Math.PI * 1.5]: UP,
  270: UP
};
export const BELT = {
  SPEED: [0.75]
};
