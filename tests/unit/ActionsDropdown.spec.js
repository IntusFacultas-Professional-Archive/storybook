import IFCActionsDropdown from '@Components/Table/ActionsDropdown/IFCActionsDropdown.vue';

const { mount } = require('@vue/test-utils');

describe('IFCActionsDropdown.vue', () => {
  it('correctly computes the ref name for buttons', () => {
    const wrapper = mount(IFCActionsDropdown, {
      propsData: {
        actions: [
          'a',
          'b',
          'c',
        ],
      },
    });
    expect(wrapper.vm.computeRef('a')).toBe('actionbutton-a');
  });
  it('collapses when a user clicks off the dropdown', async () => {
    const wrapper = mount(IFCActionsDropdown, {
      propsData: {
        actions: [
          'a',
          'b',
          'c',
        ],
      },
    });
    wrapper.vm.clickOffDependantContainerOpen = true;
    wrapper.vm.detectOffClick({ target: wrapper.vm.$el });
    await wrapper.vm.$nextTick();
    expect(wrapper.vm.clickOffDependantContainerOpen).toBe(false);
  });
  it('opens when told to', async () => {
    window.addEventListener = jest.fn();
    const wrapper = mount(IFCActionsDropdown, {
      propsData: {
        actions: [
          'a',
          'b',
          'c',
        ],
      },
    });
    await wrapper.vm.$nextTick();
    await wrapper.vm.$nextTick();
    wrapper.vm.openContainer();
    await wrapper.vm.$nextTick();
    expect(wrapper.vm.clickOffDependantContainerOpen).toBe(true);
    expect(window.addEventListener).toBeCalledWith('click', wrapper.vm.detectOffClick);
  });
  it('doesn\'t collapse when a user clicks on the dropdown', async () => {
    const wrapper = mount(IFCActionsDropdown, {
      propsData: {
        actions: [
          'a',
          'b',
          'c',
        ],
      },
    });
    wrapper.vm.clickOffDependantContainerOpen = true;
    await wrapper.vm.$nextTick();
    await wrapper.vm.$nextTick();
    await wrapper.vm.$nextTick();

    wrapper.vm.detectOffClick({ target: wrapper.vm.$refs['actionbutton-a'][0].$el });
    await wrapper.vm.$nextTick();
    expect(wrapper.vm.clickOffDependantContainerOpen).toBe(true);
  });
  it('emits action on handleDropdownActionClick and sets clickOffDependantContainerOpen to false', () => {
    const wrapper = mount(IFCActionsDropdown, {
      propsData: {
        actions: [
          'a',
          'b',
          'c',
        ],
      },
    });
    wrapper.vm.$emit = jest.fn();
    wrapper.vm.clickOffDependantContainerOpen = true;
    wrapper.vm.handleDropdownActionClick('a');
    expect(wrapper.vm.$emit).toHaveBeenCalledWith('action', 'a');
    expect(wrapper.vm.clickOffDependantContainerOpen).toBe(false);
  });
  it('sets a left value for computeOffset if the left most edge is less than element offsetWidth', () => {
    const wrapper = mount(IFCActionsDropdown, {
      propsData: {
        actions: [
          'a',
          'b',
          'c',
        ],
      },
    });
    wrapper.vm.$refs[wrapper.vm.computeRef('container')] = {
      offsetWidth: Number.POSITIVE_INFINITY,
      getBoundingClientRect: () => ({
        left: 0,
        top: 0,
        bottom: 0,
        right: 0,
      }),
    };
    wrapper.vm.computeOffset();
    expect(wrapper.vm.style.left).toBe(0);
  });
});
