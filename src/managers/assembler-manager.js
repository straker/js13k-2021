import { on } from '../libs/kontra';
import Assembler from '../buildings/assembler';

const assemblers = [];

const assemblerManager = {
  init() {
    on('gameTick', () => {
      // assemblers.forEach(assembler => {
      // });
    });
  },

  add(properties) {
    const assembler = new Assembler(properties);
    assemblers.push(assembler);
    return assembler;
  },

  // assembler can only be placed on empty spots
  canPlace(cursor, items) {
    return !items.length;
  },

  render() {
    assemblers.forEach(assembler => assembler.render());
  }
};

export default assemblerManager;
