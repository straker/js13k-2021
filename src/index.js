import {
  init,
  initKeys,
  initPointer,
  GameLoop,
  pointerPressed,
  bindKeys,
  emit,
  load,
  imageAssets,
  onPointerDown,
  onPointerUp
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
import { rotate } from './utils';

import componentManager from './managers/component-manager';
import beltManager from './managers/belt-manager';
import minerManager from './managers/miner-manager';
import moverManager from './managers/mover-manager';
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

const managers = {
  BELT: beltManager,
  EXPORT: beltManager,
  IMPORT: beltManager,
  MINER: minerManager,
  MOVER: moverManager
};

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

  selectMenu.init();

  // to help debug problems with belts
  let gameHistory = [];
  let gameTimer = 0;
  let replay = false;
  const sprites = [];

  let counter = 0;
  let pointerStart;
  const loop = GameLoop({
    blur: true,
    update(dt) {
      gameTimer += dt;
      emit('update');
      grid.update();

      cursor.update();
      selectMenu.update();

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
      } else if (cursor.y < GAME_HEIGHT - GRID_SIZE * 3) {
        // try to place items in a straight line from where the
        // user started dragging
        const { row: startRow, col: startCol } = pointerStart ?? {};
        const { name, row, col, rotation, dir, width, height } = cursor;

        if (pointerPressed('left')) {
          const diffRow = row - startRow;
          const diffCol = col - startCol;
          const absDiffRow = Math.abs(diffRow);
          const absDiffCol = Math.abs(diffCol);

          let endRow;
          let endCol;

          // moving up/down
          if (absDiffRow > absDiffCol) {
            // once set don't change pointer direction
            pointerStart.dir =
              pointerStart.dir ?? (diffRow < 0 ? DIRS.UP : DIRS.DOWN);
            endRow = row;
            endCol = startCol;
          }
          // moving left/right
          else if (absDiffCol > absDiffRow) {
            pointerStart.dir =
              pointerStart.dir ?? (diffCol < 0 ? DIRS.LEFT : DIRS.RIGHT);
            endRow = startRow;
            endCol = col;
          }

          function callback(cursorRow, cursorCol) {
            const cursorPos = {
              dir,
              rotation,
              row: cursorRow,
              col: cursorCol,
              width,
              height
            };
            const items = grid.getAll(cursorPos);
            const manager = managers[name];

            if (manager?.canPlace(cursorPos, items)) {
              gameHistory.push({
                time: gameTimer,
                type: TYPES[name],
                row: cursorRow,
                col: cursorCol,
                rotation
              });

              grid.add(manager.add(cursorPos));
            }
          }

          if (pointerStart.dir?.row) {
            for (
              let r = startRow;
              pointerStart.dir.row < 0 ? r >= endRow : r <= endRow;
              r += pointerStart.dir.row
            ) {
              callback(r, startCol);
            }
          } else if (pointerStart.dir?.col) {
            for (
              let c = startCol;
              pointerStart.dir.col < 0 ? c >= endCol : c <= endCol;
              c += pointerStart.dir.col
            ) {
              callback(startRow, c);
            }
          } else {
            callback(startRow, startCol);
          }
        }
        // check valid cursor placement
        else {
          const items = grid.getAll(cursor);
          const manager = managers[name];
          if (manager?.canPlace(cursor, items)) {
            cursor.valid = true;
          } else {
            cursor.valid = false;
          }
        }
      }
    },
    render() {
      context.drawImage(imageAssets.tilemap, 0, 0, GAME_WIDTH, GAME_HEIGHT);
      grid.render();
      componentManager.render();
      sprites.forEach(sprite => sprite.render());
      cursor.render();

      selectMenu.render();
    }
  });
  loop.start();

  bindKeys(
    'r',
    () => {
      cursor.rotation = rotate(cursor, 90);
    },
    { preventDefault: false }
  );

  onPointerDown(() => {
    pointerStart = {
      row: cursor.row,
      col: cursor.col
    };
  });

  onPointerUp(() => {
    pointerStart = null;
  });

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
