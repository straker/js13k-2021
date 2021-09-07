import {
  init,
  initKeys,
  initPointer,
  GameLoop,
  bindKeys,
  emit,
  load,
  imageAssets
} from './libs/kontra';
import {
  GAME_WIDTH,
  GAME_HEIGHT,
  GRID_SIZE,
  TYPES,
  DIRS,
  TICK_DURATION
} from './constants';
import grid, { toGrid } from './utils/grid';

import componentManager from './managers/component-manager';
import beltManager from './managers/belt-manager';
import minerManager from './managers/miner-manager';
import moverManager from './managers/mover-manager';
import cursorManager from './managers/cursor-manager';
import cursor from './ui/cursor';
import { layers } from './assets/tilemap.json';
import selectMenu from './ui/select-menu';

const { canvas, context } = init();

canvas.width = GAME_WIDTH;
canvas.height = GAME_HEIGHT;
const numRows = GAME_HEIGHT / GRID_SIZE;
const numCols = GAME_WIDTH / GRID_SIZE;

initKeys();
const pointer = initPointer();
const wallDirs = {
  33: DIRS.RIGHT,
  42: DIRS.DOWN,
  31: DIRS.LEFT,
  22: DIRS.UP
};

load('tilesheet.webp', 'tilemap.webp').then(() => {
  // fill the grid with walls
  for (let row = 0; row < numRows; row++) {
    for (let col = 0; col < numCols; col++) {
      const tile = layers[0].data[row * numCols + col];
      if (tile && tile !== 11) {
        // 11 = minable floor
        grid.add({
          type: TYPES.WALL,
          row,
          col,
          width: GRID_SIZE,
          height: GRID_SIZE,
          dir: wallDirs[tile],
          render() {},
          update() {}
        });
      }
    }
  }

  // order here is important and determines the order in which
  // these managers run (so a mover will move a component off a
  // belt before it moves along the belt)
  moverManager.init();
  componentManager.init();
  beltManager.init();
  minerManager.init();
  cursorManager.init();

  selectMenu.init();

  // to help debug problems with belts
  let gameHistory = [];
  let gameTimer = 0;
  let replay = false;
  const sprites = [];

  let counter = 0;
  const loop = GameLoop({
    blur: true,
    update(dt) {
      gameTimer += dt;
      emit('update');
      grid.update();

      cursor.update();
      selectMenu.update();
      cursorManager.update();

      // update all game logic every 200 ms (200ms / 1000 ms = 0.2)
      counter += dt;
      if (counter >= TICK_DURATION) {
        counter -= TICK_DURATION;
        emit('preGameTick', TICK_DURATION);
        emit('gameTick', TICK_DURATION);
      }

      if (replay) {
        const item = gameHistory[0];
        if (!item) {
          replay = false;
        } else if (gameTimer >= item.time) {
          gameHistory.shift();
          const { type, row, col, rotation } = item;

          switch (type) {
            case TYPES.BELT:
              beltManager.add({ row, col, rotation });
              break;

            case TYPES.COMPONENT:
              componentManager.add({ row, col });
              break;
          }
        }
      }
    },
    render() {
      context.drawImage(imageAssets.tilemap, 0, 0, GAME_WIDTH, GAME_HEIGHT);
      grid.render();
      componentManager.render();
      sprites.forEach(sprite => sprite.render());
      cursorManager.render();

      selectMenu.render();
    }
  });
  loop.start();

  // key s places a component on a belt
  bindKeys('s', () => {
    if (replay) return;
    const row = toGrid(pointer.y);
    const col = toGrid(pointer.x);
    const belt = grid.getByType({ row, col }, TYPES.BELT)[0];
    if (belt && !belt.component) {
      gameHistory.push({ time: gameTimer, type: TYPES.COMPONENT, row, col });
      componentManager.add({ row, col });
    }
  });

  window.grid = grid;
  window.replayHistory = function (history) {
    replay = true;
    gameHistory = history;
    gameTimer = 0;
  };
  window.gameHistory = gameHistory;
});
