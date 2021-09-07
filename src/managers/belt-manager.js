import { TYPES, DIRS } from '../constants';
import grid from '../utils/grid';
import { rotate } from '../utils';
import Belt from '../buildings/belt';
import ExportBelt from '../buildings/export-belt';
import ImportBelt from '../buildings/import-belt';

export const beltSegments = [];

const beltManager = {
  init() {},

  add(properties) {
    // auto place import / export belt from a belt
    const item = grid.get(properties)[0];
    let belt;

    if (!item) {
      belt = new Belt(properties);
    }
    // import / export belt
    else {
      // import belt goes same direction as well
      if (properties.dir === item.dir) {
        belt = new ExportBelt(properties);
      } else {
        belt = new ImportBelt(properties);
      }
    }

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
  },

  canPlace(cursor, items) {
    // belts can only be placed on empty spots but import / export
    // belts can be placed on walls that match their dir
    return (
      !items.length ||
      (items.length &&
        items.every(
          item =>
            item.type === TYPES.WALL &&
            item.dir &&
            cursor.dir &&
            (item.dir === cursor.dir || item.dir === DIRS[rotate(cursor, 180)])
        ))
    );
  }
};

export default beltManager;
