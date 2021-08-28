import { GRID_SIZE, TYPES } from '../constants';
import grid from '../utils/grid';
import { GameObject } from '../utils/game-object';

export default class Component extends GameObject {
  constructor(properties) {
    properties.width = properties.height = GRID_SIZE;
    super(properties);

    this.type = TYPES.COMPONENT;
  }

  update() {
    this.dx = this.dy = 0;

    const { x, y } = this;
    const belt = grid.get(x, y).find(obj => obj.type === TYPES.BELT);

    if (belt) {
      const { dir, speed } = belt.getVelocity();

      // ensure component moves towards center of belt before changing directions
      if (
        dir === 'dy' &&
        ((this.prevDx < 0 && this.x % GRID_SIZE > GRID_SIZE / 2) ||
          (this.prevDx > 0 && this.x % GRID_SIZE < GRID_SIZE / 2))
      ) {
        this.dx = this.prevDx;
      } else if (
        dir === 'dx' &&
        ((this.prevDy < 0 && this.y % GRID_SIZE > GRID_SIZE / 2) ||
          (this.prevDy > 0 && this.y % GRID_SIZE < GRID_SIZE / 2))
      ) {
        this.dy = this.prevDy;
      } else {
        this[dir] = speed;

        // center the component on the belt
        if (dir === 'dy') {
          this.x = this.col * GRID_SIZE + GRID_SIZE * 0.5;
        } else if (dir === 'dx') {
          this.y = this.row * GRID_SIZE + GRID_SIZE * 0.5;
        }

        this.prevDx = this.dx;
        this.prevDy = this.dy;
      }
    }

    this.advance();
  }

  draw() {
    const { context, width, height } = this;
    context.fillStyle = 'red';
    context.beginPath();
    context.arc(width / 2, height / 2, GRID_SIZE / 4, 0, 2 * Math.PI);
    context.fill();
  }
}
