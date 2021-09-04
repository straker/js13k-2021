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
        const row = miner.row + 1;
        const col = miner.col;
        const exitBelt = grid.getByType({ row, col }, TYPES.BELT)[0];

        // miners produce every 10 game ticks
        if (++miner.timer % 10 === 0) {
          miner.component = true;
        }

        if (miner.component && exitBelt && !exitBelt.component) {
          componentManager.add({ row, col });
          miner.component = false;
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
