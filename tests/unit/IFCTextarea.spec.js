import { VALID_STATES } from '@Components/Input/config';
import { IFCTextarea } from '@Components/Textarea/IFCTextarea';
import { mount } from '@vue/test-utils';
import ResizeObserver from 'resize-observer-polyfill';

describe('IFCTextarea', () => {
  it('has prop name of type: String that is required', () => {
    const { name } = IFCTextarea.props;
    expect(name.required).toBe(true);
    expect(name.type).toBe(String);
  });

  it('has prop id of type: String that is not required', () => {
    const { id } = IFCTextarea.props;
    expect(id.required).toBe(false);
    expect(id.type).toBe(String);
  });

  it('has prop dark of type: Boolean with default: false that is not required', () => {
    const { dark } = IFCTextarea.props;
    expect(dark.required).toBe(false);
    expect(dark.type).toBe(Boolean);
  });

  it('has prop autofocus of type: Boolean that is not required with default: false', () => {
    const { autofocus } = IFCTextarea.props;
    expect(autofocus.required).toBe(false);
    expect(autofocus.type).toBe(Boolean);
  });

  it('has prop autocomplete of type: String that is not required with default: \'\'', () => {
    const { autocomplete } = IFCTextarea.props;
    expect(autocomplete.required).toBe(false);
    expect(autocomplete.type).toBe(String);
  });

  it('has prop required of type: Boolean with default: false that is not required', () => {
    const { required } = IFCTextarea.props;
    expect(required.required).toBe(false);
    expect(required.type).toBe(Boolean);
  });

  it('has prop readonly of type: Boolean that is not required with default: false', () => {
    const { readonly } = IFCTextarea.props;
    expect(readonly.required).toBe(false);
    expect(readonly.type).toBe(Boolean);
  });

  it('has prop pattern of type: String that is not required with default: undefined', () => {
    const { pattern } = IFCTextarea.props;
    expect(pattern.required).toBe(false);
    expect(pattern.type).toBe(String);
  });

  it('has prop minlength of type: Number that is not required with default: undefined', () => {
    const { minlength } = IFCTextarea.props;
    expect(minlength.required).toBe(false);
    expect(minlength.type).toBe(Number);
  });

  it('has prop maxlength of type: Number that is not required with default: undefined', () => {
    const { maxlength } = IFCTextarea.props;
    expect(maxlength.required).toBe(false);
    expect(maxlength.type).toBe(Number);
  });

  it('has prop disabled of type: Boolean that is not required with default: false', () => {
    const { disabled } = IFCTextarea.props;
    expect(disabled.required).toBe(false);
    expect(disabled.type).toBe(Boolean);
  });

  it('has prop ariaLabeledBy of type: [String, Array] that is not required with default: \'\'', () => {
    const { ariaLabeledBy } = IFCTextarea.props;
    expect(ariaLabeledBy.required).toBe(false);
    expect(ariaLabeledBy.type).toStrictEqual([String, Array]);
  });

  it('has prop placeholder of type: String that is not required with default: \'\'', () => {
    const { placeholder } = IFCTextarea.props;
    expect(placeholder.required).toBe(false);
  });

  it('has prop cols of type: Number that is not required with default: null', () => {
    const { cols } = IFCTextarea.props;
    expect(cols.required).toBe(false);
    expect(cols.type).toBe(Number);
  });

  it('has prop rows of type: Number that is not required with default: null', () => {
    const { rows } = IFCTextarea.props;
    expect(rows.required).toBe(false);
    expect(rows.type).toBe(Number);
  });

  it('has prop state of type: String that is not required with default: \'default\' that validates state option',
    () => {
      const { state } = IFCTextarea.props;
      expect(state.required).toBe(false);
      expect(state.type).toBe(String);
      const { validator } = state;
      Object.values(VALID_STATES).forEach((inputState) => {
        expect(validator(inputState)).toBe(true);
      });
      expect(validator('asdf')).toBe(false);
    });

  it('has prop value of type: [String, Number] with that is required', () => {
    const { value } = IFCTextarea.props;
    expect(value.required).toBe(true);
    expect(value.type).toStrictEqual([String, Number]);
  });

  it('mounts a resizeobserver on mount', async () => {
    jest.useFakeTimers();
    const wrapper = mount(IFCTextarea, {
      propsData: {
        value: 'asdf',
        name: 'asdf',
      },
    });
    await wrapper.vm.$nextTick();
    jest.runAllTimers();
    expect(wrapper.vm.observer instanceof ResizeObserver).toBe(true);
  });
  it('stops observing before destroy', async () => {
    jest.useFakeTimers();
    const wrapper = mount(IFCTextarea, {
      propsData: {
        value: 'asdf',
        name: 'asdf',
      },
    });
    await wrapper.vm.$nextTick();
    jest.runAllTimers();
    wrapper.vm.observer.disconnect();
    wrapper.vm.observer = {
      disconnect: jest.fn(),
    };
    wrapper.destroy();
    await wrapper.vm.$nextTick();
    expect(wrapper.vm.observer.disconnect).toHaveBeenCalled();
  });
  it('emits blur and sets focus to false on handleTextareaBlur', async () => {
    const wrapper = mount(IFCTextarea, {
      propsData: {
        value: 'asdf',
        name: 'asdf',
      },
    });
    wrapper.vm.focus = true;
    wrapper.vm.$emit = jest.fn();
    wrapper.vm.handleTextareaBlur();
    expect(wrapper.vm.$emit).toHaveBeenCalledWith('blur');
    expect(wrapper.vm.focus).toBe(false);
  });
  it('emits focus and sets focus to true on handleTextareaFocus', async () => {
    const wrapper = mount(IFCTextarea, {
      propsData: {
        value: 'asdf',
        name: 'asdf',
      },
    });
    wrapper.vm.focus = false;
    wrapper.vm.$emit = jest.fn();
    wrapper.vm.handleTextareaFocus();
    expect(wrapper.vm.$emit).toHaveBeenCalledWith('focus');
    expect(wrapper.vm.focus).toBe(true);
  });
  it('calculates a required length default microcopy when minlength is provided', async () => {
    const wrapper = mount(IFCTextarea, {
      propsData: {
        value: 'a',
        name: 'asdf',
        minlength: 3,
      },
    });
    expect(wrapper.vm.calculatedRequired).toBe('2 more characters required.');
    wrapper.setProps({ value: 'aa' });
    await wrapper.vm.$nextTick();
    expect(wrapper.vm.calculatedRequired).toBe('1 more character required.');
  });
  it('calculates a maximum allowable length default microcopy when maxlength is provided', async () => {
    const wrapper = mount(IFCTextarea, {
      propsData: {
        value: 'asdfa',
        name: 'asdfa',
        maxlength: 3,
      },
    });
    expect(wrapper.vm.calculatedRemaining).toBe('2 characters over maximum length.');
    wrapper.setProps({ value: 'asdf' });
    await wrapper.vm.$nextTick();
    expect(wrapper.vm.calculatedRemaining).toBe('1 character over maximum length.');
    wrapper.setProps({ value: 'as' });
    await wrapper.vm.$nextTick();
    expect(wrapper.vm.calculatedRemaining).toBe('1 more character allowed.');
    wrapper.setProps({ value: 'a' });
    await wrapper.vm.$nextTick();
    expect(wrapper.vm.calculatedRemaining).toBe('2 more characters allowed.');
  });
  it('shows the appropriate default microcopy when minlength and maxlength are provided', async () => {
    const wrapper = mount(IFCTextarea, {
      propsData: {
        value: 'asdfa',
        name: 'asdfa',
        maxlength: 3,
        minlength: 2,
      },
    });
    expect(wrapper.vm.defaultMinMaxMicrocopy).toBe(wrapper.vm.calculatedRemaining);
    wrapper.setProps({ value: 'a' });
    await wrapper.vm.$nextTick();
    expect(wrapper.vm.defaultMinMaxMicrocopy).toBe(wrapper.vm.calculatedRequired);
    wrapper.setProps({
      maxlength: null,
      minlength: null,
    });
    await wrapper.vm.$nextTick();
    expect(wrapper.vm.defaultMinMaxMicrocopy).toBe('');
  });
  it('recomputes computedMarginRight in the callback passed to the ResizeObserver', async () => {
    const wrapper = mount(IFCTextarea, {
      propsData: {
        value: 'asdfa',
        name: 'asdfa',
        maxlength: 3,
        minlength: 2,
      },
    });
    wrapper.vm.handleResize();
    expect(wrapper.vm.computedMarginRight).toBe('--6px');
  });
  it('calls $forceUpdate on focus change', async () => {
    const wrapper = mount(IFCTextarea, {
      propsData: {
        value: 'asdfa',
        name: 'asdfa',
        maxlength: 3,
        minlength: 2,
      },
    });
    wrapper.vm.$forceUpdate = jest.fn();
    wrapper.setData({ focus: !wrapper.vm.focus });
    await wrapper.vm.$nextTick();
    expect(wrapper.vm.$forceUpdate).toHaveBeenCalled();
  });
  it('calls $forceUpdate on value change', async () => {
    const wrapper = mount(IFCTextarea, {
      propsData: {
        value: 'asdfa',
        name: 'asdfa',
        maxlength: 3,
        minlength: 2,
      },
    });
    wrapper.vm.$forceUpdate = jest.fn();
    wrapper.setProps({ value: 'a' });
    await wrapper.vm.$nextTick();
    expect(wrapper.vm.$forceUpdate).toHaveBeenCalled();
  });
});
