import { GRID_SIZE, TYPES } from '../constants';
import GameObject from '../utils/game-object';

let inputIndex = 0;
const inputs = [
  [
    {
      name: 'COPPER',
      total: 10,
      has: 0
    }
  ]
];

export default class Ship extends GameObject {
  constructor(properties = {}) {
    properties.width = properties.height = GRID_SIZE * 2;
    properties.type = TYPES.SHIP;
    properties.name = 'SHIP';
    properties.row = 27;
    properties.col = 5;
    properties.inputs = inputs[inputIndex++] ?? inputs[0];
    properties.state = 'enter';
    properties.menuType = TYPES.SHIP;

    super(properties);
  }

  getInput(component) {
    return this.inputs.find(input => input.name === component.name);
  }

  addComponent(component) {
    this.getInput(component).has++;
  }

  isRepaired() {
    return this.inputs.every(input => input.has >= input.total);
  }

  canTakeComponent(component) {
    const input = this.getInput(component);
    return input?.has <= input?.total;
  }
}
