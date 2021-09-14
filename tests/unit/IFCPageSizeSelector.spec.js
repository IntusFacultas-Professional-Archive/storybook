import { IFCPageSizeSelector } from '@Components/Pagination/IFCPageSizeSelector/IFCPageSizeSelector.vue';
import { mount } from '@vue/test-utils';

describe('IFCPageSizeSelector', () => {
  it('emits an event when the user selects a different value', async () => {
    const wrapper = mount(IFCPageSizeSelector, {
      propsData: {
        value: 25,
        pageSizes: [
          25, 50, 100,
        ],
      },
    });
    wrapper.vm.$emit = jest.fn();
    const root = wrapper.find('div');
    root.find('select').findAll('option').at(1).setSelected();
    expect(wrapper.vm.$emit).toHaveBeenCalledWith('change', 50);
  });
  it('validates the prop  pageSize to avoid strings', () => {
    const wrapper = mount(IFCPageSizeSelector, {
      propsData: {
        value: 25,
        pageSizes: [
          25, 50, 100,
        ],
      },
    });
    const { validator } = wrapper.vm.$options.props.pageSizes;
    expect(validator(['sasdf', 1, 2])).toBe(false);
  });
});
