import { CustomEventPolyfill } from '@Components/CustomEventPolyfill.js';
import { generateId } from './utils.js';

export const IFCModalPlugin = {

  /**
   * The whole point of a plugin install is to modify Vue, so we need
   * to allow param reassign
   */
  /* eslint-disable no-param-reassign */
  install: (Vue) => {
    /**
     * This is a polyfill, we want to let it be.
     */
    /* eslint-disable func-names, consistent-return, no-param-reassign */
    Vue.prototype.$IFCModal = (id, showOrHide) => {
      CustomEventPolyfill();
      const evt = new CustomEvent(generateId(id), {
        detail: { modal: showOrHide },
      });
      window.dispatchEvent(evt);
    };
  },
  /* eslint-enable */
};

export default IFCModalPlugin;
