import { on, getContext } from '../libs/kontra';
import { TICK_DURATION, GRID_SIZE, COLORS } from '../constants';
import Ship from '../buildings/ship';
import { easeLinear, easeOutQuad, easeInOutQuad, easeInCubic } from '../utils';
import grid, { toGrid } from '../utils/grid';

let ship;
let timer = 0;
let panelLeftX = 0;
let panelRightX = 0;
const duration = TICK_DURATION * 8;

const phases = [
  ['enter_x', 'enter_y'],
  ['exit_y', 'exit_x']
];

on('update', () => {
  if (!ship) return;

  timer = (timer + 1 / 60) % duration;
  if (timer < 1 / 60) {
    ship.phase = phases[ship.phaseIndex][++ship.index];

    if (!ship.phase) {
      if (ship.state === 'enter' && !ship.docked) {
        ship.docked = true;
        ship.row = toGrid(ship.y);
        ship.col = toGrid(ship.x);
        grid.add(ship);
        return;
      } else if (ship.state === 'exit') {
        ship = null;
        return;
      }
    }
  }

  switch (ship.phase) {
    case 'enter_x':
      panelLeftX = panelRightX = 0;
      ship.x = easeOutQuad(timer, GRID_SIZE * 5, GRID_SIZE * 3, duration);
      break;

    case 'enter_y':
      ship.y = easeOutQuad(timer, GRID_SIZE * 27, -GRID_SIZE, duration);
      panelLeftX = easeLinear(
        timer,
        GRID_SIZE * 3.5,
        GRID_SIZE * 2.5,
        duration
      );
      panelRightX = easeLinear(
        timer,
        GRID_SIZE * 10.5,
        -GRID_SIZE * 2.5,
        duration
      );
      break;

    case 'exit_y':
      ship.y = easeInOutQuad(timer, GRID_SIZE * 26, GRID_SIZE, duration);
      panelLeftX = easeLinear(timer, GRID_SIZE * 6, -GRID_SIZE * 2.5, duration);
      panelRightX = easeLinear(timer, GRID_SIZE * 8, GRID_SIZE * 2.5, duration);
      break;

    case 'exit_x':
      panelLeftX = panelRightX = 0;
      ship.x = easeInCubic(timer, GRID_SIZE * 8, GRID_SIZE * 3, duration);
      break;
  }
});

let shipTimer = 0;
const shipManager = {
  init() {
    on('gameTick', () => {
      if (!ship) {
        shipTimer += TICK_DURATION;

        // a will arrive every 2 minutes
        if (shipTimer >= 20) {
          console.log('ship arrives');
          shipTimer = 0;
          timer = 0;
          ship = new Ship({
            phaseIndex: 0,
            index: 0,
            phase: phases[0][0]
          });
        }
      } else if (ship.isRepaired() && ship.docked) {
        timer = 0;
        ship.state = 'exit';
        ship.docked = false;
        ship.phaseIndex = 1;
        ship.index = 0;
        ship.phase = phases[1][0];
        grid.remove(ship);
      }
    });
  },

  render() {
    const context = getContext();
    context.fillStyle = COLORS.PURPLE;
    context.fillRect(
      panelLeftX,
      GRID_SIZE * 25,
      GRID_SIZE * 2.5,
      GRID_SIZE * 2
    );
    context.fillRect(
      panelRightX,
      GRID_SIZE * 25,
      GRID_SIZE * 2.5,
      GRID_SIZE * 2
    );

    if (ship) {
      ship.render();
    }
  }
};

export default shipManager;
