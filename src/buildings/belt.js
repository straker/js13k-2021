import { degToRad } from 'kontra';
import { GRID_SIZE, TYPES } from '../constants';
import { GameObject } from '../utils/game-object';
import grid from '../utils/grid';

export default class Belt extends GameObject {
  constructor(properties) {
    properties.width = properties.height = GRID_SIZE;
    super(properties);

    // this.rotation === belt direction
    this.type = TYPES.BELT;
    this.speed = 0.75; // dx/y of the belt and items
  }

  draw() {
    const { context, width, height } = this;

    // debug purposes
    if (grid.get(this.x, this.y).find(obj => obj.type === TYPES.COMPONENT)) {
      context.fillStyle = 'yellow';
      context.fillRect(0, 0, width, height);
    }

    context.strokeStyle = '#000';
    context.lineWidth = 2;
    context.strokeRect(0, 0, width, 1);
    context.strokeRect(0, height - 2, width, 1);
    context.beginPath();
    context.moveTo(width / 3, height / 2);
    context.lineTo((width * 2) / 3, height / 2);
    context.lineTo(width / 2, height / 3);
    context.moveTo(width / 2, (height * 2) / 3);
    context.lineTo((width * 2) / 3, height / 2);
    context.stroke();
  }

  getVelocity() {
    return {
      dir: this.rotation === 0 || this.rotation === degToRad(180) ? 'dx' : 'dy',
      speed:
        this.rotation === 0 || this.rotation === degToRad(90)
          ? this.speed
          : -this.speed
    };
  }
}
