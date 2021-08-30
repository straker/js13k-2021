import { GRID_SIZE, TYPES } from '../constants';
import { GameObject } from '../utils/game-object';

const colors = ['red', 'orange', 'yellow', 'green', 'blue', 'indigo', 'violet'];
let index = 0;

export default class Component extends GameObject {
  constructor(properties) {
    properties.width = properties.height = GRID_SIZE / 2;
    super(properties);

    this.radius = GRID_SIZE / 4;
    this.type = TYPES.COMPONENT;
    this.prevDx = this.prevDy = 0;

    // debug purposes
    this.color = colors[index++ % colors.length];
  }

  update() {
    this.advance();
  }

  draw() {
    const { context, width, height } = this;
    context.fillStyle = this.color;
    context.beginPath();
    context.arc(width / 2, height / 2, GRID_SIZE / 4, 0, 2 * Math.PI);
    context.fill();
  }
}
