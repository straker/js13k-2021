import { GRID_SIZE, TYPES, DIRS, BELT } from '../constants';
import { GameObject } from '../utils/game-object';
import grid from '../utils/grid';

export const beltSegments = [];

export default class Belt extends GameObject {
  constructor(properties) {
    properties.width = properties.height = GRID_SIZE;
    super(properties);

    this.type = TYPES.BELT;
    this.dir = DIRS[this.rotation];
    this.speed = BELT.SPEED[0]; // dx/y of the belt and items
    this.lastFedDir = null; // direction of last item fed into the belt

    // add belt to a segment if one exists, otherwise create one
    if (properties.noSegment) return;

    // get neighboring belts
    const { row, col, dir } = this;
    const nextBelt = grid.getByType(
      {
        row: row + dir.row,
        col: col + dir.col
      },
      TYPES.BELT
    )[0];
    const prevBelt = grid.getByType(
      {
        row: row - dir.row,
        col: col - dir.col
      },
      TYPES.BELT
    )[0];
    const sideBelt1 = grid.getByType(
      {
        row: row + dir.col,
        col: col + dir.row
      },
      TYPES.BELT
    )[0];
    const sideBelt2 = grid.getByType(
      {
        row: row - dir.col,
        col: col - dir.row
      },
      TYPES.BELT
    )[0];

    const prevSameDir = prevBelt?.dir === this.dir;
    const nextSameDir = nextBelt?.dir === this.dir;

    // create doubly linked list
    if (nextBelt) {
      this.nextBelt = nextBelt;

      if (nextSameDir) {
        nextBelt.prevBelt = this;
      }
    }
    if (prevSameDir) {
      this.prevBelt = prevBelt;
      prevBelt.nextBelt = this;
    }
    if (
      sideBelt1 &&
      sideBelt1.row + sideBelt1.dir.row === row &&
      sideBelt1.col + sideBelt1.dir.col === col
    ) {
      sideBelt1.nextBelt = this;
    }
    if (
      sideBelt2 &&
      sideBelt2.row + sideBelt2.dir.row === row &&
      sideBelt2.col + sideBelt2.dir.col === col
    ) {
      sideBelt2.nextBelt = this;
    }

    // create segments
    if (!prevBelt && !nextBelt) {
      this.segment = { start: this, end: this };
      beltSegments.push(this.segment);
    } else {
      // join segments if going the same direction
      if (prevSameDir) {
        this.segment = prevBelt.segment;
        prevBelt.segment.end = this;
      }

      // merge segments if going the same direction
      if (nextSameDir) {
        if (this.segment) {
          const segment = nextBelt.segment;
          nextBelt.segment = this.segment;
          this.segment.end = segment.end;
          beltSegments.splice(beltSegments.indexOf(segment), 1);
        } else {
          this.segment = nextBelt.segment;
          nextBelt.segment.start = this;
        }
      }

      // belts not going the same direction start a new segment
      if (!prevSameDir && !nextSameDir) {
        this.segment = { start: this, end: this };
        beltSegments.push(this.segment);
      }
    }
  }

  draw() {
    const { context, width, height } = this;

    // debug purposes
    if (this.segment?.start === this) {
      context.fillStyle = 'rgba(255, 0, 0, 0.5';
      context.fillRect(0, 0, this.width, this.height);
    } else if (this.segment?.end === this) {
      context.fillStyle = 'rgba(0, 0, 255, 0.5';
      context.fillRect(0, 0, this.width, this.height);
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
}
