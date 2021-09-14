export const CustomEventPolyfill = () => {
  if (typeof window.CustomEvent === 'function') return false;

  function CustomEvent(event, params) {
    /**
     * This is a polyfill.
     */
    /* eslint-disable-next-line no-param-reassign */
    params = params || {
      bubbles: false,
      cancelable: false,
      detail: null,
    };
    const evt = document.createEvent('CustomEvent');
    evt.initCustomEvent(
      event,
      params.bubbles,
      params.cancelable,
      params.detail,
    );
    return evt;
  }

  window.CustomEvent = CustomEvent;
};

export default CustomEventPolyfill;
