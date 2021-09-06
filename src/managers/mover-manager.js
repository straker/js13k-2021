import { TYPES } from '../constants';
import grid from '../utils/grid';
import { on } from '../libs/kontra';
import componentManager, { moveComponent } from './component-manager';
import Mover from '../buildings/mover';

const movers = [];

const moverManager = {
  init() {
    on('gameTick', () => {
      movers.forEach(mover => {
        // movers move every 2 game ticks
        if (++mover.lastMove >= 2) {
          const fromRow = mover.row - mover.dir.row;
          const fromCol = mover.col - mover.dir.col;
          const toRow = mover.row + mover.dir.row;
          const toCol = mover.col + mover.dir.col;

          const from = grid.get({ row: fromRow, col: fromCol })[0];
          const to = grid.getByType({ row: toRow, col: toCol }, TYPES.BELT)[0];
          const component = from?.component;

          // if (component) debugger;

          if (
            component &&
            !component.updated &&
            to &&
            to.takesComponent(component)
          ) {
            mover.lastMove = 0;

            if (from.type !== TYPES.BELT) {
              componentManager.add({ row: toRow, col: toCol });
            } else {
              moveComponent({ component, belt: to });
            }

            from.component = false;
            mover.name = 'MOVER_END';
          }
        } else {
          mover.name = 'MOVER';
        }
      });
    });
  },

  add(properties) {
    const mover = new Mover(properties);
    movers.push(mover);
    return mover;
  },

  // mover can only be placed on empty spots
  canPlace(cursor, items) {
    return !items.length;
  },

  render() {
    movers.forEach(mover => mover.render());
  }
};

export default moverManager;
