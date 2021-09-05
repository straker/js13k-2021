import { GRID_SIZE } from '../constants';
import Belt from './belt';

export default class ExportBelt extends Belt {
  constructor(properties) {
    super(properties);

    this.name = 'IMPORT';
    this.prevBelt = {
      name: 'ENTER',
      x: this.x - this.dir.col * GRID_SIZE,
      y: this.y - this.dir.row * GRID_SIZE,
      get component() {
        return false;
      }
    };
  }
}
