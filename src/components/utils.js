/**
* Disabled because we are mutating a string, which is pass by value anyways.
*/

import { StringReplaceAllPolyfill } from './StringReplaceAllPolyfill.js';

/* eslint-disable no-param-reassign */
export const convertToTitleCase = (str) => {
  StringReplaceAllPolyfill();
  const camelCaseReplacement = (s) => {
    // ie11 doesn't let us support negative lookbehind so we can't do /(?<! )([A-Z])/g
    // so to avoid the problem we first just remove all the spaces. it's stupid but oh well.
    s = s.split(' ').join('');
    s = s.replaceAll(/([A-Z])/g, ' $1');
    return s.charAt(0).toUpperCase() + s.slice(1);
  };
  const snakeCaseReplacement = (s) => s.split('_').map((p) => p.charAt(0).toUpperCase() + p.slice(1)).join(' ');
  return snakeCaseReplacement(camelCaseReplacement(str)).trim();
};
/* eslint-enable no-param-reassign */

export const deepClone = (data) => JSON.parse(JSON.stringify(data));

export const saneDefault = () => {};

export default {
  convertToTitleCase,
};
