import { createDecorator } from 'vue-class-component';
import { isFunction } from 'lodash';

/**
 * Used to execute a method unless instance member (prop, data, computed or method) evaluates to true.
 *
 * Mostly used for conditionally emitting events.
 *
 * @param member the instance member (prop, data, computed or method)
 */
export const Unless = (member: string) =>
  createDecorator((options, key) => {
    const decoratedMethod = options.methods[key];

    options.methods[key] = function(...args) {
      const predicate = this[member];

      if (isFunction(predicate) ? predicate() : predicate) {
        return;
      }

      decoratedMethod.apply(this, args);
    };
  });
