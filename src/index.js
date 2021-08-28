import { init, initKeys, initPointer, GameLoop, degToRad } from 'kontra';
import { GAME_WIDTH, GAME_HEIGHT } from './constants';
import grid from './utils/grid';

import Belt from './buildings/belt';
import Component from './components/component.js';

const { canvas } = init();

canvas.width = GAME_WIDTH;
canvas.height = GAME_HEIGHT;

initKeys();
initPointer();

grid.add(new Belt({ row: 0, col: 0 }));
grid.add(new Belt({ row: 0, col: 1 }));
grid.add(new Belt({ row: 0, col: 2 }));
grid.add(new Belt({ row: 0, col: 3 }));
grid.add(new Belt({ row: 0, col: 4 }));
grid.add(new Belt({ row: 0, col: 5, rotation: degToRad(90) }));
grid.add(new Belt({ row: 1, col: 5, rotation: degToRad(90) }));
grid.add(new Belt({ row: 2, col: 5, rotation: degToRad(90) }));
grid.add(new Belt({ row: 3, col: 5, rotation: degToRad(180) }));
grid.add(new Belt({ row: 3, col: 4, rotation: degToRad(180) }));
grid.add(new Belt({ row: 3, col: 3, rotation: degToRad(270) }));
grid.add(new Belt({ row: 2, col: 3, rotation: degToRad(270) }));
grid.add(new Belt({ row: 1, col: 3, rotation: degToRad(270) }));

const component = new Component({ row: 0, col: 0 });
grid.add(component);

const loop = GameLoop({
  update() {
    grid.update();
  },
  render() {
    grid.render();
  }
});
loop.start();

window.grid = grid;
window.component = component;
