import { Sprite, imageAssets } from '../libs/kontra';
import { GRID_SIZE, DIRS } from '../constants';
import tileatlas from '../assets/tileatlas.json';

export default class GameObject extends Sprite.class {
  constructor(properties = {}) {
    if (!properties.anchor) {
      properties.anchor = { x: 0.5, y: 0.5 };
    }

    const atlas = tileatlas[properties.name];
    if (atlas) {
      properties.width = atlas.width * GRID_SIZE;
      properties.height = atlas.height * GRID_SIZE;

      if (!properties.x) {
        properties.x = (properties.col + (1 - 0.5 * atlas.width)) * GRID_SIZE;
        properties.y = (properties.row + (1 - 0.5 * atlas.height)) * GRID_SIZE;
      }
    }

    properties.dir = DIRS[properties.rotation];

    super(properties);
  }

  get rotation() {
    return this._rot;
  }

  set rotation(value) {
    this._rot = value;
    this.dir = DIRS[value];
    this._pc();
  }

  canTakeComponent() {
    return false;
  }

  draw() {
    const { name, context, width, height } = this;
    const atlas = tileatlas[name];
    if (atlas) {
      context.drawImage(
        imageAssets.tilesheet,
        atlas.col * GRID_SIZE,
        atlas.row * GRID_SIZE,
        width,
        height,
        0,
        0,
        width,
        height
      );
    }
  }
}
