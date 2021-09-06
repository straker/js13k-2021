import { GRID_SIZE, GAME_WIDTH, GAME_HEIGHT } from '../constants';
import { getWorldRect } from '../libs/kontra';

const objects = [];
const tiles = [];
const rows = GAME_HEIGHT / GRID_SIZE;
const cols = GAME_WIDTH / GRID_SIZE;

for (let row = 0; row < rows; row++) {
  tiles[row] = [];
  for (let col = 0; col < cols; col++) {
    tiles[row][col] = [];
  }
}

// turn an x/y value into a grid row/col value
export function toGrid(value) {
  return (value / GRID_SIZE) | 0;
}

// return start and end row/col
function getBoundingBox(obj) {
  const { x, y, width, height } = getWorldRect(obj);
  return {
    startRow: toGrid(y),
    startCol: toGrid(x),
    // subtract 1 since a 32x32 obj should occupy one tile
    // now two (32 / 32 = 1)
    endRow: toGrid(y + height - 1),
    endCol: toGrid(x + width - 1)
  };
}

// loop over each tile an object occupies
function forEachTile([startRow, startCol, endRow, endCol], cb) {
  for (let row = startRow; row <= endRow; row++) {
    for (let col = startCol; col <= endCol; col++) {
      cb(tiles[row][col]);
    }
  }
}

const grid = {
  objects,

  add(obj, toObjects = true) {
    const { startRow, startCol, endRow, endCol } = getBoundingBox(obj);

    if (!obj.row) {
      obj.row = toGrid(obj.y);
      obj.col = toGrid(obj.x);
    }

    forEachTile([startRow, startCol, endRow, endCol], tile => tile.push(obj));

    if (toObjects) {
      objects.push(obj);
    }
  },

  // remove(obj, fromObjects = true) {
  //   const { startRow, startCol, endRow, endCol } = getBoundingBox(obj);

  //   obj.row = obj.col = null;

  //   // remove object to all spaces it occupies
  //   forEachTile([startRow, startCol, endRow, endCol], (tile) => tile.splice(tile.indexOf(obj), 1));

  //   if (fromObjects) {
  //     objects.splice(objets.indexOf(obj), 1);
  //   }
  // },

  get(pos) {
    const row = pos.row ?? (pos.y / GRID_SIZE) | 0;
    const col = pos.col ?? (pos.x / GRID_SIZE) | 0;
    return tiles[row] && tiles[row][col] ? tiles[row][col] : [];
  },

  getByType(pos, type) {
    return this.get(pos).filter(obj => obj.type === type);
  },

  getAll(obj) {
    const objs = [];
    const { startRow, startCol, endRow, endCol } = getBoundingBox(obj);

    forEachTile([startRow, startCol, endRow, endCol], tile =>
      objs.push(...tile)
    );

    return objs;
  },

  update() {
    objects.forEach(obj => {
      // const {
      //   startRow: prevStartRow,
      //   startCol: prevStartCol,
      //   endRow: prevEndRow,
      //   endCol: prevEndCol
      // } = getBoundingBox(obj);

      obj.update();

      // const { startRow, startCol, endRow, endCol } = getBoundingBox(obj);

      // // update object grid position
      // if (
      //   prevStartRow !== startRow ||
      //   prevStartCol !== startCol ||
      //   prevEndRow !== endRow ||
      //   prevEndCol !== endCol
      // ) {
      //   forEachTile([prevStartRow, prevStartCol, prevEndRow, prevEndCol], (tile) => tile.splice(tile.indexOf(obj), 1));

      //   this.add(obj, false)
      // }

      // obj.row = toGrid(obj.y);
      // obj.col = toGrid(obj.x);
    });
  },

  render() {
    this.objects.forEach(obj => obj.render());
  }
};

export default grid;
