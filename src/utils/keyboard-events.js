import keyCodes from '../enums/key-codes';
import keys from '../enums/keys';

/**
 * Checks if given key is pressed in a keydown or keyup event.
 *
 * This function is not guaranteed to work with keypress event as it behaves a bit different and is deprecated,
 * use beforeinput or keydown events instead.
 *
 * Used as a polyfill for the browsers not supporting event.key property.
 *
 * @param keyboardConst the keyboard key constant from consts/keyboard.js file
 * @param key the key value(usually from event.key property)
 * @param keyCode the key code value(usually from event.keyCode property)
 * @returns {boolean} checks if the given key caused the event to trigger
 */
export function isKey(keyboardConst, { key, keyCode }) {
  return key === keys[keyboardConst] || keyCode === keyCodes[keyboardConst];
}
