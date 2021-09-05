import { on } from 'kontra';
import { beltSegments } from './belt-manager';
import { easeLinear } from '../utils';
import grid from '../utils/grid';
import { TICK_DURATION, TYPES } from '../constants';
import Component from '../components/component';

const components = [];
const moveComponents = [];

let time = 0;
on('update', () => {
  time = (time + 1 / 60) % TICK_DURATION;
  moveComponents.forEach(({ x, y, component, belt }) => {
    component.x = easeLinear(time, x, belt.x - x, TICK_DURATION);
    component.y = easeLinear(time, y, belt.y - y, TICK_DURATION);
  });
});

export function moveComponent({ component, belt }) {
  belt.component = component;
  component.updated = true;

  moveComponents.push({
    x: component.x,
    y: component.y,
    component,
    belt
  });
}

// belt segments and update pattern inspired from https://www.youtube.com/watch?v=88cIVR4KI_Q
const componentManager = {
  init() {
    on('preGameTick', () => {
      time = 0;
      components.forEach(component => (component.updated = false));
      beltSegments.forEach(beltSegments => (beltSegments.updated = false));
      moveComponents.forEach(({ component, belt }) => {
        component.x = belt.x;
        component.y = belt.y;
      });
      moveComponents.length = 0;
    });

    on('gameTick', () => {
      beltSegments.forEach(currSegment => {
        let removed;

        // update each segment in closest to the end of the segment
        // chain order so we can move the components in the same
        // order (so a component at the end of the chain moves before
        // a component at the start of the chain)
        let segment;
        do {
          segment = currSegment;
          if (segment.updated) return;

          const visitedSegments = [segment];
          while (
            !visitedSegments.includes(segment.end.nextBelt?.segment) &&
            segment.end.nextBelt?.segment?.updated === false
          ) {
            segment = segment.end.nextBelt.segment;
            visitedSegments.push(segment);
          }

          // special case: if the segment chain loops on itself, then
          // we need to determine if the entire component chain has
          // room to move. if it does then we remove the last component
          // and update all components, then place the last component
          // back into the correct spot
          if (
            visitedSegments.includes(segment.end.nextBelt?.segment) &&
            segment.end.component &&
            segment.end.nextBelt.component
          ) {
            const startBelt = segment.end.nextBelt;
            let belt = startBelt.nextBelt;
            let emptyBelt = false;
            while (belt !== startBelt) {
              if (!belt.component) {
                emptyBelt = true;
                break;
              }

              belt = belt.nextBelt;
            }

            if (emptyBelt) {
              removed = {
                component: startBelt.component,
                belt: startBelt.nextBelt
              };
              startBelt.component = null;
            }
          }

          let belt = segment.end;
          while (belt) {
            const { component, nextBelt } = belt;
            if (
              component &&
              !component.updated &&
              nextBelt &&
              !nextBelt.component
            ) {
              belt.component = null;
              moveComponent({ component, belt: nextBelt });
            }

            if (belt === segment.start) {
              break;
            }

            belt = belt.prevBelt;
          }

          segment.updated = true;
        } while (segment !== currSegment);

        // place the special case removed component onto the
        // next belt it should have moved to
        if (removed) {
          moveComponent(removed);
        }
      });
    });
  },

  add(properties) {
    const { row, col } = properties;
    const belt = grid.getByType({ row, col }, TYPES.BELT)[0];
    const component = new Component(properties);
    belt.component = component;

    components.push(component);
    return component;
  },

  render() {
    components.forEach(component => component.render());
  }
};

export default componentManager;
