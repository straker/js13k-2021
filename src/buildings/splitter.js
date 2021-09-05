import { GRID_SIZE } from '../constants';
import Belt from './belt';

export default class Splitter extends Belt {
  constructor(properties) {
    properties.height = GRID_SIZE;
    properties.width = 2 * properties.height;
    properties.name = 'SPLITTER';

    super(properties);
  }

  draw() {
    super.draw();
  }
}
