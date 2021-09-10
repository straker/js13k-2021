import { COMPONENTS } from '../constants';

const componentStorage = {
  // turn an array into object keys with value 0
  ...COMPONENTS.reduce((acc, curr) => ((acc[curr] = 0), acc), {}),

  add({ name, value = 1 }) {
    this[name] += value;
  },

  get(name, value) {
    if (this[name] >= value) {
      this[name] -= value;

      return { name, value };
    }
  }
};

export default componentStorage;
