import IFCModal from '@Components/Modal/IFCModal.vue';
import { IFCModalPlugin } from '@Components/Modal/IFCModalPlugin.js';
import { generateId } from '@Components/Modal/utils';
import Vue from 'vue';
import { mount } from '@vue/test-utils';

describe('IFCModal', () => {
  it('adds an event listener for plugin use on mounted', () => {
    const id = 'test';
    window.addEventListener = jest.fn();
    const wrapper = mount(IFCModal, {
      propsData: {
        id,
        modalDescription: 'Description',
      },
    });
    expect(window.addEventListener).toHaveBeenCalledWith(generateId(id), wrapper.vm.detectPluginCall);
  });
  it('computes a modal description id based on the internal id of the component', () => {
    const id = 'test';
    window.addEventListener = jest.fn();
    const wrapper = mount(IFCModal, {
      propsData: {
        id,
        modalDescription: 'Description',
      },
    });
    /**
     * _uid is an internal variable we do not control
     */
    /* eslint-disable-next-line no-underscore-dangle */
    expect(wrapper.vm.modalDescriptionId).toBe(`modal-description-${wrapper.vm._uid}`);
  });
  it('calls focusFirstElement on updateVisibleBasedOnProp if show is true', async () => {
    const id = 'test';
    window.addEventListener = jest.fn();
    const wrapper = mount(IFCModal, {
      propsData: {
        id,
        modalDescription: 'Description',
      },
    });
    wrapper.setProps({ show: true });
    wrapper.vm.focusFirstElement = jest.fn();
    document.addEventListener = jest.fn();
    wrapper.vm.updateVisibleBasedOnProp();
    await wrapper.vm.$nextTick();
    expect(wrapper.vm.focusFirstElement).toHaveBeenCalled();
    expect(document.addEventListener).toHaveBeenCalledWith('keydown', wrapper.vm.captureFocus);
  });
  it('does not call focusFirstElement on updateVisibleBasedOnProp if show is false', async () => {
    const id = 'test';
    window.addEventListener = jest.fn();
    const wrapper = mount(IFCModal, {
      propsData: {
        id,
        modalDescription: 'Description',
      },
    });
    wrapper.setProps({ show: false });
    wrapper.vm.focusFirstElement = jest.fn();
    wrapper.vm.updateVisibleBasedOnProp();
    await wrapper.vm.$nextTick();
    expect(wrapper.vm.focusFirstElement).not.toHaveBeenCalled();
  });
  it('calls handleClose on backdrop click if allowBackgroundDismiss is true', () => {
    const id = 'test';
    const wrapper = mount(IFCModal, {
      propsData: {
        id,
        allowBackgroundDismiss: true,
        modalDescription: 'Description',
      },
    });
    wrapper.vm.handleClose = jest.fn();
    wrapper.vm.handleBackdropClick();
    expect(wrapper.vm.handleClose).toHaveBeenCalled();
  });
  it('does not call handleClose on backdrop click if allowBackgroundDismiss is false', () => {
    const id = 'test';
    const wrapper = mount(IFCModal, {
      propsData: {
        id,
        allowBackgroundDismiss: false,
        modalDescription: 'Description',
      },
    });
    wrapper.vm.handleClose = jest.fn();
    wrapper.vm.handleBackdropClick();
    expect(wrapper.vm.handleClose).not.toHaveBeenCalled();
  });
  it('emits toggle if show is not null on handleClose', () => {
    const id = 'test';
    const wrapper = mount(IFCModal, {
      propsData: {
        id,
        allowBackgroundDismiss: false,
        show: true,
        modalDescription: 'Description',
      },
    });
    wrapper.vm.$emit = jest.fn();
    wrapper.vm.handleClose();
    expect(wrapper.vm.$emit).toHaveBeenCalledWith('toggle');
  });
  it('flips visible and removes the eventlistener on handleClose if show is not null', () => {
    const id = 'test';
    const wrapper = mount(IFCModal, {
      propsData: {
        id,
        allowBackgroundDismiss: false,
        modalDescription: 'Description',
      },
    });
    wrapper.vm.visible = true;
    document.removeEventListener = jest.fn();
    wrapper.vm.handleClose();
    expect(wrapper.vm.visible).toBe(false);
    expect(document.removeEventListener).toHaveBeenCalledWith('keydown', wrapper.vm.captureFocus);
  });
  it('sets visible based on event for plugin calls', () => {
    const id = 'test';
    const wrapper = mount(IFCModal, {
      propsData: {
        id,
        allowBackgroundDismiss: false,
        modalDescription: 'Description',
      },
    });
    wrapper.vm.visible = true;
    const event = new CustomEvent('test', {
      detail: { modal: false },
    });
    wrapper.vm.detectPluginCall(event);
    expect(wrapper.vm.visible).toBe(false);
  });
  it('focuses the first focusable element and adds and event listener when a plugin call sets visible to true',
    async () => {
      const id = 'test';
      const wrapper = mount(IFCModal, {
        propsData: {
          id,
          allowBackgroundDismiss: false,
          modalDescription: 'Description',
        },
      });
      wrapper.vm.visible = false;
      const event = new CustomEvent('test', {
        detail: { modal: true },
      });
      wrapper.vm.focusFirstElement = jest.fn();
      document.addEventListener = jest.fn();
      wrapper.vm.detectPluginCall(event);
      await wrapper.vm.$nextTick();
      expect(wrapper.vm.focusFirstElement).toHaveBeenCalled();
      expect(document.addEventListener).toHaveBeenCalledWith('keydown', wrapper.vm.captureFocus);
    });
  it('removes the event listener for plugin calls when destroyed', () => {
    window.removeEventListener = jest.fn();
    const id = 'test';
    const wrapper = mount(IFCModal, {
      propsData: {
        id,
        allowBackgroundDismiss: false,
        modalDescription: 'Description',
      },
    });
    wrapper.destroy();
    expect(window.removeEventListener).toHaveBeenCalledWith(
      generateId(wrapper.vm.id),
      wrapper.vm.detectPluginCall,
    );
  });
  it('calls updateVisibleBasedOnProp on change of show', async () => {
    const id = 'test';
    const wrapper = mount(IFCModal, {
      propsData: {
        id,
        allowBackgroundDismiss: false,
        modalDescription: 'Description',
      },
    });
    wrapper.vm.updateVisibleBasedOnProp = jest.fn();
    wrapper.setProps({ show: true });
    await wrapper.vm.$nextTick();
    expect(wrapper.vm.updateVisibleBasedOnProp).toHaveBeenCalled();
  });
});

describe('IFCModalPlugin', () => {
  it('adds the appropriate prototype Vue method', () => {
    window.CustomEvent = undefined;
    Vue.use(IFCModalPlugin);
    expect(Vue.prototype.$IFCModal).toBeDefined();
    Vue.prototype.$IFCModal();
    expect(window.CustomEvent).toBeDefined();
  });
  it('dispatches the correct event with the vue prototype function', () => {
    Vue.use(IFCModalPlugin);
    window.dispatchEvent = jest.fn();
    const id = 'asdf';
    const showOrHide = true;
    Vue.prototype.$IFCModal(id, showOrHide);
    expect(window.dispatchEvent).toHaveBeenCalled();
    const calledEvent = window.dispatchEvent.mock.calls[0][0];
    expect(calledEvent.type).toBe(generateId(id));
    expect(calledEvent.detail.modal).toBe(showOrHide);
  });
});
