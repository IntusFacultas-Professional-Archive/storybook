import { saneDefault } from '@Components/utils.js';
import { CustomEventPolyfill } from '@Components/CustomEventPolyfill.js';
import { idGenerator } from './utils.js';

export const EventName = 'IFCAlert';
export const EventNameCancel = `${EventName}-Cancel`;
export const EventNameRefocus = `${EventName}-Refocus`;

export const IFCAlertPlugin = {

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
    const generator = idGenerator();
    Vue.prototype.$IFCAlertCancel = (alertId) => {
      CustomEventPolyfill();
      const evt = new CustomEvent(EventNameCancel, {
        detail: { id: alertId },
      });
      window.dispatchEvent(evt);
    };
    Vue.prototype.$IFCAlert = (alert) => {
      CustomEventPolyfill();
      alert.id = alert.id ?? generator.next().value;
      (alert.buttons ?? []).forEach((button) => {
        button.action = button.action ?? saneDefault;
        button.id = button.id ?? generator.next().value;
      });
      const evt = new CustomEvent(EventName, {
        detail: { alert },
      });
      window.dispatchEvent(evt);
    };
  },
  /* eslint-enable */
};

export default IFCAlertPlugin;
