import { GRID_SIZE, TYPES, DIRS } from '../constants';
import GameObject from '../utils/game-object';
import { getPointer, imageAssets } from 'kontra';
import grid, { toGrid } from '../utils/grid';
import { rotate } from '../utils';
import tileatlas from '../assets/tileatlas.json';

export default class Cursor extends GameObject {
  constructor() {
    super();

    this.state = 'building';
    this.dir = DIRS.RIGHT;
  }

  setImage(name) {
    const atlas = tileatlas[name];
    this.name = name;
    this.scaleSize = atlas.width;
    this.width = atlas.width * GRID_SIZE;
    this.height = atlas.height * GRID_SIZE;
  }

  update() {
    const atlas = tileatlas[this.name];
    const pointer = getPointer();
    this.x = (toGrid(pointer.x) + (1 - 0.5 * atlas.width)) * GRID_SIZE;
    this.y = (toGrid(pointer.y) + (1 - 0.5 * atlas.width)) * GRID_SIZE;
    this.row = toGrid(this.y);
    this.col = toGrid(this.x);

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
    const { context, scaleSize } = this;
    const atlas = tileatlas.CURSOR;

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
