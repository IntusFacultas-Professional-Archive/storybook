import { CustomEventPolyfill } from '@Components/CustomEventPolyfill.js';

export const TOCPluginEventName = 'IFC-table-of-contents';

export const IFCTableOfContentsPlugin = {

  /**
   * The whole point of a plugin install is to modify Vue, so we need
   * to allow param reassign
   */
  /* eslint-disable no-param-reassign */
  install: (Vue) => {
    Vue.prototype.$IFCTOCRefresh = () => {
      CustomEventPolyfill();
      const evt = new CustomEvent(TOCPluginEventName);
      window.dispatchEvent(evt);
    };
  },
};

export default IFCTableOfContentsPlugin;
