import { Sprite, imageAssets } from 'kontra';
import { GRID_SIZE } from '../constants';
import tileatlas from '../assets/tileatlas.json';

export default class GameObject extends Sprite.class {
  constructor(properties = {}) {
    if (!properties.anchor) {
      properties.anchor = { x: 0.5, y: 0.5 };
    }

    if (!properties.x) {
      properties.x =
        properties.col * GRID_SIZE + GRID_SIZE * properties.anchor.x;
      properties.y =
        properties.row * GRID_SIZE + GRID_SIZE * properties.anchor.y;
    }

    const atlas = tileatlas[properties.name];
    if (atlas) {
      properties.width = atlas.width * GRID_SIZE;
      properties.height = atlas.height * GRID_SIZE;
    }

    super(properties);
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
