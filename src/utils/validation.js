import { every, has } from 'lodash';

/**
 * Creates an error message object used to display an error message for a given
 * validator(s).
 *
 * @param {object|string} validation - The validator field or validation object
 * @param {string} message - Error message for the given validation
 */
export function errorMessagesFactory(validation, message) {
  if (message) {
    return {
      [validation]: message
    };
  }

  return validation;
}

/**
 * Checks if object contains all of the given properties.
 *
 * @param object object to check props against
 * @param props props to check
 * @returns {boolean} true if object contains all of the properties, false otherwise
 */
export function hasProperties(object, ...props) {
  return every(props, prop => has(object, prop));
}
