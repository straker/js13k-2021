import {
  onPointerDown,
  onPointerUp,
  bindKeys,
  pointerPressed
} from '../libs/kontra';
import cursor from '../ui/cursor';
import grid from '../utils/grid';
import { rotate } from '../utils';
import { GAME_HEIGHT, GRID_SIZE, DIRS } from '../constants';

import beltManager from './belt-manager';
import minerManager from './miner-manager';
import moverManager from './mover-manager';

const managers = {
  BELT: beltManager,
  EXPORT: beltManager,
  IMPORT: beltManager,
  MINER: minerManager,
  MOVER: moverManager
};
let pointerStart;

const cursorManager = {
  init() {
    onPointerDown(() => {
      pointerStart = {
        row: cursor.row,
        col: cursor.col
      };
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
    if (cursor.y < GAME_HEIGHT - GRID_SIZE * 3) {
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
    cursor.render();
  }
};
export default cursorManager;
