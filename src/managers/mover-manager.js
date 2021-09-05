import { TYPES } from '../constants';
import grid from '../utils/grid';
import { on } from 'kontra';
import componentManager from './component-manager';
import Mover from '../buildings/mover';

const movers = [];

const moverManager = {
  init() {
    on('gameTick', () => {
      movers.forEach(mover => {

	// movers move every 2 game ticks
	if (++mover.timer % 2 === 0) {
	  const fromRow = mover.row - mover.dir.row;
	  const fromCol = mover.col - mover.dir.col;
	  const toRow = mover.row + mover.dir.row;
	  const toCol = mover.col + mover.dir.col;

	  const from = grid.get({ row: fromRow, col: fromCol })[0];
	  const to = grid.getByType({ row: toRow, col: toCol }, TYPES.BELT)[0];

	  if (from?.component && to && !to.component) {
	    componentManager.add({ row: toRow, col: toCol });
	    from.component = false;
	    mover.name = 'MOVER_END';
	  }
	}
	else {
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

  render() {
    movers.forEach(mover => mover.render());
  }
};

export default moverManager;
