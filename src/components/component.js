import { GRID_SIZE, TYPES } from '../constants';
import GameObject from '../utils/game-object';

const colors = ['YELLOW', 'BLUE', 'RED'];
let index = 0;

export default class Component extends GameObject {
  constructor(properties) {
    // properties.width = properties.height = GRID_SIZE / 2;
    properties.radius = GRID_SIZE / 4;
    properties.type = TYPES.COMPONENT;

    properties.name = colors[index++ % colors.length];
    super(properties);
  }
}
