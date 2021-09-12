import { GRID_SIZE, TYPES } from '../constants';
import GameObject from '../utils/game-object';

export default class Assembler extends GameObject {
  constructor(properties) {
    properties.width = properties.height = GRID_SIZE * 2;
    properties.type = TYPES.ASSEMBLER;
    properties.name = 'ASSEMBLER';
    properties.timer = 0;
    properties.recipe = {
      inputs: [
        {
          name: 'COPPER',
          total: 1
        }
      ],
      outputs: [
        {
          name: 'IRON',
          total: 1
        }
      ],
      duration: 1 // game ticks
    };
    properties.inputs = [];
    properties.components = [];
    properties.maxComponents = 2; // max input and output number multiplier
    properties.menuType = TYPES.RECIPE;

    super(properties);
  }

  canProduce() {
    return this.recipe.outputs.every(output => {
      return (
        this.components.filter(comp => comp.name === output.name).length +
          output.total <=
        this.maxComponents
      );
    });
  }

  hasRequiredInputs() {
    return this.recipe.inputs.every(input => {
      return (
        this.inputs.filter(comp => comp.name === input.name).length >=
        input.total
      );
    });
  }

  canTakeComponent(component) {
    const input = this.recipe?.inputs.find(
      input => input.name === component.name
    );

    return (
      input &&
      this.inputs.filter(comp => comp.name === component.name).length <
        this.maxComponents * input.total
    );
  }
}
