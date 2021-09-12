import { on } from '../libs/kontra';
import CopperMiner from '../buildings/copper-miner';
import IronMiner from '../buildings/iron-miner';
import { layers } from '../assets/tilemap.json';
import { NUM_COLS } from '../constants';

const miners = [];
const Constructors = {
  'COPPER-MINER': CopperMiner,
  'IRON-MINER': IronMiner
};

const minerManager = {
  init() {
    on('gameTick', () => {
      miners.forEach(miner => {
        const { name, components, maxComponents } = miner;
        miner.timer = ++miner.timer % miner.duration;

        if (miner.timer % 2) {
          miner.name = name + '_END';
        } else {
          miner.name = name.split('_')[0];
        }

        if (miner.timer === 0 && components.length < maxComponents) {
          miner.timer = 0;
          components.push({
            name: miner.componentName
          });
        }
      });
    });
  },

  add(properties) {
    const miner = new Constructors[properties.name](properties);
    miners.push(miner);
    return miner;
  },

  // miner can only be placed on empty spots
  canPlace(cursor, items) {
    const tile = layers[0].data[cursor.row * NUM_COLS + cursor.col];
    return !items.length && tile === 11;
  }
};

export default minerManager;
