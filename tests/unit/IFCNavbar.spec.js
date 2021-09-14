import { mount } from '@vue/test-utils';
import { IFCNavbar } from '@Components/Navbar/IFCNavbar.vue';
import { IFCNavbarLink } from '@Components/Navbar/IFCNavbarLink.vue';

describe('IFCNavbar', () => {
  it('has a prop background of type: String, with default: \'#ffffff\'', () => {
    const { background } = IFCNavbar.props;
    expect(background.type).toBe(String);
    expect(background.default).toBe('#ffffff');
  });

  it('has a prop buttonColor of type: String, with default: \'#ffffff\'', () => {
    const { buttonColor } = IFCNavbar.props;
    expect(buttonColor.type).toBe(String);
    expect(buttonColor.default).toBe('#ffffff');
  });

  it('has a prop sticky of type: Boolean, with default: false', () => {
    const { sticky } = IFCNavbar.props;
    expect(sticky.type).toBe(Boolean);
    expect(sticky.default).toBe(false);
  });

  it('has a prop top of type: Number, with default: 0', () => {
    const { top } = IFCNavbar.props;
    expect(top.type).toBe(Number);
    expect(top.default).toBe(0);
  });

  it('has a base class that is the base SCSS class', () => {
    const wrapper = mount(IFCNavbar, {
      propsData: {
        breakpoint: 10,
        sticky: false,
      },
    });
    expect(wrapper.vm.baseClass).toBe('IFCNavbar');
  });

  it('computes classes based on props', async () => {
    const wrapper = mount(IFCNavbar, {
      propsData: {
        breakpoint: 10,
        sticky: true,
      },
    });
    expect(wrapper.vm.computedClass).toStrictEqual({
      [wrapper.vm.baseClass]: true,
      [`${wrapper.vm.baseClass}--sticky`]: true,
    });
    await wrapper.setProps({ sticky: false });
    expect(wrapper.vm.computedClass).toStrictEqual({
      [wrapper.vm.baseClass]: true,
      [`${wrapper.vm.baseClass}--sticky`]: false,
    });
  });

  it('sets display to none for the navbar content when breakpoint is triggered', async () => {
    const wrapper = mount(IFCNavbar, {
      propsData: {
        breakpoint: 10,
        sticky: true,
      },
    });
    expect(wrapper.vm.hiddenAtBreakpoint).toStrictEqual({

    });
    wrapper.vm.breakpointTriggered = true;
    await wrapper.vm.$nextTick();
    expect(wrapper.vm.hiddenAtBreakpoint).toStrictEqual({
      display: 'none',
    });
  });

  it('sets the content of the button container to visible when the breakpoint is triggered', async () => {
    const wrapper = mount(IFCNavbar, {
      propsData: {
        breakpoint: 10,
        sticky: true,
      },
    });
    expect(wrapper.vm.buttonVisibleAtBreakpoint).toStrictEqual({});
    wrapper.vm.breakpointTriggered = true;
    await wrapper.vm.$nextTick();
    expect(wrapper.vm.buttonVisibleAtBreakpoint).toStrictEqual({
      display: 'flex',
      'justify-content': 'flex-end',
      flex: 1,
    });
  });

  it('uses the style to create css vars to pass props into SCSS', () => {
    const wrapper = mount(IFCNavbar, {
      propsData: {
        sticky: true,
        background: 'red',
        top: 20,
        buttonColor: 'red',
        breakpoint: 20,
      },
    });
    expect(wrapper.vm.computedStyle).toStrictEqual({
      '--IFC-navbar-color': wrapper.vm.background,
      '--IFC-navbar-top': `${wrapper.vm.top}px`,
      '--IFC-navbar-button-color': wrapper.vm.buttonColor,
      '--IFC-navbar-breakpoint': `${wrapper.vm.breakpoint}px`,
    });
  });
});

describe('IFCNavbarLink', () => {
  it('has a String prop called color with default white', () => {
    const { color } = IFCNavbarLink.props;
    expect(color.type).toBe(String);
    expect(color.default).toBe('white');
  });
  it('computes an appropriate style based on the props', () => {
    const wrapper = mount(IFCNavbarLink, {
      propsData: {
        breakpoint: 10,
        color: 'red',
      },
    });
    expect(wrapper.vm.computedStyle).toStrictEqual({
      color: `${wrapper.vm.color} !important`,
    });
  });
  it('binds the style attribute', async () => {
    const wrapper = mount(IFCNavbarLink, {
      propsData: {
        breakpoint: 10,
        color: 'red',
      },
    });
    await wrapper.vm.$nextTick();
    expect(wrapper.find('.IFCNavbarLink__link').element.getAttribute('style')).toBe('color: red;');
  });
  it('passes content to the slot', async () => {
    const wrapper = mount(IFCNavbarLink, {
      propsData: {
        breakpoint: 10,
        color: 'red',
      },
      slots: {
        default: '<div class="fake-msg">Test</div>',
      },
    });
    await wrapper.vm.$nextTick();
    expect(wrapper.find('div.fake-msg').element).toBeDefined();
  });
});
