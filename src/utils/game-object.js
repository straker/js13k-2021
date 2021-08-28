import { GameObject as GameObj } from 'kontra';
import { GRID_SIZE } from '../constants';

export class GameObject extends GameObj.class {
  constructor(properties) {
    if (!properties.anchor) {
      properties.anchor = { x: 0.5, y: 0.5 };
    }
    properties.x = properties.col * GRID_SIZE + properties.width / 2;
    properties.y = properties.row * GRID_SIZE + properties.height / 2;
    super(properties);
  }
}
