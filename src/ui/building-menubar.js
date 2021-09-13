import { Grid, bindKeys, emit } from '../libs/kontra';
import { GRID_SIZE, GAME_HEIGHT, TYPES } from '../constants';
import cursor from './cursor';
import ImageButton from './image-button';
import storage from '../components/storage';
import buildingPopup from './building-popup';

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
  buildingPopup.hide();
}

function createButton(properties) {
  if (properties.child) {
    properties.menuType = TYPES.INFO;
  } else {
    properties.menuType = TYPES.TIP;
  }
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
    onOver() {
      buildingPopup.show(this, false);
      this.popup = true;
    },
    onOut() {
      if (this.popup) {
        this.popup = false;
        buildingPopup.hide();
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
            hierarchy.children.forEach(child => {
              if (storage.canBuy(child.name.split('_')[0])) {
                child.enable();
              } else {
                child.disable();
              }
            });
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
    const copperMinerMenuItem = createButton({
      name: 'COPPER-MINER_MENU_ITEM',
      child: true
    });
    const ironMinerMenuItem = createButton({
      name: 'IRON-MINER_MENU_ITEM',
      child: true
    });
    const titaniumMinerMenuItem = createButton({
      name: 'TITANIUM-MINER_MENU_ITEM',
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
      children: [copperMinerMenuItem, ironMinerMenuItem, titaniumMinerMenuItem]
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
      emit('esc');
      if (openedMenu) {
        closeMenu(openedMenu.name);
        openedMenu = null;
        cursor.setImage('');
        cursor.hide();
      }
    });
  },

  update() {
    const hierarchy = menuHierarchy[openedMenu?.name];
    hierarchy?.children.forEach(child => {
      if (storage.canBuy(child.name.split('_')[0])) {
        child.enable();
      } else {
        child.disable();

        // keyboard events won't propagate on disabled buttons
        // so we need to move focus off a button if the user
        // is currently focused on it
        if (child.focused) {
          child.blur();
          hierarchy.parent.focus();
        }
      }
    });

    menubar.update();
  },

  render() {
    menubar.render();
  }
};
export default buildingMenuBar;
