import { Grid, Text } from '../libs/kontra';
import { COMPONENTS, GRID_SIZE, COLORS } from '../constants';
import Component from '../components/component';
import componentStorage from '../components/storage';
import { displayComponentValue } from '../utils';

window.componentStorage = componentStorage;

const textProps = {
  font: `${GRID_SIZE}px Arial`,
  color: COLORS.WHITE,
  anchor: { x: 0, y: 0.5 }
};

let grid;
const componentDisplay = {
  init() {
    const children = [];

    COMPONENTS.forEach(name => {
      children.push(
        new Component({ name }),
        Text({
          ...textProps,
          name,
          text: displayComponentValue(0)
        })
      );
    });

    grid = Grid({
      x: GRID_SIZE,
      y: GRID_SIZE / 4,
      flow: 'row',
      align: 'center',
      colGap: [GRID_SIZE / 4, GRID_SIZE],
      children
    });
  },

  render() {
    grid.children.forEach(child => {
      if (child.text) {
        // save some processing power by not updating the text value
        // if it hasn't chaned
        const value = displayComponentValue(componentStorage[child.name]);
        if (child.text !== value) {
          child.text = value;
        }
      }
    });
    grid.render();
  }
};
export default componentDisplay;
