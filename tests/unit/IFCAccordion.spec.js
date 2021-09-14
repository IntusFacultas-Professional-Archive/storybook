import { IFCAccordion } from '@Components/Accordion/IFCAccordion.vue';
import { mount } from '@vue/test-utils';

describe('IFCAccordion', () => {
  it('has an underlined prop for setting an underline on the title', () => {
    const { underlined } = IFCAccordion.props;
    expect(underlined.type).toBe(Boolean);
    expect(underlined.default).toBe(false);
  });
  it('has an openState prop for toggling the accordion open or closed', () => {
    const { openState } = IFCAccordion.props;
    expect(openState.type).toBe(Boolean);
    expect(openState.default).toBe(true);
  });
  it('passes html content to the title slot', () => {
    const wrapper = mount(IFCAccordion, {
      propsData: {
        openState: false,
      },
      slots: {
        title: '<h1 id="testTitle">Some Title</h1>',
        default: '<h2 id="testContent">Some Content</h2>',
      },
    });
    const title = wrapper.find('h1#testTitle');
    expect(title.element).toBeDefined();
  });
  it('passes html content to the default slot', () => {
    const wrapper = mount(IFCAccordion, {
      propsData: {
        openState: false,
      },
      slots: {
        title: '<h1 id="testTitle">Some Title</h1>',
        default: '<h2 id="testContent">Some Content</h2>',
      },
    });
    const title = wrapper.find('h2#testContent');
    expect(title.element).toBeDefined();
  });
  it('defaults to closed if openState is false', () => {
    const wrapper = mount(IFCAccordion, {
      propsData: {
        openState: false,
      },
      slots: {
        title: '<h1 id="testTitle">Some Title</h1>',
        default: '<h2 id="testContent">Some Content</h2>',
      },
    });
    expect(wrapper.vm.defaultClosed).toBe(true);
    expect(wrapper.vm.open).toBe(false);
  });
  it('calls expandSection when openState changes to open', async () => {
    const wrapper = mount(IFCAccordion, {
      propsData: {
        openState: false,
      },
      slots: {
        title: '<h1 id="testTitle">Some Title</h1>',
        default: '<h2 id="testContent">Some Content</h2>',
      },
    });
    wrapper.vm.expandSection = jest.fn();
    wrapper.setProps({ openState: true });
    await wrapper.vm.$nextTick();
    expect(wrapper.vm.expandSection).toHaveBeenCalled();
  });
  it('calls collapseSection when openState changes to false from open', async () => {
    const wrapper = mount(IFCAccordion, {
      propsData: {
        openState: true,
      },
      slots: {
        title: '<h1 id="testTitle">Some Title</h1>',
        default: '<h2 id="testContent">Some Content</h2>',
      },
    });
    await wrapper.vm.$nextTick();
    wrapper.vm.collapseSection = jest.fn();
    wrapper.setProps({ openState: false });
    await wrapper.vm.$nextTick();
    expect(wrapper.vm.collapseSection).toHaveBeenCalled();
  });
  it('sets open to true when expandSection is called', async () => {
    const wrapper = mount(IFCAccordion, {
      propsData: {
        openState: false,
      },
      slots: {
        title: '<h1 id="testTitle">Some Title</h1>',
        default: '<h2 id="testContent">Some Content</h2>',
      },
    });
    wrapper.setProps({ openState: true });
    await wrapper.vm.$nextTick();
    expect(wrapper.vm.open).toBe(true);
  });
  it('sets open to false when collapseSection is called', async () => {
    const wrapper = mount(IFCAccordion, {
      propsData: {
        openState: true,
      },
      slots: {
        title: '<h1 id="testTitle">Some Title</h1>',
        default: '<h2 id="testContent">Some Content</h2>',
      },
    });
    await wrapper.vm.$nextTick();
    wrapper.setProps({ openState: false });
    await wrapper.vm.$nextTick();
    expect(wrapper.vm.open).toBe(false);
  });
  it('$emits toggle event with payload true when expandSection is called', async () => {
    const wrapper = mount(IFCAccordion, {
      propsData: {
        openState: false,
      },
      slots: {
        title: '<h1 id="testTitle">Some Title</h1>',
        default: '<h2 id="testContent">Some Content</h2>',
      },
    });
    wrapper.vm.$emit = jest.fn();
    wrapper.vm.expandSection();
    expect(wrapper.vm.$emit).toBeCalledWith('toggle', true);
  });
  it('$emits toggle event with payload false when collapseSection is called', async () => {
    const wrapper = mount(IFCAccordion, {
      propsData: {
        openState: false,
      },
      slots: {
        title: '<h1 id="testTitle">Some Title</h1>',
        default: '<h2 id="testContent">Some Content</h2>',
      },
    });
    wrapper.vm.$emit = jest.fn();
    wrapper.vm.collapseSection();
    expect(wrapper.vm.$emit).toBeCalledWith('toggle', false);
  });
  it('computes the appropriate styling to close the content when defaultClosed is true', async () => {
    const wrapper = mount(IFCAccordion, {
      propsData: {
        openState: false,
      },
      slots: {
        title: '<h1 id="testTitle">Some Title</h1>',
        default: '<h2 id="testContent">Some Content</h2>',
      },
    });
    await wrapper.vm.$nextTick();
    expect(wrapper.vm.computedCollapseStyle).toStrictEqual({
      height: '0px',
      overflow: 'hidden',
    });
  });
  it('computes a sane styling to allow content to be seen when defaultClosed is false', async () => {
    const wrapper = mount(IFCAccordion, {
      propsData: {
        openState: true,
      },
      slots: {
        title: '<h1 id="testTitle">Some Title</h1>',
        default: '<h2 id="testContent">Some Content</h2>',
      },
    });
    await wrapper.vm.$nextTick();
    expect(wrapper.vm.computedCollapseStyle).toStrictEqual({});
  });
  it('attaches an event listener to the element for transitionend on expandSection', async () => {
    const wrapper = mount(IFCAccordion, {
      propsData: {
        openState: false,
      },
    });
    await wrapper.vm.$nextTick();
    wrapper.vm.$refs.content.addEventListener = jest.fn();
    wrapper.vm.expandSection();
    await wrapper.vm.$nextTick();
    expect(wrapper.vm.$refs.content.addEventListener).toHaveBeenCalledWith('transitionend', expect.anything());
  });
  it('removes the transitionend event listener attached to the element after transitionend', async () => {
    const wrapper = mount(IFCAccordion, {
      propsData: {
        openState: false,
      },
    });
    await wrapper.vm.$nextTick();
    wrapper.vm.$refs.content.removeEventListener = jest.fn();
    wrapper.vm.expandSection();
    await wrapper.vm.$nextTick();
    const event = document.createEvent('HTMLEvents');
    event.initEvent('transitionend', true, true);
    wrapper.vm.$refs.content.dispatchEvent(event);
    expect(wrapper.vm.$refs.content.removeEventListener).toHaveBeenCalledWith('transitionend', expect.anything());
  });
  it('appropriately resets styling on close after an animationFrame occurs', async () => {
    const callbackCalled = jest.fn();
    jest.spyOn(window, 'requestAnimationFrame').mockImplementation((cb) => { cb(); callbackCalled(); });
    const wrapper = mount(IFCAccordion, {
      propsData: {
        openState: false,
      },
    });
    wrapper.vm.collapseSection();
    expect(callbackCalled).toHaveBeenCalledTimes(2);
    window.requestAnimationFrame.mockRestore();
  });
});
