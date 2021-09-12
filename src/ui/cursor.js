import { GRID_SIZE, TYPES, DIRS, COLORS } from '../constants';
import GameObject from '../utils/game-object';
import { getPointer, imageAssets } from '../libs/kontra';
import grid, { toGrid } from '../utils/grid';
import { rotate } from '../utils';
import tileatlas from '../assets/tileatlas.json';

let cursor;
let gameRect;
let menuY;
let displayY;

// don't show game cursor on the selection menu
game.addEventListener('mousemove', showHideCursor);

function showHideCursor(evt) {
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
}

class Cursor extends GameObject {
  constructor() {
    super({
      context: game.getContext('2d')
    });

    this.state = 'building';
    this.dir = DIRS.RIGHT;
  }

  setImage(name) {
    const atlas = tileatlas[name];
    this.name = name;

    if (name) {
      this.state = 'building';
    } else {
      this.state = 'cursor';
    }

    this.rotation = 0;
    this.width = (atlas?.width ?? 1) * GRID_SIZE;
    this.height = (atlas?.height ?? 1) * GRID_SIZE;
  }

  hide() {
    game.style.cursor = 'default';
    this.hidden = true;
  }

  show() {
    if (this.y < menuY - gameRect?.y) {
      cursor.hidden = false;

      const atlas = tileatlas[this.name];
      if (atlas) {
        game.style.cursor = 'none';
      } else {
        game.style.cursor = 'default';
      }
    }
  }

  update() {
    const atlas = tileatlas[this.name] ?? { width: 1, height: 1 };
    const pointer = getPointer();

    this.x = (toGrid(pointer.x) + (1 - 0.5 * atlas.width)) * GRID_SIZE;
    this.y = (toGrid(pointer.y) + (1 - 0.5 * atlas.height)) * GRID_SIZE;
    this.row = toGrid(this.y);
    this.col = toGrid(this.x);

    if (!this.name || this.hidden) return;

    // show import / export belt when appropriate
    const item = grid.get(this)[0];
    if (['BELT', 'EXPORT', 'IMPORT'].includes(this.name)) {
      if (!item) {
        this.name = 'BELT';
      } else if (item.type === TYPES.WALL) {
        if (item.dir === this.dir) {
          this.name = 'EXPORT';
        } else if (item.dir === DIRS[rotate(this, 180)]) {
          this.name = 'IMPORT';
        } else {
          this.name = 'BELT';
        }
      }
    }
  }

  drawOutline({ row = this.row, col = this.col, width, height }) {
    const { context, row: thisRow, col: thisCol } = this;
    const atlas = tileatlas.CURSOR;
    for (let i = 0; i < 4; i++) {
      const sx =
        i % 2 === 1 ? (atlas.col + 1) * GRID_SIZE - 4 : atlas.col * GRID_SIZE;
      const sy =
        i >= 2 ? (atlas.row + 1) * GRID_SIZE - 4 : atlas.row * GRID_SIZE;
      const x = i % 2 === 1 ? width - 4 : 0;
      const y = i >= 2 ? height - 4 : 0;

      context.drawImage(
        imageAssets.tilesheet,
        sx,
        sy,
        4,
        4,
        (col - thisCol) * GRID_SIZE + x,
        (row - thisRow) * GRID_SIZE + y,
        4,
        4
      );
    }
  }

  draw() {
    const items = grid.getAll(this);

    if (this.hidden) return;

    if (this.name) {
      const { context, width, height } = this;

      context.save();
      context.globalAlpha = 0.6;
      super.draw();

      if (!this.valid) {
        context.fillStyle = COLORS.RED;
        context.fillRect(0, 0, width, height);
      }
      context.restore();

      this.drawOutline({ width, height });
    } else if (items.length) {
      const item = items.find(item => item.type && item.type !== TYPES.WALL);

      if (item?.menuType) {
        let { row, col, width, height } = item;

        // item position is from the bottom-right corner
        if (height > GRID_SIZE) {
          row--;
        }
        if (width > GRID_SIZE) {
          col--;
        }

        this.drawOutline({ row, col, width, height });
      }
    }
  }
}

cursor = new Cursor();
export default cursor;
