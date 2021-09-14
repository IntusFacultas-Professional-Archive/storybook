import { IFCAlertModal } from '@Components/Alert/IFCAlertModal.vue';
import {
  EventNameRefocus, IFCAlertPlugin, EventNameCancel, EventName,
} from '@Components/Alert/IFCAlertPlugin';
import { IFCAlert } from '@Components/Alert/IFCAlert.vue';
import { mount } from '@vue/test-utils';
import Vue from 'vue';

describe('IFCAlertModal.vue', () => {
  it('has a prop alert of type Object that is required', () => {
    const { alert } = IFCAlertModal.props;
    expect(alert.type).toBe(Object);
    expect(alert.required).toBe(true);
  });
  it('sets event listeners and focuses first element on mount', async () => {
    const focusSpy = jest.spyOn(IFCAlertModal.mixins[0].methods, 'focusFirstElement');
    document.addEventListener = jest.fn();
    window.addEventListener = jest.fn();
    const wrapper = mount(IFCAlertModal, {
      propsData: {
        alert: {

        },
      },
    });
    await wrapper.vm.$nextTick();
    expect(focusSpy).toHaveBeenCalled();
    expect(document.addEventListener).toHaveBeenCalledWith('keydown', wrapper.vm.captureFocus);
    expect(window.addEventListener).toHaveBeenCalledWith(EventNameRefocus, wrapper.vm.recaptureFocus);
  });
  it('handles autotimeout alerts', () => {
    const spy = jest.spyOn(IFCAlertModal.methods, 'handleAutoClose');
    document.addEventListener = jest.fn();
    window.addEventListener = jest.fn();
    const wrapper = mount(IFCAlertModal, {
      propsData: {
        alert: {
          autoclose: 7500,
        },
      },
    });
    expect(spy).toHaveBeenCalled();
    // 6 because 7500 gets rounded to 7000 and gets decremented one on handleAutoclose
    expect(wrapper.vm.timeoutRemaining).toBe(6);
  });
  it('initializes field data for an alert with fields on mount', async () => {
    document.addEventListener = jest.fn();
    window.addEventListener = jest.fn();
    const wrapper = mount(IFCAlertModal, {
      propsData: {
        alert: {
          fields: [
            {
              type: 'text',
              label: 'example',
              name: 'example',
            },
            {
              type: 'text',
              label: 'example2',
              name: 'example2',
              value: 'not empty',
            },
            {
              type: 'number',
              label: 'example3',
              name: 'example3',
              value: 1,
            },
            {
              type: 'number',
              label: 'example4',
              name: 'example4',
            },
          ],
        },
      },
    });
    await wrapper.vm.$nextTick();
    expect(wrapper.vm.fieldData).toStrictEqual({
      example: '',
      example2: 'not empty',
      example3: 1,
      example4: 0,
    });
  });
  it('removes the event listeners on document and window before destroying', async () => {
    const wrapper = mount(IFCAlertModal, {
      propsData: {
        alert: {
          autoclose: 7500,
        },
      },
    });
    document.removeEventListener = jest.fn();
    window.removeEventListener = jest.fn();
    await wrapper.destroy();
    expect(document.removeEventListener).toHaveBeenCalledWith('keydown', wrapper.vm.captureFocus);
    expect(window.removeEventListener).toHaveBeenCalledWith(EventNameRefocus, wrapper.vm.recaptureFocus);
  });
  it('recaptures focus if the event id matches the alert id', () => {
    const id = '1-asdf';
    const wrapper = mount(IFCAlertModal, {
      propsData: {
        alert: {
          id,
          autoclose: 7500,
        },
      },
    });
    wrapper.vm.focusFirstElement = jest.fn();
    wrapper.vm.recaptureFocus({ detail: { id } });
    expect(wrapper.vm.focusFirstElement).toHaveBeenCalled();
  });
  it('does not recapture focus if the event id does not match the alert id', () => {
    const id = '1-asdf';
    const wrapper = mount(IFCAlertModal, {
      propsData: {
        alert: {
          id,
          autoclose: 7500,
        },
      },
    });
    wrapper.vm.focusFirstElement = jest.fn();
    wrapper.vm.recaptureFocus({ detail: { id: `${id}asdf` } });
    expect(wrapper.vm.focusFirstElement).not.toHaveBeenCalled();
  });
  it('calls the callback on a button click and does not emit close if the response is truthy', () => {
    const wrapper = mount(IFCAlertModal, {
      propsData: {
        alert: {
          autoclose: 7500,
        },
      },
    });
    wrapper.vm.$emit = jest.fn();
    wrapper.vm.handleButtonClick(() => true);
    expect(wrapper.vm.$emit).not.toHaveBeenCalled();
  });
  it('calls the callback on a button click and emits close if the response is falsey', () => {
    const wrapper = mount(IFCAlertModal, {
      propsData: {
        alert: {
          autoclose: 7500,
        },
      },
    });
    wrapper.vm.$emit = jest.fn();
    wrapper.vm.handleButtonClick(() => false);
    expect(wrapper.vm.$emit).toHaveBeenCalledWith('close');
  });
  it('calls the callback on a button click and clears timeout if the response is falsey', () => {
    jest.useFakeTimers();
    const wrapper = mount(IFCAlertModal, {
      propsData: {
        alert: {
          autoclose: 7500,
        },
      },
    });
    wrapper.vm.$emit = jest.fn();
    wrapper.vm.handleButtonClick(() => false);
    jest.runAllTimers();
    expect(wrapper.vm.$emit).toHaveBeenCalledTimes(1);
  });
  it('ticks down timer in handleAutoClose', () => {
    const wrapper = mount(IFCAlertModal, {
      propsData: {
        alert: {

        },
      },
    });
    const timeAmount = 10;
    wrapper.vm.timeoutRemaining = timeAmount;
    wrapper.vm.handleAutoClose();
    expect(wrapper.vm.timeoutRemaining).toBe(timeAmount - 1);
    expect(wrapper.vm.timeoutId).not.toBeNull();
    wrapper.vm.handleAutoClose();
    expect(wrapper.vm.timeoutRemaining).toBe(timeAmount - 2);
  });
  it('closes when timeoutRemaining is 0', () => {
    const wrapper = mount(IFCAlertModal, {
      propsData: {
        alert: {

        },
      },
    });
    const timeAmount = 0;
    wrapper.vm.$emit = jest.fn();
    wrapper.vm.timeoutRemaining = timeAmount;
    wrapper.vm.handleAutoClose();
    expect(wrapper.vm.closed).toBe(true);
    expect(wrapper.vm.$emit).toHaveBeenCalledWith('close');
  });
  it('coerces value type based on field type', () => {
    const wrapper = mount(IFCAlertModal, {
      propsData: {
        alert: {

        },
      },
    });
    expect(wrapper.vm.convertValue('1', { type: 'text' })).toBe('1');
    expect(wrapper.vm.convertValue('1', { type: 'number' })).toBe(1);
    expect(wrapper.vm.convertValue('1.5', { type: 'number' })).toBe(1.5);
    expect(wrapper.vm.convertValue(1.5, { type: 'number' })).toBe(1.5);
  });
  it('uses $set to maintain reactivity on handleFieldChange', () => {
    const wrapper = mount(IFCAlertModal, {
      propsData: {
        alert: {

        },
      },
    });
    wrapper.vm.$set = jest.fn();
    const name = 'asdf';
    const value = 1;
    wrapper.vm.handleFieldChange(value, { name, type: 'number' });
    expect(wrapper.vm.$set).toHaveBeenCalledWith(wrapper.vm.fieldData, name, value);
  });

  it('has a sane title if the alert lacks one', async () => {
    const wrapper = mount(IFCAlertModal, {
      propsData: {
        alert: {

        },
      },
    });
    expect(wrapper.vm.title).toBe('Alert');
    const newValue = 'Asdf';
    await wrapper.setProps({ alert: { title: newValue } });
    expect(wrapper.vm.title).toBe(newValue);
  });

  it('has sane content if the alert lacks one', async () => {
    const wrapper = mount(IFCAlertModal, {
      propsData: {
        alert: {

        },
      },
    });
    expect(wrapper.vm.content).toBe('');
    const newValue = 'Asdf';
    await wrapper.setProps({ alert: { content: newValue } });
    expect(wrapper.vm.content).toBe(newValue);
  });
  it('has sane html if the alert lacks one', async () => {
    const wrapper = mount(IFCAlertModal, {
      propsData: {
        alert: {

        },
      },
    });
    expect(wrapper.vm.html).toBe(false);
    const newValue = 'Asdf';
    await wrapper.setProps({ alert: { html: newValue } });
    expect(wrapper.vm.html).toBe(newValue);
  });

  it('has a sane variant if the alert lacks one', async () => {
    const wrapper = mount(IFCAlertModal, {
      propsData: {
        alert: {

        },
      },
    });
    expect(wrapper.vm.variant).toBe('default');
    const newValue = 'Asdf';
    await wrapper.setProps({ alert: { variant: newValue } });
    expect(wrapper.vm.variant).toBe(newValue);
  });

  it('has sane fields if the alert lacks them', async () => {
    const wrapper = mount(IFCAlertModal, {
      propsData: {
        alert: {

        },
      },
    });
    expect(wrapper.vm.fields).toStrictEqual([]);
    let newValue = [
      {
        label: 'Asdf',
        name: 'fdsa',
      },
    ];
    await wrapper.setProps({ alert: { fields: newValue } });
    expect(wrapper.vm.fields).toStrictEqual([]);
    newValue = [
      {
        type: 'text',
        name: 'fdsa',
      },
    ];
    await wrapper.setProps({ alert: { fields: newValue } });
    expect(wrapper.vm.fields).toStrictEqual([]);
    newValue = [
      {
      },
    ];
    await wrapper.setProps({ alert: { fields: newValue } });
    expect(wrapper.vm.fields).toStrictEqual([]);
    newValue = [
      {
        type: 'text',
        label: 'fdsa',
      },
    ];
    await wrapper.setProps({ alert: { fields: newValue } });
    expect(wrapper.vm.fields).toStrictEqual([]);
    newValue = [
      {
        type: 'text',
        label: 'Asdf',
        name: 'fdsa',
      },
    ];
    await wrapper.setProps({ alert: { fields: newValue } });
    expect(wrapper.vm.fields).toStrictEqual(newValue);
  });

  it('has a sane buttons if the alert lacks them', async () => {
    const wrapper = mount(IFCAlertModal, {
      propsData: {
        alert: {

        },
      },
    });
    // to avoid serializes to the same object error, we use strict equal on stringified value here
    expect(JSON.stringify(wrapper.vm.buttons)).toStrictEqual(JSON.stringify([{
      variant: 'primary',
      action() {},
      content: 'Close',
    }]));
    const newValue = [{
      variant: 'secondary',
      action() {},
      content: 'Close',
    }];
    await wrapper.setProps({ alert: { buttons: newValue } });
    // to avoid serializes to the same object error, we use strict equal on stringified value here
    expect(JSON.stringify(wrapper.vm.buttons)).toStrictEqual(JSON.stringify(newValue));
  });
});

describe('IFCAlertPlugin.js', () => {
  it('installs the correct Vue prototype classes', () => {
    window.CustomEvent = undefined;
    Vue.use(IFCAlertPlugin);
    expect(Vue.prototype.$IFCAlertCancel).toBeDefined();
    expect(Vue.prototype.$IFCAlert).toBeDefined();
  });
  it('emits an appropriate event for the cancel function', () => {
    Vue.use(IFCAlertPlugin);
    const id = 'asdf';
    window.dispatchEvent = jest.fn();
    Vue.prototype.$IFCAlertCancel(id);
    const dispatchedEvent = window.dispatchEvent.mock.calls[0][0];
    expect(dispatchedEvent.type).toBe(EventNameCancel);
    expect(dispatchedEvent.detail.id).toBe(id);
  });
  it('emits an appropriate event for the alert function when the alert is fully defined', () => {
    Vue.use(IFCAlertPlugin);
    const alert = {
      id: 'Asdf',
      buttons: [{
        id: 'asdf',
        action: () => {},
      }],
    };
    window.dispatchEvent = jest.fn();
    Vue.prototype.$IFCAlert(alert);
    const dispatchedEvent = window.dispatchEvent.mock.calls[0][0];
    expect(dispatchedEvent.type).toBe(EventName);
    // we stringify to avoid serializes to same object error from having functions in the object
    expect(JSON.stringify(dispatchedEvent.detail.alert)).toStrictEqual(JSON.stringify(alert));
  });
  it('emits an appropriate event for the alert function when the alert is partially defined', () => {
    Vue.use(IFCAlertPlugin);
    let alert = {
      buttons: [],
    };
    window.dispatchEvent = jest.fn();
    Vue.prototype.$IFCAlert(alert);
    let dispatchedEvent = window.dispatchEvent.mock.calls[0][0];
    expect(dispatchedEvent.type).toBe(EventName);
    // we stringify to avoid serializes to same object error from having functions in the object
    expect(dispatchedEvent.detail.alert.id).toBeDefined();
    expect(dispatchedEvent.detail.alert.buttons).toStrictEqual([]);
    alert = {};
    Vue.prototype.$IFCAlert(alert);
    /**
     * I would destructure if destructuring nested arrays wasn't equally as ugly. This is more readable IMO.
     */
    /* eslint-disable-next-line prefer-destructuring */
    dispatchedEvent = window.dispatchEvent.mock.calls[1][0];
    expect(dispatchedEvent.type).toBe(EventName);
    // we stringify to avoid serializes to same object error from having functions in the object
    expect(dispatchedEvent.detail.alert.id).toBeDefined();
    alert = {
      buttons: [{}],
    };
    Vue.prototype.$IFCAlert(alert);
    /**
     * I would destructure if destructuring nested arrays wasn't equally as ugly. This is more readable IMO.
     */
    /* eslint-disable-next-line prefer-destructuring */
    dispatchedEvent = window.dispatchEvent.mock.calls[2][0];
    expect(dispatchedEvent.type).toBe(EventName);
    // we stringify to avoid serializes to same object error from having functions in the object
    expect(dispatchedEvent.detail.alert.id).toBeDefined();
    expect(dispatchedEvent.detail.alert.buttons[0].id).toBeDefined();
    expect(dispatchedEvent.detail.alert.buttons[0].action).toBeDefined();
  });
});

describe('IFCAlert.vue', () => {
  it('adds the appropriate plugin event listeners on mount', () => {
    window.addEventListener = jest.fn();
    const wrapper = mount(IFCAlert);
    expect(window.addEventListener).toHaveBeenNthCalledWith(1, EventName, wrapper.vm.detectPluginCall);
    expect(window.addEventListener).toHaveBeenNthCalledWith(2, EventNameCancel, wrapper.vm.detectPluginCancelCall);
  });
  it('cleans up event listeners before destroying', () => {
    window.removeEventListener = jest.fn();
    const wrapper = mount(IFCAlert);
    wrapper.destroy();
    expect(window.removeEventListener).toHaveBeenNthCalledWith(1, EventName, wrapper.vm.detectPluginCall);
    expect(window.removeEventListener).toHaveBeenNthCalledWith(2, EventNameCancel, wrapper.vm.detectPluginCancelCall);
  });
  it('removes the cancelled alert from its list of alerts when it detects a cancel plugin call', () => {
    const wrapper = mount(IFCAlert);
    wrapper.vm.alerts = [{ id: 1 }, { id: 2 }];
    wrapper.vm.detectPluginCancelCall({ detail: { id: 1 } });
    expect(wrapper.vm.alerts.length).toBe(1);
    expect(wrapper.vm.alerts[0].id).toBe(2);
  });
  it('pushes the alert in the event details on plugin call', () => {
    const wrapper = mount(IFCAlert);
    wrapper.vm.detectPluginCall({ detail: { alert: 1 } });
    expect(wrapper.vm.alerts).toStrictEqual([1]);
  });
  it('pops the last alert if backgroundDismiss is allowed', () => {
    const wrapper = mount(IFCAlert);
    wrapper.vm.alerts = [{
      backgroundDismiss: true,
    }];
    wrapper.vm.cancelLast();
    expect(wrapper.vm.alerts.length).toBe(0);
  });
  it('pops the last alert if backgroundDismiss is undefined', () => {
    const wrapper = mount(IFCAlert);
    wrapper.vm.alerts = [{
    }];
    wrapper.vm.cancelLast();
    expect(wrapper.vm.alerts.length).toBe(0);
  });
  it('shakes the top alert and issues refocus if cancelLast is called on a non-background dismissable alert', () => {
    jest.useFakeTimers();
    window.dispatchEvent = jest.fn();
    const id = 'asdf';
    const wrapper = mount(IFCAlert);
    wrapper.vm.alerts = [{}, {
      id,
      backgroundDismiss: false,
    }];
    wrapper.vm.cancelLast();
    expect(wrapper.vm.alertClasses[1]).toStrictEqual(['IFCAlertModalShake']);
    const dispatchedEvent = window.dispatchEvent.mock.calls[0][0];
    expect(dispatchedEvent.type).toBe(EventNameRefocus);
    expect(dispatchedEvent.detail.id).toBe(id);
    jest.runAllTimers();
    expect(wrapper.vm.alertClasses[1]).toStrictEqual([]);
  });
  it('closes an alert and refocuses the alert underneath if a user manually closes an alert appropriately', () => {
    window.dispatchEvent = jest.fn();
    const underId = 'fdsa';
    const id = 'asdf';
    const wrapper = mount(IFCAlert);
    const alertToCancel = {
      id,
      backgroundDismiss: false,
    };
    wrapper.vm.alerts = [{ id: underId }, alertToCancel];
    wrapper.vm.handleClose(alertToCancel);
    const dispatchedEvent = window.dispatchEvent.mock.calls[0][0];
    expect(dispatchedEvent.type).toBe(EventNameRefocus);
    expect(dispatchedEvent.detail.id).toBe(underId);
  });
});
