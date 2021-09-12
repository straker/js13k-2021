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
  MINER: 4,
  ASSEMBLER: 5,
  SHIP: 6,

  FILTER: 10,
  RECIPE: 11
};
export const COMPONENTS = ['COPPER', 'IRON', 'TITANIUM', 'WIRE', 'CIRCUIT'];
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
export const COLORS = {
  WHITE: '#cfc6b8',
  BLACK: '#333333',
  GREY: '#777777',
  RED: '#e6482e',
  YELLOW: '#f4b41b',
  GREEN: '#38d973',
  BLUE: '#3cacd7',
  BROWN: '#bf7958',
  PURPLE: '#472d3c'
};
// 200 ms (200ms / 1000 ms = 0.2)
export const TICK_DURATION = 0.2;
export const TEXT_PROPS = {
  font: `${GRID_SIZE}px Arial`,
  color: COLORS.WHITE,
  anchor: { x: 0, y: 0.5 }
};
export const RECIPES = [
  {
    name: 'NONE',
    inputs: [
      {
        name: 'NONE'
      }
    ],
    outputs: [
      {
        name: 'NONE'
      }
    ]
  },
  {
    name: 'WIRE',
    inputs: [
      {
        name: 'COPPER',
        total: 1,
        has: 0
      }
    ],
    outputs: [
      {
        name: 'WIRE',
        total: 2,
        has: 0
      }
    ],
    duration: 5 // game ticks
  },
  {
    name: 'CIRCUIT',
    inputs: [
      {
        name: 'WIRE',
        total: 2,
        has: 0
      },
      {
        name: 'IRON',
        total: 1,
        has: 0
      }
    ],
    outputs: [
      {
        name: 'CIRCUIT',
        total: 1,
        has: 0
      }
    ],
    duration: 5 // game ticks
  }
];
const beltCost = [
  {
    name: 'IRON',
    total: 1
  }
];
export const COSTS = {
  BELT: beltCost,
  IMPORT: beltCost,
  EXPORT: beltCost,
  MOVER: [
    {
      name: 'COPPER',
      total: 2
    },
    {
      name: 'IRON',
      total: 2
    }
  ],
  'COPPER-MINER': [
    {
      name: 'IRON',
      total: 5
    }
  ],
  'IRON-MINER': [
    {
      name: 'COPPER',
      total: 10
    }
  ],
  'TITANIUM-MINER': [
    {
      name: 'COPPER',
      total: 50
    },
    {
      name: 'IRON',
      total: 25
    },
    {
      name: 'CIRCUIT',
      total: 25
    }
  ],
  ASSEMBLER: [
    {
      name: 'COPPER',
      total: 25
    },
    {
      name: 'IRON',
      total: 25
    }
  ]
};
