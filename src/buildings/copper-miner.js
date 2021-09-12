import { GRID_SIZE, TYPES } from '../constants';
import GameObject from '../utils/game-object';

export default class CopperMiner extends GameObject {
  constructor(properties) {
    properties.width = properties.height = GRID_SIZE * 2;
    properties.type = TYPES.MINER;
    properties.name = 'COPPER-MINER';
    properties.componentName = 'COPPER';
    properties.components = [];
    properties.maxComponents = 5;
    properties.duration = 10; // miner produce every 10 game ticks
    properties.timer = 0;

    super(properties);
  }
}
