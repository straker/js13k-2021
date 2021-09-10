import { on } from '../libs/kontra';
import Assembler from '../buildings/assembler';

const assemblers = [];

const assemblerManager = {
  init() {
    on('gameTick', () => {
      assemblers.forEach(assembler => {
        const { inputs, recipe, components, producing, timer, maxComponents } =
          assembler;

        if (!producing && timer === 0) {
          const canProduce = recipe.outputs.every(output => {
            return (
              components.filter(comp => comp.name === output.name).length +
                output.number <=
              maxComponents
            );
          });
          const hasRequiredInputs = recipe.inputs.every(input => {
            return (
              inputs.filter(comp => comp.name === input.name).length >=
              input.number
            );
          });

          if (canProduce && hasRequiredInputs) {
            recipe.inputs.forEach(input => {
              for (let i = 0; i < input.number; i++) {
                inputs.splice(
                  inputs.findIndex(comp => comp.name === input.name),
                  1
                );
              }
            });

            assembler.producing = true;
          }
        }

        if (assembler.producing && ++assembler.timer >= recipe.duration) {
          assembler.timer = 0;
          assembler.producing = false;
          recipe.outputs.forEach(output => {
            for (let i = 0; i < output.number; i++) {
              components.push({
                name: output.name
              });
            }
          });
        }
      });
    });
  },

  add(properties) {
    const assembler = new Assembler(properties);
    assemblers.push(assembler);
    return assembler;
  },

  // assembler can only be placed on empty spots
  canPlace(cursor, items) {
    return !items.length;
  },

  render() {
    assemblers.forEach(assembler => assembler.render());
  }
};

export default assemblerManager;
