import { on } from '../libs/kontra';
import CopperMiner from '../buildings/copper-miner';
import IronMiner from '../buildings/iron-miner';
import TitaniumMiner from '../buildings/titanium-miner';
import { layers } from '../assets/tilemap.json';
import { NUM_COLS } from '../constants';
import { removeFromArray } from '../utils';

const miners = [];
const Constructors = {
  'COPPER-MINER': CopperMiner,
  'IRON-MINER': IronMiner,
  'TITANIUM-MINER': TitaniumMiner
};

const minerManager = {
  init() {
    on('gameTick', () => {
      miners.forEach(miner => {
        const { components, maxComponents } = miner;
        miner.timer = ++miner.timer % miner.duration;
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

  remove(miner) {
    removeFromArray(miners, miner);
  },

  // miner can only be placed on empty spots
  canPlace(cursor, items) {
    const tile = layers[0].data[cursor.row * NUM_COLS + cursor.col];
    return !items.length && tile === 11;
  }
};

export default minerManager;
