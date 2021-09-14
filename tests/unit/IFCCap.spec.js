import IFCCap from '@Components/Cap/IFCCap.vue';
import { mount } from '@vue/test-utils';

describe('IFCCap.vue', () => {
  it('renders content passed to the slot', () => {
    const wrapper = mount(IFCCap, {
      propsData: {
      },
      slots: {
        default: '<div class="fake-msg">Text</div>',
      },
    });
    expect(wrapper.find('.fake-msg').element).toBeDefined();
  });
  it('renders content passed to the slot when a front cap', () => {
    const wrapper = mount(IFCCap, {
      propsData: {
        front: true,
      },
      slots: {
        default: '<div class="fake-msg">Text</div>',
      },
    });
    expect(wrapper.find('.fake-msg').element).toBeDefined();
  });
  it('has a default false Boolean front prop for specifying the cap is a front endcap', () => {
    const { front } = IFCCap.props;
    expect(front.type).toBe(Boolean);
    expect(front.default).toBe(false);
  });
  it('has a default false Boolean end prop for specifying the cap is an end endcap', () => {
    const { end } = IFCCap.props;
    expect(end.type).toBe(Boolean);
    expect(end.default).toBe(false);
  });
  it('calls forceUpdate on inputParent.state change', () => {
    const wrapper = mount(IFCCap, {
      propsData: {
      },
      slots: {
        default: '<div class="fake-msg">Text</div>',
      },
    });
    wrapper.vm.$forceUpdate = jest.fn();
    wrapper.vm.$options.watch['inputParent.state'].handler.call(wrapper.vm);
    expect(wrapper.vm.$forceUpdate).toHaveBeenCalled();
  });
  it('calls forceUpdate on inputParent.state change', () => {
    const wrapper = mount(IFCCap, {
      propsData: {
      },
      slots: {
        default: '<div class="fake-msg">Text</div>',
      },
    });
    wrapper.vm.$forceUpdate = jest.fn();
    wrapper.vm.$options.watch['inputParent.state'].handler.call(wrapper.vm);
    expect(wrapper.vm.$forceUpdate).toHaveBeenCalled();
  });
  it('calls forceUpdate on inputParent.disabled change', () => {
    const wrapper = mount(IFCCap, {
      propsData: {
      },
      slots: {
        default: '<div class="fake-msg">Text</div>',
      },
    });
    wrapper.vm.$forceUpdate = jest.fn();
    wrapper.vm.$options.watch['inputParent.disabled'].handler.call(wrapper.vm);
    expect(wrapper.vm.$forceUpdate).toHaveBeenCalled();
  });
  it('calls forceUpdate on inputParent.focus change', () => {
    const wrapper = mount(IFCCap, {
      propsData: {
      },
      slots: {
        default: '<div class="fake-msg">Text</div>',
      },
    });
    wrapper.vm.$forceUpdate = jest.fn();
    wrapper.vm.$options.watch['inputParent.focus'].handler.call(wrapper.vm);
    expect(wrapper.vm.$forceUpdate).toHaveBeenCalled();
  });
});
