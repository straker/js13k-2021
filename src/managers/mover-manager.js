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

          const from = grid
            .get({ row: fromRow, col: fromCol })
            .find(item => item.type !== TYPES.WALL);
          const to = grid
            .get({ row: toRow, col: toCol })
            .find(item => item.type !== TYPES.WALL);
          const component = from?.components?.[0] ?? from?.component;

          if (
            component &&
            !component.updated &&
            to &&
            to.canTakeComponent(component)
          ) {
            mover.lastMove = 0;

            if (from.type === TYPES.BELT && to.type === TYPES.BELT) {
              moveComponent({ component, belt: to });
            } else if (to.type === TYPES.BELT) {
              componentManager.add({
                row: toRow,
                col: toCol,
                name: component.name
              });
            } else {
              if (to.addComponent) {
                to.addComponent(component);
              } else {
                to.component = component;
              }

              componentManager.remove(component);
            }

            if (from.components) {
              from.components.splice(from.components.indexOf(component), 1);
            } else {
              from.component = false;
            }

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
  }
};

export default moverManager;
