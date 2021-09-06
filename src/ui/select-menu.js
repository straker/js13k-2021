import { Button, imageAssets, bindKeys } from 'kontra';
import { GRID_SIZE, GAME_HEIGHT, COLORS } from '../constants';
import tileatlas from '../assets/tileatlas.json';
import cursor from './cursor';

const menuItems = [];

function createButton(properties) {
  properties.width = properties.height = GRID_SIZE * 2;
  properties.scaleX = properties.scaleY = 0.75;

  return Button({
    ...properties,
    anchor: { x: 0.5, y: 0.5 },
    onDown() {
      this.focus();
    },
    onFocus() {
      cursor.setImage(this.name.split('_')[0]);
      cursor.rotation = 0;
    },
    render() {
      const { name, context, width, height } = this;
      const atlas = tileatlas[name];
      const start = -GRID_SIZE / 4;
      const end = GRID_SIZE * 2.5;

      context.fillStyle = COLORS.BLACK;
      context.fillRect(start, start, end, end);

      context.drawImage(
        imageAssets.tilesheet,
        atlas.col * GRID_SIZE,
        atlas.row * GRID_SIZE,
        width,
        height,
        0,
        0,
        width,
        height
      );
      context.lineWidth = 2;

      if (this.focused) {
        context.strokeStyle = COLORS.YELLOW;
      } else {
        context.strokeStyle = COLORS.WHITE;
      }
      context.strokeRect(start, start, end, end);
    }
  });
}

const selectMenu = {
  init() {
    const beltMenu = createButton({
      name: 'BELT_MENU',
      x: GRID_SIZE * 1.5,
      y: GAME_HEIGHT - GRID_SIZE * 1.5
    });
    beltMenu._dn.textContent = 'Belts';

    const minerMenu = createButton({
      name: 'MINER_MENU',
      x: GRID_SIZE * 4.5,
      y: GAME_HEIGHT - GRID_SIZE * 1.5
    });
    minerMenu._dn.textContent = 'Miners';

    const assemblerMenu = createButton({
      name: 'ASSEMBLER_MENU',
      x: GRID_SIZE * 7.5,
      y: GAME_HEIGHT - GRID_SIZE * 1.5
    });
    assemblerMenu._dn.textContent = 'Assemblers';

    const deleteMenu = createButton({
      name: 'DELETE_MENU',
      x: GRID_SIZE * 10.5,
      y: GAME_HEIGHT - GRID_SIZE * 1.5
    });
    deleteMenu._dn.textContent = 'Miners';

    menuItems.push(beltMenu);
    menuItems.push(minerMenu);
    menuItems.push(assemblerMenu);
    menuItems.push(deleteMenu);

    beltMenu.focus();

    bindKeys('1', () => {
      beltMenu.focus();
    });
    bindKeys('2', () => {
      minerMenu.focus();
    });
    bindKeys('3', () => {
      assemblerMenu.focus();
    });
    // bindKeys('4', () => {
    //   deleteMenu.focus();
    // });
  },

  render() {
    menuItems.forEach(item => item.render());
  }
};
export default selectMenu;
