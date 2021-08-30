import { on } from 'kontra';
import { beltSegments } from './buildings/belt';

const components = [];

// belt segments and update pattern inspired from https://www.youtube.com/watch?v=88cIVR4KI_Q
export default class ComponentManager {
  constructor() {
    on('gameTick', () => {
      components.forEach(component => component.updated = false);
      beltSegments.forEach(beltSegments => beltSegments.updated = false);

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
          while(belt) {
            const { component, nextBelt } = belt;
            if (component && !component.updated && nextBelt && !nextBelt.component) {
              nextBelt.component = component;
              belt.component = null;

              component.x = nextBelt.x;
              component.y = nextBelt.y;
              component.updated = true;
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
          const { component, belt } = removed;
          belt.component = component;
          component.x = belt.x;
          component.y = belt.y;
          component.updated = true;
        }
      });
    });
  }

  add(component) {
    components.push(component);
  }

  render() {
    components.forEach(component => component.render());
  }
}