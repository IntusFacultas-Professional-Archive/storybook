import { IFCSidebar } from '@Components/Sidebar/IFCSidebar.vue';
import { mount } from '@vue/test-utils';

describe('IFCSidebar', () => {
  it('has a required number width prop for setting the sidebar width', () => {
    const { width } = IFCSidebar.props;
    expect(width.type).toBe(Number);
    expect(width.required).toBe(true);
  });
  it('has a default #ffffff string buttonColor prop for setting the color of the svg in the button toggler', () => {
    const { buttonColor } = IFCSidebar.props;
    expect(buttonColor.type).toBe(String);
    expect(buttonColor.default).toBe('#ffffff');
  });
  it('has a default #f1f1f1 string background prop for setting the background of the sidebar', () => {
    const { background } = IFCSidebar.props;
    expect(background.type).toBe(String);
    expect(background.default).toBe('#f1f1f1');
  });
  it(`has a required number breakpoint prop provided by the BreakpointToggledMixin for setting the media queries 
      where the sidebar transitions to toggleable`,
  () => {
    const { breakpoint } = IFCSidebar.mixins[0].props;
    expect(breakpoint.type).toBe(Number);
    expect(breakpoint.required).toBe(true);
  });
  it(`has a default false boolean breakpoint prop provided by the BreakpointToggledMixin for forcing the sidebar
    to always be collapsed`,
  () => {
    const { collapseOverride } = IFCSidebar.mixins[0].props;
    expect(collapseOverride.type).toBe(Boolean);
    expect(collapseOverride.default).toBe(false);
  });
  it('sets a window resize handler on mount', async () => {
    window.addEventListener = jest.fn();
    const wrapper = mount(IFCSidebar, {
      propsData: {
        width: 100,
        breakpoint: 2000000000000,
      },
    });
    await wrapper.vm.$nextTick();
    expect(window.addEventListener).toHaveBeenCalledWith('resize', wrapper.vm.handleWindowResize, { passive: true });
  });
  it('cleans up the window resize handler before destroy', async () => {
    const wrapper = mount(IFCSidebar, {
      propsData: {
        width: 100,
        breakpoint: 2000000000000,
      },
    });
    window.removeEventListener = jest.fn();
    await wrapper.vm.$nextTick();
    wrapper.destroy();
    await wrapper.vm.$nextTick();
    expect(window.removeEventListener).toHaveBeenCalledWith('resize', wrapper.vm.handleWindowResize);
  });
  it('does not change toggle when collapseOverride is set to true', async () => {
    const wrapper = mount(IFCSidebar, {
      propsData: {
        width: 100,
        breakpoint: -100,
        collapseOverride: true,
      },
    });
    wrapper.vm.toggled = true;
    await wrapper.vm.$nextTick();
    wrapper.vm.handleWindowResize();
    await wrapper.vm.$nextTick();
    expect(wrapper.vm.toggled).toBe(true);
  });
  it('calls handleToggle when the sidebar toggle button is clicked', async () => {
    const wrapper = mount(IFCSidebar, {
      propsData: {
        width: 100,
        breakpoint: 2000000000000,
      },
    });
    await wrapper.vm.$nextTick();
    const button = wrapper.find('button');
    wrapper.vm.handleToggle = jest.fn();
    button.trigger('click');
    expect(wrapper.vm.handleToggle).toHaveBeenCalled();
  });
  it('calls handleToggle when the sidebar backdrop is clicked', async () => {
    const wrapper = mount(IFCSidebar, {
      propsData: {
        width: 100,
        breakpoint: 2000000000000,
      },
    });
    wrapper.vm.toggled = true;
    await wrapper.vm.$nextTick();
    const backdrop = wrapper.find('div[data-background=true]');
    wrapper.vm.handleToggle = jest.fn();
    backdrop.trigger('click');
    expect(wrapper.vm.handleToggle).toHaveBeenCalled();
  });
  it('passes content to the sidebar slot', async () => {
    const wrapper = mount(IFCSidebar, {
      slots: {
        sidebar: '<h1 id="testSidebar">Test!</h1>',
      },
      propsData: {
        width: 100,
        breakpoint: 2000000000000,
      },
    });
    const content = wrapper.find('h1#testSidebar');
    expect(content.element).toBeDefined();
  });
  it('passes content to the default slot', async () => {
    const wrapper = mount(IFCSidebar, {
      slots: {
        sidebar: '<h1 id="testSidebar">Test!</h1>',
        default: '<h2 id="content">Test Content!</h2>',
      },
      propsData: {
        width: 100,
        breakpoint: 2000000000000,
      },
    });
    const content = wrapper.find('h2#content');
    expect(content.element).toBeDefined();
  });
  it('flips toggle boolean value when handleToggle is called', async () => {
    const wrapper = mount(IFCSidebar, {
      propsData: {
        width: 100,
        breakpoint: 2000000000000,
      },
    });
    wrapper.vm.captureFocus = jest.fn();
    expect(wrapper.vm.toggled).toBe(false);
    wrapper.vm.handleToggle();
    await wrapper.vm.$nextTick();
    expect(wrapper.vm.toggled).toBe(true);
  });
  it('focuses first element when handleToggle is called', async () => {
    const wrapper = mount(IFCSidebar, {
      propsData: {
        width: 100,
        breakpoint: 2000000000000,
      },
    });
    wrapper.vm.focusFirstElement = jest.fn();
    wrapper.vm.handleToggle();
    await wrapper.vm.handleToggle();
    await wrapper.vm.$nextTick();
    expect(wrapper.vm.focusFirstElement).toHaveBeenCalled();
  });
  it('sanely handles capture focus when the sidebar contains no focusable elements', async () => {
    const wrapper = mount(IFCSidebar, {
      propsData: {
        width: 100,
        breakpoint: 2000000000000,
      },
    });
    wrapper.vm.$refs[wrapper.vm.focusCaptureRef] = {
      querySelectorAll: () => [],
    };
    await wrapper.vm.$nextTick();
    const toggler = wrapper.find('button');
    toggler.element.focus();
    toggler.element.focus = jest.fn();
    const tabEvent = {
      keyCode: 9,
      preventDefault: jest.fn(),
    };
    wrapper.vm.captureFocus(tabEvent);
    expect(tabEvent.preventDefault).toHaveBeenCalled();
    expect(toggler.element.focus).toHaveBeenCalled();
  });
  it('removes the event listener when the user expands the window past the breakpoint', async () => {
    document.removeEventListener = jest.fn();
    const wrapper = mount(IFCSidebar, {
      propsData: {
        width: 100,
        breakpoint: 2000000000000,
      },
    });
    await wrapper.setData({ breakpointTriggered: true });
    await wrapper.setData({ breakpointTriggered: false });
    expect(document.removeEventListener).toHaveBeenCalledWith('keydown', wrapper.vm.captureFocus);
  });
  it('sanely handles capture focus for shift tab when the sidebar contains no focusable elements', async () => {
    const wrapper = mount(IFCSidebar, {
      attachTo: document.body,
      propsData: {
        width: 100,
        breakpoint: 2000000000000,
      },
    });
    wrapper.vm.$refs[wrapper.vm.focusCaptureRef] = {
      querySelectorAll: () => [],
    };
    await wrapper.vm.$nextTick();
    const toggler = wrapper.find('button');
    toggler.element.focus();
    toggler.element.focus = jest.fn();
    const tabEvent = {
      keyCode: 9,
      shiftKey: true,
      preventDefault: jest.fn(),
    };
    wrapper.vm.captureFocus(tabEvent);
    expect(toggler.element.focus).toHaveBeenCalled();
    expect(tabEvent.preventDefault).toHaveBeenCalled();
  });
  it('sanely handles capture focus for shift tab when the sidebar contains focusable elements', async () => {
    const wrapper = mount(IFCSidebar, {
      attachTo: document.body,
      propsData: {
        width: 100,
        breakpoint: 2000000000000,
      },
      slots: {
        sidebar: '<button id="inSidebar">Test</button>',
      },
    });
    await wrapper.vm.$nextTick();
    const inSidebar = wrapper.find('button#inSidebar');
    inSidebar.element.focus();
    wrapper.vm.$refs[wrapper.vm.focusCaptureRef] = {
      querySelectorAll: () => [inSidebar.element],
    };
    const toggler = wrapper.find('button.IFCSidebar__button');
    toggler.element.focus = jest.fn();
    const tabEvent = {
      keyCode: 9,
      shiftKey: true,
      preventDefault: jest.fn(),
    };
    wrapper.vm.captureFocus(tabEvent);
    expect(toggler.element.focus).toHaveBeenCalled();
    expect(tabEvent.preventDefault).toHaveBeenCalled();
  });
});
