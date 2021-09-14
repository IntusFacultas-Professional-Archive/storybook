export const StringReplaceAllPolyfill = () => {
  /**
     * Disabled because this is a polyfill
     */
  /* eslint-disable no-extend-native, func-names */
  if (!String.prototype.replaceAll) {
    String.prototype.replaceAll = function (str, newStr) {
      // If a regex pattern
      if (Object.prototype.toString.call(str).toLowerCase() === '[object regexp]') {
        return this.replace(str, newStr);
      }

      // If a string
      return this.replace(new RegExp(str, 'g'), newStr);
    };
  }
  /* eslint-enable no-extend-native */
};

export default StringReplaceAllPolyfill;
