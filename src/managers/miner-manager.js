import { on } from '../libs/kontra';
import Miner from '../buildings/miner';
import { layers } from '../assets/tilemap.json';
import { NUM_COLS } from '../constants';

const miners = [];

const minerManager = {
  init() {
    on('gameTick', () => {
      miners.forEach(miner => {
        // miners produce every 10 game ticks
        if (
          ++miner.timer % 10 === 0 &&
          miner.components.length < miner.maxComponents
        ) {
          miner.timer = 0;
          miner.components.push({
            name: miner.componentName
          });
        }
      });
    });
  },

  add(properties) {
    const miner = new Miner(properties);
    miners.push(miner);
    return miner;
  },

  // miner can only be placed on empty spots
  canPlace(cursor, items) {
    const tile = layers[0].data[cursor.row * NUM_COLS + cursor.col];
    return !items.length && tile === 11;
  },

  render() {
    miners.forEach(miner => miner.render());
  }
};

export default minerManager;
