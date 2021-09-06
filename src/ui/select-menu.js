import { Grid, Button, imageAssets, bindKeys } from '../libs/kontra';
import { GRID_SIZE, GAME_HEIGHT, COLORS } from '../constants';
import tileatlas from '../assets/tileatlas.json';
import cursor from './cursor';

let menu;
let openedMenu;
const menuHierarchy = {};

function closeMenu(name) {
  const hierarchy = menuHierarchy[name];
  hierarchy.parent.opened = false;
  hierarchy.parent.blur();
  hierarchy.grid.children = [hierarchy.parent];
  hierarchy.children.forEach(child => {
    child.blur();
    child.disable();
  });
}

function createButton(properties) {
  properties.width = properties.height = GRID_SIZE * 2;
  properties.scaleX = properties.scaleY = properties.child ? 0.6 : 0.75;

  return Button({
    ...properties,
    onDown() {
      if (openedMenu === this) {
        closeMenu(this.name);
        openedMenu = null;
        cursor.setImage('');
        cursor.hide();
      } else {
        this.focus();
      }
    },
    onFocus() {
      Object.keys(menuHierarchy).forEach(menuName => {
        const hierarchy = menuHierarchy[menuName];

        if (!this.child) {
          if (hierarchy.parent !== this) {
            hierarchy.parent.focused = false;
          }

          // close submenu
          if (menuName !== this.name) {
            closeMenu(menuName);
          }
          // open submenu
          else {
            openedMenu = hierarchy.parent;
            hierarchy.parent.opened = true;
            hierarchy.grid.children = [hierarchy.parent, ...hierarchy.children];
            hierarchy.children.forEach(child => child.enable());
          }
        }
        // focus parent when child is selected
        else if (hierarchy.children.includes(this)) {
          hierarchy.parent.focused = true;
        }
      });

      if (this.child) {
        cursor.setImage(this.name.split('_')[0]);
        cursor.rotation = 0;
      } else {
        cursor.setImage('');
      }
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
        GRID_SIZE * 2,
        GRID_SIZE * 2,
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
      name: 'BELT_MENU'
    });
    beltMenu._dn.setAttribute('aria-label', 'Belt Menu');
    const beltMenuItem = createButton({
      name: 'BELT_MENU_ITEM',
      child: true
    });
    beltMenuItem._dn.setAttribute('aria-label', 'Belt');
    const moverMenuItem = createButton({
      name: 'MOVER_MENU_ITEM',
      child: true
    });
    moverMenuItem._dn.setAttribute('aria-label', 'Mover');

    const minerMenu = createButton({
      name: 'MINER_MENU'
    });
    minerMenu._dn.setAttribute('aria-label', 'Miner Menu');
    const minerMenuItem = createButton({
      name: 'MINER_MENU_ITEM',
      child: true
    });
    minerMenuItem._dn.setAttribute('aria-label', 'Metal Miner');

    const assemblerMenu = createButton({
      name: 'ASSEMBLER_MENU'
    });
    assemblerMenu._dn.setAttribute('aria-label', 'Assembler Menu');

    const deleteMenu = createButton({
      name: 'DELETE_MENU'
    });
    deleteMenu._dn.setAttribute('aria-label', 'Delete Tool');

    const beltMenuGrid = Grid({
      flow: 'row',
      align: 'start',
      jusify: 'start',
      // for some reason the menu items have to start in the
      // grid, otherwise they can't be clicked on
      children: [beltMenu, beltMenuItem, moverMenuItem],
      colGap: GRID_SIZE / 1.5
    });
    const minerMenuGrid = Grid({
      flow: 'row',
      children: [minerMenu, minerMenuItem],
      colGap: GRID_SIZE / 1.5
    });
    const assmeblerMenuGrid = Grid({
      flow: 'row',
      children: [assemblerMenu],
      colGap: GRID_SIZE / 1.5
    });

    menu = Grid({
      x: GRID_SIZE,
      y: GAME_HEIGHT - GRID_SIZE * 2,
      flow: 'row',
      colGap: GRID_SIZE * 1.25,
      children: [beltMenuGrid, minerMenuGrid, assmeblerMenuGrid, deleteMenu]
    });

    menuHierarchy.BELT_MENU = {
      grid: beltMenuGrid,
      parent: beltMenu,
      children: [beltMenuItem, moverMenuItem]
    };
    menuHierarchy.MINER_MENU = {
      grid: minerMenuGrid,
      parent: minerMenu,
      children: [minerMenuItem]
    };
    menuHierarchy.ASSEMBLER_MENU = {
      grid: assmeblerMenuGrid,
      parent: assemblerMenu,
      children: []
    };

    closeMenu('BELT_MENU');
    closeMenu('MINER_MENU');

    bindKeys(['1', '2', '3', '4', '5'], evt => {
      const key = +evt.key - 1;

      // first open menu
      if (!openedMenu) {
        if (
          menu.children[key]?.children &&
          menu.children[key]?.children[0].focus
        ) {
          menu.children[key]?.children[0].focus();
        } else if (menu.children[key]) {
          cursor.show();
          menu.children[key].focus();
        }
      }
      // focus submenu item
      else {
        cursor.show();
        menuHierarchy[openedMenu.name]?.children[key]?.focus();
      }
    });
    bindKeys('esc', () => {
      closeMenu(openedMenu.name);
      openedMenu = null;
      cursor.setImage('');
      cursor.hide();
    });
  },

  update() {
    menu.update();
  },

  render() {
    menu.render();
  }
};
export default selectMenu;
