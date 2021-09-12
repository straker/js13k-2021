import { Grid, bindKeys } from '../libs/kontra';
import { GRID_SIZE, GAME_HEIGHT } from '../constants';
import cursor from './cursor';
import ImageButton from './image-button';

let menubar;
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

  return new ImageButton({
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
      } else {
        cursor.setImage('');
      }
    }
  });
}

const buildingMenuBar = {
  init() {
    const beltMenu = createButton({
      name: 'BELT_MENU'
    });
    const beltMenuItem = createButton({
      name: 'BELT_MENU_ITEM',
      child: true
    });
    const moverMenuItem = createButton({
      name: 'MOVER_MENU_ITEM',
      child: true
    });
    const repairerMenuItem = createButton({
      name: 'REPAIRER_MENU_ITEM',
      child: true
    });

    const minerMenu = createButton({
      name: 'MINER_MENU'
    });
    const minerMenuItem = createButton({
      name: 'MINER_MENU_ITEM',
      child: true
    });

    const assemblerMenu = createButton({
      name: 'ASSEMBLER_MENU'
    });
    const assemblerMenuItem = createButton({
      name: 'ASSEMBLER_MENU_ITEM',
      child: true
    });

    const deleteMenu = createButton({
      name: 'DELETE_MENU'
    });

    const beltMenuGrid = Grid({
      flow: 'row',
      align: 'start',
      jusify: 'start',
      colGap: GRID_SIZE / 1.5
    });
    const minerMenuGrid = Grid({
      flow: 'row',
      colGap: GRID_SIZE / 1.5
    });
    const assmeblerMenuGrid = Grid({
      flow: 'row',
      colGap: GRID_SIZE / 1.5
    });

    menubar = Grid({
      x: GRID_SIZE,
      y: GAME_HEIGHT - GRID_SIZE * 2,
      flow: 'row',
      colGap: GRID_SIZE * 1.25,
      children: [beltMenuGrid, minerMenuGrid, assmeblerMenuGrid, deleteMenu]
    });

    menuHierarchy.BELT_MENU = {
      grid: beltMenuGrid,
      parent: beltMenu,
      children: [beltMenuItem, moverMenuItem, repairerMenuItem]
    };
    menuHierarchy.MINER_MENU = {
      grid: minerMenuGrid,
      parent: minerMenu,
      children: [minerMenuItem]
    };
    menuHierarchy.ASSEMBLER_MENU = {
      grid: assmeblerMenuGrid,
      parent: assemblerMenu,
      children: [assemblerMenuItem]
    };

    closeMenu('BELT_MENU');
    closeMenu('MINER_MENU');
    closeMenu('ASSEMBLER_MENU');

    bindKeys(['1', '2', '3', '4', '5'], evt => {
      const key = +evt.key - 1;

      // first open menu
      if (!openedMenu) {
        if (
          menubar.children[key]?.children &&
          menubar.children[key]?.children[0].focus
        ) {
          menubar.children[key]?.children[0].focus();
        } else if (menubar.children[key]) {
          cursor.show();
          menubar.children[key].focus();
        }
      }
      // focus submenu item
      else {
        cursor.show();
        menuHierarchy[openedMenu.name]?.children[key]?.focus();
      }
    });
    bindKeys('esc', () => {
      if (openedMenu) {
        closeMenu(openedMenu.name);
        openedMenu = null;
        cursor.setImage('');
        cursor.hide();
      }
    });
  },

  update() {
    menubar.update();
  },

  render() {
    menubar.render();
  }
};
export default buildingMenuBar;
