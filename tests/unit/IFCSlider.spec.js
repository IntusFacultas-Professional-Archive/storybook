import IFCSlideFilter from '@Components/SlideFilter/IFCSlideFilter.vue';
import { mount } from '@vue/test-utils';

/**
 * These tests are far more detailed and in some cases, brittle, than most since this was used as
 * scaffolding for mentoring a new developer on how to develop a component
 */

describe('IFCSlider', () => {
  const wrapper = mount(IFCSlideFilter, {
    propsData: {
      lowerValue: 0,
      upperValue: 100,
      min: 0,
      max: 100,
      name: 'SampleName',
    },
  });

  /**
   * Prop existance and type tests
   */
  it('has a string prop called id of type String', () => {
    expect(Object.keys(IFCSlideFilter.props)).toContain('id');
    expect(IFCSlideFilter.props.id.type).toBe(String);
  });
  it('has a required number prop called lowerValue of type Number', () => {
    expect(Object.keys(IFCSlideFilter.props)).toContain('lowerValue');
    expect(IFCSlideFilter.props.lowerValue.required).toBe(true);
  });
  it('has a required number prop called upperValue of type Number', () => {
    expect(Object.keys(IFCSlideFilter.props)).toContain('upperValue');
    expect(IFCSlideFilter.props.upperValue.required).toBe(true);
  });
  it('has a required number prop called min of type Number', () => {
    expect(Object.keys(IFCSlideFilter.props)).toContain('min');
    expect(IFCSlideFilter.props.min.required).toBe(true);
  });
  it('has a required number prop called max of type Number', () => {
    expect(Object.keys(IFCSlideFilter.props)).toContain('max');
    expect(IFCSlideFilter.props.max.required).toBe(true);
  });
  it('has a non-required number prop called step of type Number with default value of 1', () => {
    expect(Object.keys(IFCSlideFilter.props)).toContain('step');
    expect(IFCSlideFilter.props.step.default).toBe(1);
  });
  it('has a required string prop called name of type String', () => {
    expect(Object.keys(IFCSlideFilter.props)).toContain('name');
    expect(IFCSlideFilter.props.name.required).toBe(true);
  });

  /**
   * Requisite component existence tests
   */
  it('has a screen reader text component', () => {
    expect(Object.keys(IFCSlideFilter.components)).toContain('IFCScreenReaderText');
  });

  /**
   * Computed ID tests
   */
  it('computes a base ID for the HTML elements based on the id prop', () => {
    const wrapperWithId = mount(IFCSlideFilter, {
      propsData: {
        id: 'SampleID',
        lowerValue: 0,
        upperValue: 100,
        min: 0,
        max: 100,
        name: 'SampleName',
      },
    });
    expect(wrapperWithId.vm.computedId).toBe('SampleID');
  });
  it('computes a name for the lower value inputs', () => {
    expect(wrapper.vm.lowerValueName).toBe(`${wrapper.vm.name}-lower`);
  });
  it('computes a name for the higher value inputs', () => {
    expect(wrapper.vm.upperValueName).toBe(`${wrapper.vm.name}-upper`);
  });
  it('defaults a base ID for the HTML elements if no id is passed in as a prop', () => {
    /**
     * Disabled because we don't control _uid naming
     */
    /* eslint-disable-next-line no-underscore-dangle */
    expect(wrapper.vm.computedId).toBe(`IFCSlideFilter-${wrapper.vm._uid}`);
  });
  it('generates an id for the left input', () => {
    /**
     * Disabled because we don't control _uid naming
     */
    /* eslint-disable-next-line no-underscore-dangle */
    expect(wrapper.vm.computedLeftId).toBe(`${wrapper.vm.computedId}-left`);
  });
  it('generates an id for the right input', () => {
    /**
     * Disabled because we don't control _uid naming
     */
    /* eslint-disable-next-line no-underscore-dangle */
    expect(wrapper.vm.computedRightId).toBe(`${wrapper.vm.computedId}-right`);
  });
  it('generates an id for the lower range input', () => {
    /**
     * Disabled because we don't control _uid naming
     */
    /* eslint-disable-next-line no-underscore-dangle */
    expect(wrapper.vm.computedLowerSliderId).toBe(`${wrapper.vm.computedLeftId}-slider`);
  });
  it('generates an id for the upper range input', () => {
    /**
     * Disabled because we don't control _uid naming
     */
    /* eslint-disable-next-line no-underscore-dangle */
    expect(wrapper.vm.computedUpperSliderId).toBe(`${wrapper.vm.computedRightId}-slider`);
  });
  it('generates an id for the various labels', () => {
    expect(wrapper.vm.visibleLabelId).toBe(`IFCNumberSliderLabel-${wrapper.vm.computedId}`);
  });
  it('generates an id for the lower value labels', () => {
    expect(wrapper.vm.lowerValueLabelId).toBe(`${wrapper.vm.visibleLabelId}-lower`);
  });
  it('generates an id for the upper value labels', () => {
    expect(wrapper.vm.upperValueLabelId).toBe(`${wrapper.vm.visibleLabelId}-upper`);
  });

  /**
 * Attribute binding tests
 */
  it('binds the computed input ids to the number input elements', async () => {
    await wrapper.vm.$nextTick();
    const elements = wrapper.findAll('input[type=number]').wrappers.map((w) => w.element);
    expect(elements.some((el) => el.getAttribute('id') === wrapper.vm.computedLeftId)).toBe(true);
    expect(elements.some((el) => el.getAttribute('id') === wrapper.vm.computedRightId)).toBe(true);
  });

  it('binds the computed input ids to the range input elements', async () => {
    await wrapper.vm.$nextTick();
    const elements = wrapper.findAll('input[type=range]').wrappers.map((w) => w.element);
    expect(elements.some((el) => el.getAttribute('id') === wrapper.vm.computedLowerSliderId)).toBe(true);
    expect(elements.some((el) => el.getAttribute('id') === wrapper.vm.computedUpperSliderId)).toBe(true);
  });
  it('binds lowerValue to the left input', () => {
    expect(Number.parseInt(wrapper.find(`input#${wrapper.vm.computedLeftId}`).element.value, 10)).toBe(
      Number.parseInt(wrapper.vm.lowerValue, 10),
    );
  });
  it('binds upperValue to the right input', () => {
    expect(Number.parseInt(wrapper.find(`input#${wrapper.vm.computedRightId}`).element.value, 10)).toBe(
      Number.parseInt(wrapper.vm.upperValue, 10),
    );
  });
  it('binds lowerValue to the lower slider', () => {
    expect(Number.parseInt(wrapper.find(`input#${wrapper.vm.computedLowerSliderId}`).element.value, 10)).toBe(
      Number.parseInt(wrapper.vm.lowerValue, 10),
    );
  });
  it('binds upperValue to the upper slider', () => {
    expect(Number.parseInt(wrapper.find(`input#${wrapper.vm.computedUpperSliderId}`).element.value, 10)).toBe(
      Number.parseInt(wrapper.vm.upperValue, 10),
    );
  });
  it('binds min to the left id', () => {
    expect(
      Number.parseInt(wrapper.find(`input#${wrapper.vm.computedLeftId}`).element.getAttribute('min'), 10),
    ).toEqual(
      wrapper.vm.min,
    );
  });
  it('binds max to the right id', () => {
    expect(
      Number.parseInt(wrapper.find(`input#${wrapper.vm.computedRightId}`).element.getAttribute('max'), 10),
    ).toEqual(
      wrapper.vm.max,
    );
  });
  /**
 * We programmatically enforce the lowerValue - upperValue barriers, because the sliders need to have
 * the same scaling, so their theoretical min and maxes should be the same
 */
  it('binds min and max to both sliders', () => {
    const sliders = wrapper.findAll('input[type=range]').wrappers.map((w) => w.element);
    expect(
      !sliders.some(
        (slider) => (
          slider.getAttribute('min') !== wrapper.vm.min || slider.getAttribute('max') !== wrapper.vm.max
        ),
      ),
    ).toBe(false);
  });
  it('sets max of left input to upperValue', async () => {
    wrapper.setProps({ upperValue: 80 });
    await wrapper.vm.$nextTick();
    expect(
      Number.parseInt(wrapper.find(`input#${wrapper.vm.computedLeftId}`).element.getAttribute('max'), 10),
    ).toEqual(
      wrapper.vm.upperValue,
    );
  });
  it('set min of right input to lowerValue', async () => {
    wrapper.setProps({ lowerValue: 10 });
    await wrapper.vm.$nextTick();
    expect(
      Number.parseInt(wrapper.find(`input#${wrapper.vm.computedRightId}`).element.getAttribute('min'), 10),
    ).toEqual(
      wrapper.vm.lowerValue,
    );
  });
  it('binds the computed names to the inputs', async () => {
    let input = wrapper.findAll(`input[name=${wrapper.vm.lowerValueName}]`);
    expect(input.length).toBe(2);
    input = wrapper.findAll(`input[name=${wrapper.vm.upperValueName}]`);
    expect(input.length).toBe(2);
  });

  /**
 * Accessability tests
 */
  it('binds aria-labelledby to the left input', () => {
    expect(wrapper.find(`input#${wrapper.vm.computedLeftId}`).element.getAttribute('aria-labelledby')).toBe(
      wrapper.vm.lowerValueLabelId,
    );
  });
  it('binds aria-labelledby to the right input', () => {
    expect(wrapper.find(`input#${wrapper.vm.computedRightId}`).element.getAttribute('aria-labelledby')).toBe(
      wrapper.vm.upperValueLabelId,
    );
  });
  it('binds aria-labelledby to the lower input slider', () => {
    expect(wrapper.find(`input#${wrapper.vm.computedLowerSliderId}`).element.getAttribute('aria-labelledby')).toBe(
      wrapper.vm.lowerValueLabelId,
    );
  });
  it('binds aria-labelledby to the upper input slider', () => {
    expect(wrapper.find(`input#${wrapper.vm.computedUpperSliderId}`).element.getAttribute('aria-labelledby')).toBe(
      wrapper.vm.upperValueLabelId,
    );
  });

  /**
 * Data validation and emitting tests
 */
  it('sets the lowerValue to be one step lower than the upperValue when the lowerValue is set above the upperValue',
    async () => {
      wrapper.vm.$emit = jest.fn();
      let input = wrapper.find(`input#${wrapper.vm.computedLeftId}`);
      input.element.value = wrapper.vm.upperValue + 1;
      input.trigger('input');
      await wrapper.vm.$nextTick();
      expect(wrapper.vm.$emit).toHaveBeenCalledWith('input', {
        lowerValue: wrapper.vm.upperValue - wrapper.vm.step,
        upperValue: wrapper.vm.upperValue,
      });
      input = wrapper.find(`input#${wrapper.vm.computedLowerSliderId}`);
      input.element.value = wrapper.vm.upperValue + 1;
      input.trigger('input');
      await wrapper.vm.$nextTick();
      expect(wrapper.vm.$emit).toHaveBeenNthCalledWith(2, 'input', {
        lowerValue: wrapper.vm.upperValue - wrapper.vm.step,
        upperValue: wrapper.vm.upperValue,
      });
    });
  it('sets the lowerValue to be one step lower than the upperValue when the lowerValue is set to the upperValue',
    async () => {
      wrapper.vm.$emit = jest.fn();
      let input = wrapper.find(`input#${wrapper.vm.computedLeftId}`);
      input.element.value = wrapper.vm.upperValue;
      input.trigger('input');
      await wrapper.vm.$nextTick();
      expect(wrapper.vm.$emit).toHaveBeenCalledWith('input', {
        lowerValue: wrapper.vm.upperValue - wrapper.vm.step,
        upperValue: wrapper.vm.upperValue,
      });
      input = wrapper.find(`input#${wrapper.vm.computedLowerSliderId}`);
      input.element.value = wrapper.vm.upperValue;
      input.trigger('input');
      await wrapper.vm.$nextTick();
      expect(wrapper.vm.$emit).toHaveBeenNthCalledWith(2, 'input', {
        lowerValue: wrapper.vm.upperValue - wrapper.vm.step,
        upperValue: wrapper.vm.upperValue,
      });
    });
  it('sets the lowerValue to be the minimum when set below the minimum',
    async () => {
      wrapper.vm.$emit = jest.fn();
      let input = wrapper.find(`input#${wrapper.vm.computedLeftId}`);
      input.element.value = wrapper.vm.min - 1;
      input.trigger('input');
      await wrapper.vm.$nextTick();
      expect(wrapper.vm.$emit).toHaveBeenCalledWith('input', {
        lowerValue: wrapper.vm.min,
        upperValue: wrapper.vm.upperValue,
      });
      input = wrapper.find(`input#${wrapper.vm.computedLowerSliderId}`);
      input.element.value = wrapper.vm.min - 1;
      input.trigger('input');
      await wrapper.vm.$nextTick();
      expect(wrapper.vm.$emit).toHaveBeenNthCalledWith(2, 'input', {
        lowerValue: wrapper.vm.min,
        upperValue: wrapper.vm.upperValue,
      });
    });
  it('sets the upperValue to be the maximum when set above the maximum',
    async () => {
      wrapper.vm.$emit = jest.fn();
      let input = wrapper.find(`input#${wrapper.vm.computedRightId}`);
      input.element.value = wrapper.vm.max + 1;
      input.trigger('input');
      await wrapper.vm.$nextTick();
      expect(wrapper.vm.$emit).toHaveBeenCalledWith('input', {
        lowerValue: wrapper.vm.lowerValue,
        upperValue: wrapper.vm.max,
      });
      input = wrapper.find(`input#${wrapper.vm.computedUpperSliderId}`);
      input.element.value = wrapper.vm.max + 1;
      input.trigger('input');
      await wrapper.vm.$nextTick();
      expect(wrapper.vm.$emit).toHaveBeenNthCalledWith(2, 'input', {
        lowerValue: wrapper.vm.lowerValue,
        upperValue: wrapper.vm.max,
      });
    });
  it('sets the upperValue to be one step above than the lowerValue when the upperValue is set below the lowerValue',
    async () => {
      wrapper.vm.$emit = jest.fn();
      let input = wrapper.find(`input#${wrapper.vm.computedRightId}`);
      input.element.value = wrapper.vm.lowerValue - 1;
      input.trigger('input');
      await wrapper.vm.$nextTick();
      expect(wrapper.vm.$emit).toHaveBeenCalledWith('input', {
        lowerValue: wrapper.vm.lowerValue,
        upperValue: wrapper.vm.lowerValue + wrapper.vm.step,
      });
      input = wrapper.find(`input#${wrapper.vm.computedUpperSliderId}`);
      input.element.value = wrapper.vm.lowerValue - 1;
      input.trigger('input');
      await wrapper.vm.$nextTick();
      expect(wrapper.vm.$emit).toHaveBeenCalledWith('input', {
        lowerValue: wrapper.vm.lowerValue,
        upperValue: wrapper.vm.lowerValue + wrapper.vm.step,
      });
    });
  it('sets the upperValue to be one step above than the lowerValue when the upperValue is set to the lowerValue',
    async () => {
      wrapper.vm.$emit = jest.fn();
      let input = wrapper.find(`input#${wrapper.vm.computedRightId}`);
      input.element.value = wrapper.vm.lowerValue;
      input.trigger('input');
      await wrapper.vm.$nextTick();
      expect(wrapper.vm.$emit).toHaveBeenCalledWith('input', {
        lowerValue: wrapper.vm.lowerValue,
        upperValue: wrapper.vm.lowerValue + wrapper.vm.step,
      });
      input = wrapper.find(`input#${wrapper.vm.computedUpperSliderId}`);
      input.element.value = wrapper.vm.lowerValue;
      input.trigger('input');
      await wrapper.vm.$nextTick();
      expect(wrapper.vm.$emit).toHaveBeenCalledWith('input', {
        lowerValue: wrapper.vm.lowerValue,
        upperValue: wrapper.vm.lowerValue + wrapper.vm.step,
      });
    });
  it('emits input on HTML input event, with a format {lowerValue: leftInputValue, upperValue: rightInputValue}',
    async () => {
      wrapper.vm.$emit = jest.fn();
      const rightInput = wrapper.find(`input#${wrapper.vm.computedRightId}`);
      const leftInput = wrapper.find(`input#${wrapper.vm.computedLeftId}`);
      rightInput.element.value = 70;
      rightInput.trigger('input');
      expect(wrapper.vm.$emit).toBeCalledWith('input', {
        lowerValue: wrapper.vm.lowerValue,
        upperValue: 70,
      });

      leftInput.element.value = 30;
      leftInput.trigger('input');
      await wrapper.vm.$nextTick();
      expect(wrapper.vm.$emit).toHaveBeenNthCalledWith(2, 'input', {
        lowerValue: 30,
        upperValue: wrapper.vm.upperValue,
      });
    });
  it('emits change on HTML change event, with a format {lowerValue: leftInputValue, upperValue: rightInputValue}',
    async () => {
      wrapper.vm.$emit = jest.fn();
      const rightInput = wrapper.find(`input#${wrapper.vm.computedRightId}`);
      const leftInput = wrapper.find(`input#${wrapper.vm.computedLeftId}`);
      rightInput.element.value = 70;
      rightInput.trigger('change');
      await wrapper.vm.$nextTick();
      expect(wrapper.vm.$emit).toBeCalledWith('change', {
        lowerValue: wrapper.vm.lowerValue,
        upperValue: 70,
      });

      leftInput.element.value = 30;
      leftInput.trigger('change');
      await wrapper.vm.$nextTick();
      expect(wrapper.vm.$emit).toHaveBeenNthCalledWith(2, 'change', {
        lowerValue: 30,
        upperValue: wrapper.vm.upperValue,
      });
    });
});
