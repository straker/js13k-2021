import { GRID_SIZE, GAME_WIDTH, GAME_HEIGHT } from '../constants';

const tiles = [];
const rows = GAME_HEIGHT / GRID_SIZE;
const cols = GAME_WIDTH / GRID_SIZE;

for (let row = 0; row < rows; row++) {
  tiles[row] = [];

  for (let col = 0; col < cols; col++) {
    tiles[row][col] = [];
  }
}

const grid = {
  objects: [],
  add(obj) {
    const row = (obj.y / GRID_SIZE) | 0;
    const col = (obj.x / GRID_SIZE) | 0;
    obj.row = row;
    obj.col = col;
    tiles[row][col].push(obj);
    this.objects.push(obj);
  },

  get(x, y) {
    return tiles[(y / GRID_SIZE) | 0][(x / GRID_SIZE) | 0];
  },

  update() {
    this.objects.forEach(obj => {
      obj.update();

      // remove object from previous grid space
      const row = (obj.y / GRID_SIZE) | 0;
      const col = (obj.x / GRID_SIZE) | 0;
      if (obj.row !== row || obj.col !== col) {
        const objects = tiles[obj.row][obj.col];
        objects.splice(objects.indexOf(obj), 1);
        tiles[row][col].push(obj);
      }

      obj.row = row;
      obj.col = col;
    });
  },

  render() {
    this.objects.forEach(obj => obj.render());
  }
};

export default grid;
