import { GRID_SIZE, TYPES, DIRS } from '../constants';
import GameObject from '../utils/game-object';

export default class Miner extends GameObject {
  constructor(properties) {
    properties.width = properties.height = GRID_SIZE * 2;
    properties.type = TYPES.MOVER;
    properties.name = 'MOVER';
    properties.dir = DIRS[properties.rotation];
    properties.lastMove = 0;

    super(properties);
  }
}
