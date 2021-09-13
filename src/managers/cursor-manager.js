import {
  onPointerDown,
  onPointerUp,
  bindKeys,
  pointerPressed,
  collides
} from '../libs/kontra';
import cursor from '../ui/cursor';
import grid from '../utils/grid';
import { rotate } from '../utils';
import { GAME_HEIGHT, GRID_SIZE, DIRS, TYPES } from '../constants';
import storage from '../components/storage';

import beltManager from './belt-manager';
import minerManager from './miner-manager';
import moverManager from './mover-manager';
import assemblerManager from './assembler-manager';
import repairerManager from './repairer-manager';

import buildingPopup from '../ui/building-popup';

const managers = {
  BELT: beltManager,
  EXPORT: beltManager,
  IMPORT: beltManager,
  'COPPER-MINER': minerManager,
  'IRON-MINER': minerManager,
  'TITANIUM-MINER': minerManager,
  MOVER: moverManager,
  ASSEMBLER: assemblerManager,
  REPAIRER: repairerManager
};
let pointerStart;
let menuY;
let gameRect;
let displayY;

const cursorManager = {
  init() {
    // don't show game cursor on the selection menu
    game.addEventListener('mousemove', evt => {
      // cache bounding rect
      if (!menuY) {
        gameRect = game.getBoundingClientRect();
        menuY = gameRect.y + gameRect.height - GRID_SIZE * 3.1;
        displayY = gameRect.y + GRID_SIZE * 2.1;
      }

      if (evt.clientY < displayY || evt.clientY > menuY) {
        cursor.hide();
      } else {
        cursor.show();
      }
    });

    onPointerDown(() => {
      pointerStart = {
        row: cursor.row,
        col: cursor.col
      };

      // don't open the building menu if the user clicked on it
      // but there was a building behind it
      if (
        (cursor.state !== 'building') &
        (buildingPopup.hidden || !collides(cursor, buildingPopup))
      ) {
        const item = grid
          .get(cursor)
          .filter(item => item.type && item.type !== TYPES.WALL)[0];
        if (item?.menuType) {
          buildingPopup.show(item);
        }
      }
    });

    onPointerUp(() => {
      pointerStart = null;
    });

    bindKeys(
      'r',
      () => {
        cursor.rotation = rotate(cursor, 90);
      },
      { preventDefault: false }
    );
  },

  update() {
    if (cursor.y >= GAME_HEIGHT - GRID_SIZE * 3) return;

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
          name,
          dir,
          rotation,
          row: cursorRow,
          col: cursorCol,
          width,
          height
        };
        const items = grid.getAll(cursorPos);
        const manager = managers[name];

        if (
          manager?.canPlace(cursorPos, items) &&
          storage.canBuy(cursor.name)
        ) {
          grid.add(manager.add(cursorPos));
          storage.buy(cursor.name);
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
      if (manager?.canPlace(cursor, items) && storage.canBuy(cursor.name)) {
        cursor.valid = true;
      } else {
        cursor.valid = false;
      }
    }
  },

  render() {
    cursor.render();
    buildingPopup.render();
  }
};
export default cursorManager;
