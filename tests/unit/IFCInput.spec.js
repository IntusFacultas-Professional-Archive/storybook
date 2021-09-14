import IFCInput from '@Components/Input/IFCInput.vue';
import { STATE_MAP, VALID_INPUT_TYPES, VALID_STATES } from '@Components/Input/config';
import { mount } from '@vue/test-utils';

describe('IFCInput.vue', () => {
  it('renders label content passed to the label slot', () => {
    const wrapper = mount(IFCInput, {
      propsData: {
        type: 'text',
        name: 'textInput',
        label: 'Text Input',
        state: STATE_MAP.default,
        value: 'test',
      },
      slots: {
        label: '<div class="fake-msg">Text</div>',
      },
    });

    expect(wrapper.find('.fake-msg').element).toBeDefined();
  });
  it('validates prop validity to true when prop "type" input value is in VALID_INPUT_TYPES', () => {
    const { validator } = IFCInput.props.type;
    VALID_INPUT_TYPES.forEach((inputType) => {
      expect(validator(inputType)).toBe(true);
    });
  });
  it('validates prop validity to false when prop "type" input value is not in VALID_INPUT_TYPES', () => {
    const { validator } = IFCInput.props.type;
    expect(validator('notavalidtype')).toBe(false);
  });
  it('validates prop validity to true when prop "state" input value is in VALID_STATES', () => {
    const { validator } = IFCInput.props.state;
    VALID_STATES.forEach((inputType) => {
      expect(validator(inputType)).toBe(true);
    });
  });
  it('validates prop validity to false when prop "state" input value is not in VALID_STATES', () => {
    const { validator } = IFCInput.props.state;
    expect(validator('notavalidtype')).toBe(false);
  });

  it('emits blur', () => {
    const onBlur = jest.fn();
    const wrapper = mount(IFCInput, {
      propsData: {
        type: 'text',
        name: 'textInput',
        label: 'Text Input',
        state: STATE_MAP.default,
        value: 'test',
      },
      listeners: {
        blur: onBlur,
      },
      slots: {
        default: '<div class="fake-msg">Text</div>',
      },
    });
    wrapper.find('input').trigger('blur');
    expect(onBlur).toHaveBeenCalled();
  });
  it('emits focus', () => {
    const onFocus = jest.fn();
    const wrapper = mount(IFCInput, {
      propsData: {
        type: 'text',
        name: 'textInput',
        label: 'Text Input',
        state: STATE_MAP.default,
        value: 'test',
      },
      listeners: {
        focus: onFocus,
      },
      slots: {
        default: '<div class="fake-msg">Text</div>',
      },
    });
    wrapper.find('input').trigger('focus');
    expect(onFocus).toHaveBeenCalled();
  });
  it('initializes with focus set to false', () => {
    const wrapper = mount(IFCInput, {
      propsData: {
        type: 'text',
        name: 'textInput',
        label: 'Text Input',
        state: STATE_MAP.default,
        value: 'test',
      },
      listeners: {
      },
      slots: {
        default: '<div class="fake-msg">Text</div>',
      },
    });
    expect(wrapper.vm.focus).toBeFalsy();
  });
  it('computes the aria-labelledby value when no extra data is passed to it', () => {
    const wrapper = mount(IFCInput, {
      propsData: {
        type: 'text',
        name: 'textInput',
        label: 'Text Input',
        state: STATE_MAP.default,
        value: 'test',
      },
      listeners: {
      },
      slots: {
        default: '<div class="fake-msg">Text</div>',
      },
    });
    expect(wrapper.vm.computedAriaLabeledBy).toBe(wrapper.vm.computedLabelId);
  });
  it('computes the aria-labelledby value when a string value is passed to the prop', () => {
    const ariaLabeledBy = 'SomeOtherIdentifier';
    const wrapper = mount(IFCInput, {
      propsData: {
        type: 'text',
        name: 'textInput',
        label: 'Text Input',
        state: STATE_MAP.default,
        value: 'test',
        ariaLabeledBy,
      },
      listeners: {
      },
      slots: {
        default: '<div class="fake-msg">Text</div>',
      },
    });
    expect(wrapper.vm.computedAriaLabeledBy).toBe(`${ariaLabeledBy} ${wrapper.vm.computedLabelId}`);
  });
  it('computes the aria-labelledby value when an array is passed to the prop', () => {
    const ariaLabeledBy = ['Another Identifier', 'SomeOtherIdentifier'];
    const wrapper = mount(IFCInput, {
      propsData: {
        type: 'text',
        name: 'textInput',
        label: 'Text Input',
        state: STATE_MAP.default,
        value: 'test',
        ariaLabeledBy,
      },
      listeners: {
      },
      slots: {
        default: '<div class="fake-msg">Text</div>',
      },
    });
    expect(wrapper.vm.computedAriaLabeledBy).toBe(`${ariaLabeledBy.join(' ')} ${wrapper.vm.computedLabelId}`);
  });
  it('computes an id for use in the label and input when id isnt provided', () => {
    const wrapper = mount(IFCInput, {
      propsData: {
        type: 'text',
        name: 'textInput',
        label: 'Text Input',
        state: STATE_MAP.default,
        value: 'test',
      },
      listeners: {
      },
      slots: {
        default: '<div class="fake-msg">Text</div>',
      },
    });
    /**
     * Disabled because _uid is an internal vue variable, we can't control the naming convention
     */
    /* eslint-disable-next-line no-underscore-dangle */
    expect(wrapper.vm.computedId).toBe(`${wrapper.vm.name}-${wrapper.vm._uid}`);
  });
  it('computes an id for use in the label and input when id is provided', () => {
    const wrapper = mount(IFCInput, {
      propsData: {
        type: 'text',
        name: 'textInput',
        label: 'Text Input',
        state: STATE_MAP.default,
        value: 'test',
        id: 'Test!',
      },
      listeners: {
      },
      slots: {
        default: '<div class="fake-msg">Text</div>',
      },
    });
    /**
     * Disabled because _uid is an internal vue variable, we can't control the naming convention
     */
    /* eslint-disable-next-line no-underscore-dangle */
    expect(wrapper.vm.computedId).toBe('Test!');
  });
  it('passes value to input and emits input', async () => {
    const onInput = jest.fn();
    const inputValue = 'test';
    const wrapper = mount(IFCInput, {
      propsData: {
        type: 'text',
        name: 'textInput',
        label: 'Text Input',
        state: STATE_MAP.default,
        value: inputValue,
      },
      listeners: {
        input: onInput,
      },
      slots: {
        default: '<div class="fake-msg">Text</div>',
      },
    });
    const input = wrapper.find('input');
    expect(input.element.value).toEqual(inputValue);
    input.element.value = `${inputValue}1`;
    await input.trigger('input');
    expect(onInput).toHaveBeenCalledWith(`${inputValue}1`);
  });
  it('emits change', () => {
    const onChange = jest.fn();
    const inputValue = 'test';
    const wrapper = mount(IFCInput, {
      propsData: {
        type: 'text',
        name: 'textInput',
        label: 'Text Input',
        state: STATE_MAP.default,
        value: inputValue,
      },
      listeners: {
        change: onChange,
      },
      slots: {
        default: '<div class="fake-msg">Text</div>',
      },
    });
    wrapper.find('input').trigger('change');
    expect(onChange).toHaveBeenCalled();
    expect(onChange).toHaveBeenCalledWith(inputValue);
  });
  it('calculates how much the label container must shrink to maintain styling', async () => {
    const wrapper = mount(IFCInput, {
      propsData: {
        type: 'text',
        name: 'textInput',
        label: 'Text Input',
        state: STATE_MAP.default,
        value: '',
      },
      listeners: {
      },
      slots: {
        default: '<div class="fake-msg">Text</div>',
      },
    });
    await wrapper.vm.$nextTick();
    expect(wrapper.vm.computedMarginRight).toBeDefined();
    expect(wrapper.vm.computedMarginRight).toBe('0px');
  });
  it('calculates remaining when under max', () => {
    const inputValue = 'test';
    const wrapper = mount(IFCInput, {
      propsData: {
        type: 'text',
        name: 'textInput',
        label: 'Text Input',
        state: STATE_MAP.default,
        value: inputValue,
        maxlength: 5,
      },
      listeners: {
      },
      slots: {
        default: '<div class="fake-msg">Text</div>',
      },
    });
    expect(wrapper.vm.calculatedRemaining).toBe('1 more character allowed.');
  });
  it('calculates remaining when at max', () => {
    const inputValue = 'test';
    const wrapper = mount(IFCInput, {
      propsData: {
        type: 'text',
        name: 'textInput',
        label: 'Text Input',
        state: STATE_MAP.default,
        value: inputValue,
        maxlength: 4,
      },
      listeners: {
      },
      slots: {
        default: '<div class="fake-msg">Text</div>',
      },
    });
    expect(wrapper.vm.calculatedRemaining).toBe('0 more characters allowed.');
  });
  it('calculates remaining when over max', () => {
    const inputValue = 'test';
    const wrapper = mount(IFCInput, {
      propsData: {
        type: 'text',
        name: 'textInput',
        label: 'Text Input',
        state: STATE_MAP.default,
        value: inputValue,
        maxlength: 2,
      },
      listeners: {
      },
      slots: {
        default: '<div class="fake-msg">Text</div>',
      },
    });
    expect(wrapper.vm.calculatedRemaining).toBe('2 characters over maximum length.');
  });
  it('calculates remaining required with minlength when more than 1 left.', () => {
    const inputValue = 'test';
    const wrapper = mount(IFCInput, {
      propsData: {
        type: 'text',
        name: 'textInput',
        label: 'Text Input',
        state: STATE_MAP.default,
        value: inputValue,
        minlength: 6,
      },
      listeners: {
      },
      slots: {
        default: '<div class="fake-msg">Text</div>',
      },
    });
    expect(wrapper.vm.calculatedRequired).toBe('2 more characters required.');
  });
  it('calculates remaining required with minlength when 1 left.', () => {
    const inputValue = 'test';
    const wrapper = mount(IFCInput, {
      propsData: {
        type: 'text',
        name: 'textInput',
        label: 'Text Input',
        state: STATE_MAP.default,
        value: inputValue,
        minlength: 5,
      },
      listeners: {
      },
      slots: {
        default: '<div class="fake-msg">Text</div>',
      },
    });
    expect(wrapper.vm.calculatedRequired).toBe('1 more character required.');
  });
  it('Displays appropriate message when minlength and maxlength are defined and value is less than minlength', () => {
    const inputValue = 'test';
    const wrapper = mount(IFCInput, {
      propsData: {
        type: 'text',
        name: 'textInput',
        label: 'Text Input',
        state: STATE_MAP.default,
        value: inputValue,
        minlength: 5,
        maxlength: 7,
      },
      listeners: {
      },
      slots: {
        default: '<div class="fake-msg">Text</div>',
      },
    });
    expect(wrapper.vm.defaultMinMaxMicrocopy).toBe('1 more character required.');
  });
  it(`Displays appropriate message when minlength and maxlength are defined and value is less 
      than maxlength and equal to minlength`, () => {
    const inputValue = 'test1';
    const wrapper = mount(IFCInput, {
      propsData: {
        type: 'text',
        name: 'textInput',
        label: 'Text Input',
        state: STATE_MAP.default,
        value: inputValue,
        minlength: 5,
        maxlength: 7,
      },
      listeners: {
      },
      slots: {
        default: '<div class="fake-msg">Text</div>',
      },
    });
    expect(wrapper.vm.defaultMinMaxMicrocopy).toBe('2 more characters allowed.');
  });
  it(`Displays appropriate message when minlength and maxlength are defined and value is less 
      than maxlength and greater than minlength`, () => {
    const inputValue = 'test11';
    const wrapper = mount(IFCInput, {
      propsData: {
        type: 'text',
        name: 'textInput',
        label: 'Text Input',
        state: STATE_MAP.default,
        value: inputValue,
        minlength: 5,
        maxlength: 7,
      },
      listeners: {
      },
      slots: {
        default: '<div class="fake-msg">Text</div>',
      },
    });
    expect(wrapper.vm.defaultMinMaxMicrocopy).toBe('1 more character allowed.');
  });
  it('Displays appropriate message when minlength and maxlength are defined and value is greater than maxlength',
    () => {
      const inputValue = 'test1111';
      const wrapper = mount(IFCInput, {
        propsData: {
          type: 'text',
          name: 'textInput',
          label: 'Text Input',
          state: STATE_MAP.default,
          value: inputValue,
          minlength: 5,
          maxlength: 7,
        },
        listeners: {
        },
        slots: {
          default: '<div class="fake-msg">Text</div>',
        },
      });
      expect(wrapper.vm.defaultMinMaxMicrocopy).toBe('1 character over maximum length.');
    });
  it('force updates when focus changes', async () => {
    const inputValue = 'test';
    const wrapper = mount(IFCInput, {
      propsData: {
        type: 'text',
        name: 'textInput',
        label: 'Text Input',
        state: STATE_MAP.default,
        value: inputValue,
      },
      listeners: {
      },
      slots: {
        default: '<div class="fake-msg">Text</div>',
      },
    });
    wrapper.vm.$forceUpdate = jest.fn();
    wrapper.vm.focus = !wrapper.vm.focus;
    await wrapper.vm.$nextTick();
    await wrapper.vm.$nextTick();
    await wrapper.vm.$nextTick();
    expect(wrapper.vm.$forceUpdate).toHaveBeenCalled();
  });
  it('has prop name of type String that is required', () => {
    const { name } = IFCInput.props;
    expect(name.type).toBe(String);
    expect(name.required).toBe(true);
  });

  it('has prop id of type String', () => {
    const { id } = IFCInput.props;
    expect(id.type).toBe(String);
  });

  it('has prop autofocus of type Boolean, with default value: false', () => {
    const { autofocus } = IFCInput.props;
    expect(autofocus.type).toBe(Boolean);
    expect(autofocus.default).toBe(false);
  });

  it('has prop autocomplete of type String, with default value: ""', () => {
    const { autocomplete } = IFCInput.props;
    expect(autocomplete.type).toBe(String);
    expect(autocomplete.default).toBe('');
  });

  it('has prop required of type Boolean, with default value: false', () => {
    const { required } = IFCInput.props;
    expect(required.type).toBe(Boolean);
    expect(required.default).toBe(false);
  });

  it('has prop readonly of type Boolean, with default value: false', () => {
    const { readonly } = IFCInput.props;
    expect(readonly.type).toBe(Boolean);
    expect(readonly.default).toBe(false);
  });

  it('has prop pattern of type String, with default value: undefined', () => {
    const { pattern } = IFCInput.props;
    expect(pattern.type).toBe(String);
    expect(pattern.default).toBe(undefined);
  });

  it('has prop max of type Number, with default value: undefined', () => {
    const { max } = IFCInput.props;
    expect(max.type).toBe(Number);
    expect(max.default).toBe(undefined);
  });

  it('has prop step of type Number, with default value: undefined', () => {
    const { step } = IFCInput.props;
    expect(step.type).toBe(Number);
    expect(step.default).toBe(undefined);
  });

  it('has prop min of type Number, with default value: undefined', () => {
    const { min } = IFCInput.props;
    expect(min.type).toBe(Number);
    expect(min.default).toBe(undefined);
  });

  it('has prop minlength of type Number, with default value: undefined', () => {
    const { minlength } = IFCInput.props;
    expect(minlength.type).toBe(Number);
    expect(minlength.default).toBe(undefined);
  });

  it('has prop maxlength of type Number, with default value: undefined', () => {
    const { maxlength } = IFCInput.props;
    expect(maxlength.type).toBe(Number);
    expect(maxlength.default).toBe(undefined);
  });

  it('has prop disabled of type Boolean, with default value: false', () => {
    const { disabled } = IFCInput.props;
    expect(disabled.type).toBe(Boolean);
    expect(disabled.default).toBe(false);
  });

  it('has prop ariaLabeledBy of type [String, Array], with default value: ""', () => {
    const { ariaLabeledBy } = IFCInput.props;
    expect(ariaLabeledBy.type).toStrictEqual([String, Array]);
    expect(ariaLabeledBy.default).toBe('');
  });

  it('has prop placeholder of type String, with default value: null', () => {
    const { placeholder } = IFCInput.props;
    expect(placeholder.type).toBe(String);
    expect(placeholder.default).toBe(null);
  });

  it('has prop type of type String that is required with default value: "text"', () => {
    const { type } = IFCInput.props;
    expect(type.type).toBe(String);
    expect(type.default).toBe('text');
  });

  it('validates that the type value is of a valid input type', () => {
    const { type } = IFCInput.props;
    const { validator } = type;
    VALID_INPUT_TYPES.forEach((inputType) => {
      expect(validator(inputType)).toBe(true);
    });
    const badType = 'asdfasdfasdfasdf';
    expect(VALID_INPUT_TYPES.includes(badType)).toBe(false);
    expect(validator(badType)).toBe(false);
  });

  it('has prop state of type String, with default value: "default"', () => {
    const { state } = IFCInput.props;
    expect(state.type).toBe(String);
    expect(state.default).toBe('default');
  });

  it('validates that the state value passed is a valid state', () => {
    const { state } = IFCInput.props;
    const { validator } = state;
    VALID_STATES.forEach((inputState) => {
      expect(validator(inputState)).toBe(true);
    });
    const badState = 'asdfasdfasdfasdf';
    expect(VALID_STATES.includes(badState)).toBe(false);
    expect(validator(badState)).toBe(false);
  });

  it('has prop value of type [String, Number] that is required with default value: ""', () => {
    const { value } = IFCInput.props;
    expect(value.type).toStrictEqual([String, Number]);
    expect(value.default).toBe('');
  });
});
