export const GRID_SIZE = 16;
export const NUM_ROWS = 36;
export const NUM_COLS = 64;
export const GAME_WIDTH = GRID_SIZE * NUM_COLS;
export const GAME_HEIGHT = GRID_SIZE * NUM_ROWS;

export const TYPES = {
  WALL: 0,
  BELT: 1,
  COMPONENT: 2,
  MOVER: 3,
  ASSEMBLER: 4
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
export const COLORS = {
  WHITE: '#cfc6b8',
  BLACK: '#333333',
  RED: '#e6482e',
  YELLOW: '#f4b41b',
  GREEN: '#38d973'
};
// 200 ms (200ms / 1000 ms = 0.2)
export const TICK_DURATION = 0.2;
