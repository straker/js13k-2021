import { getContext, Text, Grid } from '../libs/kontra';
import { COLORS, GRID_SIZE, TEXT_PROPS, TYPES, COMPONENTS } from '../constants';
import { titleCase } from '../utils';
import tileatlas from '../assets/tileatlas.json';
import ImageButton from './image-button';
import GameObject from '../utils/game-object';

let popupGrid;
let name;
let closeBtn;

const textProps = {
  ...TEXT_PROPS,
  font: '14px Arial'
};

const buildingPopup = {
  hidden: true,
  width: GRID_SIZE * 10,
  padding: GRID_SIZE * 0.35,

  init() {
    name = Text({
      ...textProps,
      color: COLORS.BLACK
    });
    closeBtn = new ImageButton({
      anchor: { x: 1, y: 0 },
      width: GRID_SIZE * 2,
      height: GRID_SIZE * 2,
      name: 'DELETE_MENU',
      scaleX: 0.4,
      scaleY: 0.4,
      onDown() {
        buildingPopup.hide();
      }
    });
    popupGrid = Grid({
      flow: 'grid',
      rowGap: GRID_SIZE / 2,
      colGap: GRID_SIZE
    });
    window.popupGrid = popupGrid;
  },

  show(building) {
    this.hidden = false;

    const atlas = tileatlas[building.name];
    const buildingName =
      building.name.split('_')[0] +
      (building.type === TYPES.BELT && building.name !== 'BELT' ? ' BELT' : '');

    name.text = titleCase(buildingName);
    this.x = (building.col + 2) * GRID_SIZE;
    this.y = (building.row - 0.5 * (atlas.height - 1)) * GRID_SIZE;

    const { x, y, width } = this;
    name.x = popupGrid.x = x;
    name.y = y + GRID_SIZE * 0.35;
    closeBtn.x = x + width - GRID_SIZE / 4;
    closeBtn.y = y - GRID_SIZE * 0.15;
    popupGrid.y = y + GRID_SIZE * 1.5;

    // filter menu
    switch (building.menuType) {
      case TYPES.FILTER: {
        popupGrid.numCols = 5;
        const title = Text({
          ...textProps,
          colSpan: popupGrid.numCols,
          text: 'Filter:'
        });
        const components = ['NONE', ...COMPONENTS].map(name => {
          return new ImageButton({
            name,
            width: GRID_SIZE,
            height: GRID_SIZE,
            selected: name === building.filter,
            onDown() {
              building.filter = name;
              components.forEach(component => (component.selected = false));
              this.selected = true;
            }
          });
        });
        popupGrid.children = [title, ...components];
        break;
      }

      case TYPES.SHIP: {
        popupGrid.numCols = 10;
        const title = Text({
          ...textProps,
          colSpan: popupGrid.numCols,
          text: 'Needed for Repairs:'
        });
        const children = [];
        building.inputs.forEach(input => {
          const component = new GameObject({
            name: input.name
          });
          const text = Text({
            ...textProps,
            colSpan: popupGrid.numCols - 1,
            text: `0 / ${input.total}`
          });

          children.push(component, text);
        });
        popupGrid.children = [title, ...children];
        break;
      }
    }

    popupGrid._p();
    this.height = popupGrid.height + GRID_SIZE * 2;
  },

  hide() {
    this.hidden = true;
  },

  render() {
    if (this.hidden) return;

    const context = getContext();
    const { x, y, width, height, padding } = this;
    const sx = x - padding;
    const sy = y - padding;
    const swidth = width + padding * 2;
    const sheight = height + padding * 2;

    context.fillStyle = COLORS.WHITE;
    context.lineWidth = 1.5;
    context.strokeStyle = COLORS.WHITE;

    context.fillRect(sx, sy, swidth, GRID_SIZE * 1.35);
    context.fillStyle = COLORS.BLACK;

    context.fillRect(sx, sy + GRID_SIZE * 1.35, swidth, sheight - GRID_SIZE);
    context.strokeRect(sx, sy, swidth, sheight);
    name.render();
    closeBtn.render();

    popupGrid.render();
  }
};
export default buildingPopup;
