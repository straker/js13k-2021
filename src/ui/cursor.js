import { GRID_SIZE, TYPES, DIRS } from '../constants';
import GameObject from '../utils/game-object';
import { getPointer, imageAssets } from '../libs/kontra';
import grid, { toGrid } from '../utils/grid';
import { rotate } from '../utils';
import tileatlas from '../assets/tileatlas.json';

let cursor;
let gameRect;
let menuY;

// don't show game cursor on the selection menu
game.addEventListener('mousemove', showHideCursor);

function showHideCursor(evt) {
  // cache bounding rect
  if (!menuY) {
    gameRect = game.getBoundingClientRect();
    menuY = gameRect.y + gameRect.height - GRID_SIZE * 3;
  }
  const atlas = tileatlas[cursor.name];

  if (!atlas || evt.clientY > menuY) {
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

    if (!atlas) return;

    this.scaleSize = atlas.width;
    this.width = atlas.width * GRID_SIZE;
    this.height = atlas.height * GRID_SIZE;
  }

  hide() {
    game.style.cursor = 'default';
    this.hidden = true;
  }

  show() {
    if (this.y < menuY - gameRect.y) {
      game.style.cursor = 'none';
      cursor.hidden = false;
    }
  }

  update() {
    const atlas = tileatlas[this.name] ?? { width: 1, height: 1 };
    const pointer = getPointer();

    this.x = (toGrid(pointer.x) + (1 - 0.5 * atlas.width)) * GRID_SIZE;
    this.y = (toGrid(pointer.y) + (1 - 0.5 * atlas.width)) * GRID_SIZE;
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

  draw() {
    const { context, scaleSize, name } = this;
    const atlas = tileatlas.CURSOR;

    if (!name || this.hidden) return;

    context.save();
    context.globalAlpha = 0.6;
    super.draw();
    context.restore();

    context.scale(scaleSize, scaleSize);
    context.drawImage(
      imageAssets.tilesheet,
      atlas.col * GRID_SIZE,
      atlas.row * GRID_SIZE,
      GRID_SIZE,
      GRID_SIZE,
      0,
      0,
      GRID_SIZE,
      GRID_SIZE
    );
  }
}

cursor = new Cursor();
export default cursor;
