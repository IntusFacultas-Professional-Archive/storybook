import { IFCSpan } from '@Components/Text/IFCSpan.vue';
import { mount } from '@vue/test-utils';

describe('IFCSpan', () => {
  it('passes content through the slot', async () => {
    const wrapper = mount(IFCSpan, {
      slots: {
        default: '<h1 id="test">Test</h1>',
      },
    });
    const el = wrapper.find('h1#test').element;
    expect(el).toBeDefined();
  });
  it('has prop bold of type: Boolean with default: false', () => {
    const { bold } = IFCSpan.props;
    expect(bold.type).toBe(Boolean);
    expect(bold.default).toBe(false);
  });
  it('has prop size of type: Number with default: null', () => {
    const { size } = IFCSpan.props;
    expect(size.type).toBe(Number);
    expect(size.default).toBe(null);
  });
  it('has prop color of type: String with default: null', () => {
    const { color } = IFCSpan.props;
    expect(color.type).toBe(String);
    expect(color.default).toBe(null);
  });

  it('has baseClass that matches the base SCSS class', async () => {
    const wrapper = mount(IFCSpan, {
      slots: {
        default: '<h1 id="test">Test</h1>',
      },
    });
    expect(wrapper.vm.baseClass).toBe('IFCSpan');
  });
  it('computes and binds computedClass based on props', async () => {
    const wrapper = mount(IFCSpan, {
      slots: {
        default: '<h1 id="test">Test</h1>',
      },
    });
    expect(wrapper.vm.computedClass).toStrictEqual({
      [wrapper.vm.baseClass]: true,
      [`${wrapper.vm.baseClass}--bold`]: false,
    });
    await wrapper.setProps({ bold: true });
    expect(wrapper.vm.computedClass).toStrictEqual({
      [wrapper.vm.baseClass]: true,
      [`${wrapper.vm.baseClass}--bold`]: true,
    });
  });
  it('computes and binds computedStyle based on props', async () => {
    const wrapper = mount(IFCSpan, {
      slots: {
        default: '<h1 id="test">Test</h1>',
      },
    });
    expect(wrapper.vm.computedStyle).toStrictEqual({});
    await wrapper.setProps({ color: 'red' });
    expect(wrapper.vm.computedStyle).toStrictEqual({
      color: 'red',
    });
    await wrapper.setProps({ size: 20 });
    expect(wrapper.vm.computedStyle).toStrictEqual({
      color: 'red',
      'font-size': '20px',
    });
    expect(wrapper.vm.$el.getAttribute('style')).toBe(
      `${Object.entries(wrapper.vm.computedStyle).map(([prop, val]) => `${prop}: ${val}`).join('; ')};`,
    );
  });
});
