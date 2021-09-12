import { COSTS } from '../constants';

const componentStorage = {
  COPPER: 10,
  IRON: 50,

  add({ name, value = 1 }) {
    this[name] += value;
  },

  get(name, value = 1) {
    if (this[name] >= value) {
      this[name] -= value;

      return { name, value };
    }
  },

  canBuy(buildingName) {
    return COSTS[buildingName]?.every(({ name, total }) => {
      return this[name] >= total;
    });
  },

  buy(buildingName) {
    COSTS[buildingName]?.forEach(({ name, total }) => {
      this[name] -= total;
    });
  }
};

export default componentStorage;
