import { TYPES } from '../constants';
import grid from '../utils/grid';
import { on } from 'kontra';
import componentManager from './component-manager';
import Miner from '../buildings/miner';

const miners = [];

const minerManager = {
  init() {
    on('gameTick', () => {
      miners.forEach(miner => {
        // miners produce every 10 game ticks
        if (++miner.timer % 10 === 0) {
          miner.component = true;
        }
      });
    });
  },

  add(properties) {
    const miner = new Miner(properties);
    miners.push(miner);
    return miner;
  },

  render() {
    miners.forEach(miner => miner.render());
  }
};

export default minerManager;
