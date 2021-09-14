import { IFCPageSelector } from '@Components/Pagination/IFCPageSelector/IFCPageSelector.vue';
import { mount } from '@vue/test-utils';

describe('IFCPageSelector', () => {
  // it('emits an event when the user selects a different value', async () => {
  //   const wrapper = mount(IFCPageSelector, {
  //     propsData: {
  //       value: 25,
  //       pageSizes: [
  //         25, 50, 100,
  //       ],
  //     },
  //   });
  //   wrapper.vm.$emit = jest.fn();
  //   const root = wrapper.find('div');
  //   root.find('select').findAll('option').at(1).setSelected();
  //   expect(wrapper.vm.$emit).toHaveBeenCalledWith('change', 50);
  // });

  it('calls checkPositionOnScreen and openClickOffDependantContainer on openDropdown', () => {
    const wrapper = mount(IFCPageSelector, {
      propsData: {
        value: 25,
        pages: [
          25, 50, 100,
        ],
      },
    });
    wrapper.vm.checkPositionOnScreen = jest.fn();
    wrapper.vm.openClickOffDependantContainer = jest.fn();
    wrapper.vm.openDropdown();
    expect(wrapper.vm.checkPositionOnScreen).toHaveBeenCalled();
    expect(wrapper.vm.openClickOffDependantContainer).toHaveBeenCalled();
  });
  it('prevents default and focuses left on shift tab when calling skipDropdown', async () => {
    const event = {
      shiftKey: true,
      preventDefault: jest.fn(),
    };
    const wrapper = mount(IFCPageSelector, {
      propsData: {
        value: 25,
        pages: [
          25, 50, 100,
        ],
      },
    });
    await wrapper.vm.$nextTick();
    wrapper.vm.$refs.left.$el.focus = jest.fn();
    wrapper.vm.skipDropdown(event);
    expect(event.preventDefault).toHaveBeenCalled();
    expect(wrapper.vm.$refs.left.$el.focus).toHaveBeenCalled();
  });
  it('prevents default and focuses right on tab when calling skipDropdown', async () => {
    const event = {
      preventDefault: jest.fn(),
    };
    const wrapper = mount(IFCPageSelector, {
      propsData: {
        value: 25,
        pages: [
          25, 50, 100,
        ],
      },
    });
    await wrapper.vm.$nextTick();
    wrapper.vm.$refs.right.$el.focus = jest.fn();
    wrapper.vm.skipDropdown(event);
    expect(event.preventDefault).toHaveBeenCalled();
    expect(wrapper.vm.$refs.right.$el.focus).toHaveBeenCalled();
  });
  it('focuses the appropriate element in the list on focus based on index', async () => {
    const wrapper = mount(IFCPageSelector, {
      propsData: {
        value: 25,
        pages: [
          25, 50, 100,
        ],
      },
    });
    await wrapper.vm.$nextTick();
    wrapper.vm.$refs['dropdown-0'][0].$el.focus = jest.fn();
    wrapper.vm.focus(0);
    expect(wrapper.vm.$refs['dropdown-0'][0].$el.focus).toHaveBeenCalled();
  });
  it('validates the prop pages to avoid strings when prop is an array', () => {
    const wrapper = mount(IFCPageSelector, {
      propsData: {
        value: 25,
        pages: [
          25, 50, 100,
        ],
      },
    });
    const { validator } = wrapper.vm.$options.props.pages;
    expect(validator([
      25, 50, 100,
    ])).toBe(true);
    expect(validator([
      25, 50, 'asdf',
    ])).toBe(false);
  });
  it('handles input correctly', async () => {
    const wrapper = mount(IFCPageSelector, {
      propsData: {
        value: 1,
        pages: 20,
      },
    });
    wrapper.vm.$emit = jest.fn();
    wrapper.vm.handleInput({ target: { value: 50 } });
    expect(wrapper.vm.$emit).toHaveBeenNthCalledWith(1, 'change', 20);
    wrapper.vm.handleInput({ target: { value: -1 } });
    expect(wrapper.vm.$emit).toHaveBeenNthCalledWith(3, 'change', 1);
    await wrapper.setProps({
      pages: [
        25, 50, 100,
      ],
    });
    wrapper.vm.handleInput({ target: { value: 50 } });
    expect(wrapper.vm.$emit).toHaveBeenNthCalledWith(5, 'change', 50);
    wrapper.vm.handleInput({ target: { value: 55 } });
    expect(wrapper.vm.$emit).toHaveBeenNthCalledWith(7, 'change', 50);
  });
  it('handles left click correctly', async () => {
    const wrapper = mount(IFCPageSelector, {
      propsData: {
        value: 25,
        pages: [
          25, 50, 100,
        ],
      },
    });
    wrapper.vm.$emit = jest.fn();
    wrapper.vm.handleLeftClick();
    expect(wrapper.vm.$emit).toHaveBeenNthCalledWith(1, 'change', 25);
    await wrapper.setProps({ value: 50 });
    wrapper.vm.handleLeftClick();
    expect(wrapper.vm.$emit).toHaveBeenNthCalledWith(3, 'change', 25);
    await wrapper.setProps({ pages: 5, value: 2 });
    wrapper.vm.handleLeftClick();
    expect(wrapper.vm.$emit).toHaveBeenNthCalledWith(5, 'change', 1);
    wrapper.vm.handleLeftClick();
    expect(wrapper.vm.$emit).toHaveBeenNthCalledWith(7, 'change', 1);
  });
  it('handles right click correctly', async () => {
    const wrapper = mount(IFCPageSelector, {
      propsData: {
        value: 100,
        pages: [
          25, 50, 100,
        ],
      },
    });
    wrapper.vm.$emit = jest.fn();
    wrapper.vm.handleRightClick();
    expect(wrapper.vm.$emit).toHaveBeenNthCalledWith(1, 'change', 100);
    await wrapper.setProps({ value: 50 });
    wrapper.vm.handleRightClick();
    expect(wrapper.vm.$emit).toHaveBeenNthCalledWith(3, 'change', 100);
    await wrapper.setProps({ pages: 5, value: 4 });
    wrapper.vm.handleRightClick();
    expect(wrapper.vm.$emit).toHaveBeenNthCalledWith(5, 'change', 5);
    wrapper.vm.handleRightClick();
    expect(wrapper.vm.$emit).toHaveBeenNthCalledWith(7, 'change', 5);
  });
  it('checks the position on screen', async () => {
    const wrapper = mount(IFCPageSelector, {
      propsData: {
        value: 25,
        pages: [
          25, 50, 100,
        ],
      },
    });
    wrapper.vm.distanceFromBottom = Number.NEGATIVE_INFINITY;
    wrapper.vm.checkPositionOnScreen();
    expect(wrapper.vm.distanceFromBottom).not.toBe(Number.NEGATIVE_INFINITY);
  });
});
