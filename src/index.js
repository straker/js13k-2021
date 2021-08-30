import {
  init,
  initKeys,
  initPointer,
  GameLoop,
  degToRad,
  pointerPressed,
  bindKeys,
  emit
} from 'kontra';
import { GAME_WIDTH, GAME_HEIGHT, GRID_SIZE, TYPES } from './constants';
import grid, { toGrid } from './utils/grid';

import Belt from './buildings/belt';
import Component from './components/component';
import ComponentManager from './component-manager';

const { canvas } = init();

canvas.width = GAME_WIDTH;
canvas.height = GAME_HEIGHT;

initKeys();
const pointer = initPointer();

const componentManager = new ComponentManager();

const beltShadow = new Belt({ row: 0, col: 0, noSegment: true, opacity: 0.5 });

let counter = 0;
const loop = GameLoop({
  blur: true,
  update(dt) {
    grid.update();

    beltShadow.x = (toGrid(pointer.x) + 0.5) * GRID_SIZE;
    beltShadow.y = (toGrid(pointer.y) + 0.5) * GRID_SIZE;

    if (
      pointerPressed('left') &&
      !grid.getByType({ x: beltShadow.x, y: beltShadow.y }, TYPES.BELT).length
    ) {
      grid.add(
        new Belt({
          row: toGrid(pointer.y),
          col: toGrid(pointer.x),
          rotation: beltShadow.rotation
        })
      );
    }

    // update all game logic every 200 ms (200ms / 1000 ms = 0.2)
    counter += dt;
    if (counter >= 0.5) {
      counter -= 0.5;
      emit('gameTick');
    }
  },
  render() {
    grid.render();
    componentManager.render();
    beltShadow.render();
  }
});
loop.start();

bindKeys(
  'r',
  () => {
    beltShadow.rotation = (beltShadow.rotation + degToRad(90)) % (Math.PI * 2);
  },
  { preventDefault: false }
);

bindKeys('s', () => {
  const row = toGrid(pointer.y);
  const col = toGrid(pointer.x);
  const belt = grid.getByType({ row, col }, TYPES.BELT)[0];
  if (belt && !belt.component) {
    const component = new Component({ row, col });
    componentManager.add(component);
    belt.component = component;
  }
});

window.grid = grid;
