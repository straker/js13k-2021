import { TYPES } from '../constants';
import grid from '../utils/grid';
import Belt from '../buildings/belt';

export const beltSegments = [];

const beltManager = {
  init() {},

  add(properties) {
    const belt = new Belt(properties);

    // get neighboring belts
    const { row, col, dir } = belt;
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

    const prevSameDir = prevBelt?.dir === dir;
    const nextSameDir = nextBelt?.dir === dir;

    // create doubly linked list
    if (nextBelt) {
      belt.nextBelt = nextBelt;

      if (nextSameDir) {
        nextBelt.prevBelt = belt;
      }
    }
    if (prevSameDir) {
      belt.prevBelt = prevBelt;
      prevBelt.nextBelt = belt;
    }
    if (
      sideBelt1 &&
      sideBelt1.row + sideBelt1.dir.row === row &&
      sideBelt1.col + sideBelt1.dir.col === col
    ) {
      sideBelt1.nextBelt = belt;
    }
    if (
      sideBelt2 &&
      sideBelt2.row + sideBelt2.dir.row === row &&
      sideBelt2.col + sideBelt2.dir.col === col
    ) {
      sideBelt2.nextBelt = belt;
    }

    // create segments
    if (!prevBelt && !nextBelt) {
      belt.segment = { start: belt, end: belt };
      beltSegments.push(belt.segment);

      // should not get here
      if (!beltSegments.includes(belt.segment)) debugger;
    } else {
      // join segments if going the same direction
      if (prevSameDir) {
        belt.segment = prevBelt.segment;
        prevBelt.segment.end = belt;

        // should not get here
        if (!beltSegments.includes(belt.segment)) debugger;
      }

      // merge segments if going the same direction
      if (nextSameDir) {
        // should not get here
        if (belt.segment && !beltSegments.includes(belt.segment)) debugger;

        if (belt.segment) {
          const segment = nextBelt.segment;
          nextBelt.segment = belt.segment;
          belt.segment.end = segment.end;
          beltSegments.splice(beltSegments.indexOf(segment), 1);
        } else {
          belt.segment = nextBelt.segment;
          nextBelt.segment.start = belt;
        }

        // should not get here
        if (!beltSegments.includes(belt.segment)) debugger;
      }

      // belts not going the same direction start a new segment
      if (!prevSameDir && !nextSameDir) {
        belt.segment = { start: belt, end: belt };
        beltSegments.push(belt.segment);

        // should not get here
        if (!beltSegments.includes(belt.segment)) debugger;
      }
    }

    return belt;
  }
};

export default beltManager;
