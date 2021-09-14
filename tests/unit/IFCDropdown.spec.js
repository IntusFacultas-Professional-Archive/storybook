import IFCDropdown from '@Components/Dropdown/IFCDropdown.vue';
import { mount } from '@vue/test-utils';
import ResizeObserver from 'resize-observer-polyfill';
import { VALID_STATES } from '@Components/Input/config';

/**
 * Disabled because we need to pass validators even when we aren't really testing them
 */
/* eslint-disable no-unused-vars */
describe('IFCDropdown.vue', () => {
  const dropdownMixin = IFCDropdown.mixins.filter((mixin) => (
    typeof mixin.beforeDestroy === 'undefined'
    && typeof mixin.mounted === 'undefined'
    && typeof mixin.props === 'object'
  ))?.[0] ?? {};
  it('renders content passed to the label slot', () => {
    const wrapper = mount(IFCDropdown, {
      propsData: {
        name: 'IFCDropdown',
        value: [],
        options: [],

        searchFn: (a, b) => true,
        optionSelectedFn: (a, b) => true,
      },
      slots: {
        label: '<div class="fake-msg">Text</div>',
      },
    });
    expect(wrapper.find('label > .fake-msg').element).toBeDefined();
  });
  it('renders content passed to the option slot', async () => {
    const wrapper = mount(IFCDropdown, {
      propsData: {
        name: 'IFCDropdown',
        value: [],
        options: [{
          asdf: 1,
        }],

        searchFn: (a, b) => true,
        optionSelectedFn: (a, b) => true,
      },
      slots: {
        option: '<div class="fake-msg">Text</div>',
      },
    });
    wrapper.vm.focus = true;
    await wrapper.vm.$nextTick();
    expect(wrapper.find('div.fake-msg').element).toBeDefined();
  });
  it('renders content passed to the selected slot', () => {
    const wrapper = mount(IFCDropdown, {
      propsData: {
        name: 'IFCDropdown',
        value: [{
          asdf: 1,
        }],
        options: [
        ],

        searchFn: (a, b) => true,
        optionSelectedFn: (a, b) => true,
      },
      slots: {
        selected: '<div class="fake-msg">Text</div>',
      },
    });
    expect(wrapper.find('div.fake-msg').element).toBeDefined();
  });
  it('has a required String name prop for setting a name to the input', () => {
    const { name } = dropdownMixin.props;
    expect(name.type).toBe(String);
    expect(name.required).toBe(true);
  });
  it('has a default false Boolean closeAfterSelection prop for closing the dropdown after selection', () => {
    const { closeAfterSelection } = dropdownMixin.props;
    expect(closeAfterSelection.type).toBe(Boolean);
    expect(closeAfterSelection.default).toBe(false);
  });
  it('has a String id prop for setting an id to the input and label', () => {
    const { id } = dropdownMixin.props;
    expect(id.type).toBe(String);
  });
  it('has a default false Boolean disabled prop for disabling the dropdown.', () => {
    const { disabled } = dropdownMixin.props;
    expect(disabled.type).toBe(Boolean);
    expect(disabled.default).toBe(false);
  });
  it('has a default false Boolean readonly prop for setting the dropdown to readonly.', () => {
    const { readonly } = dropdownMixin.props;
    expect(readonly.type).toBe(Boolean);
    expect(readonly.default).toBe(false);
  });
  it('has a default false autofocus readonly prop for autofocusing the dropdown on render.', () => {
    const { autofocus } = dropdownMixin.props;
    expect(autofocus.type).toBe(Boolean);
    expect(autofocus.default).toBe(false);
  });
  it('has a default "default" String state prop for changing the state of the dropdown', () => {
    const { state } = dropdownMixin.props;
    expect(state.type).toBe(String);
    expect(state.default).toBe(VALID_STATES.default);
  });
  it('has a default "computeEmptyMessage" Function prop for changing the empty message of the dropdown', () => {
    const { computeEmptyMessage } = IFCDropdown.props;
    expect(computeEmptyMessage.type).toBe(Function);
    expect(computeEmptyMessage.default('asdf', 0, 0)).toBe('No options to display');
    expect(computeEmptyMessage.default('asdf', 1, 0)).toBe('No options match criteria');
    expect(computeEmptyMessage.default('asdf', 1, 1)).toBe('Loading');
    expect(computeEmptyMessage.default('', 1, 1)).toBe('Edge case');
  });
  it('returns true for the state prop validator if the value is one of the input config VALID_STATES', () => {
    const { state } = dropdownMixin.props;
    const { validator } = state;
    VALID_STATES.forEach((inputState) => {
      expect(validator(inputState)).toBe(true);
    });
  });
  it('returns false for the state prop validator if the value is not one of the input config VALID_STATES', () => {
    const { state } = dropdownMixin.props;
    const { validator } = state;
    const badState = 'asdfasdfasdfasdf';
    expect(VALID_STATES.includes(badState)).toBe(false);
    expect(validator(badState)).toBe(false);
  });
  it('has a String or Array default "" ariaLabeledBy prop for setting arialabeledby attribute', () => {
    const { ariaLabeledBy } = dropdownMixin.props;
    expect(ariaLabeledBy.type).toStrictEqual([String, Array]);
    expect(ariaLabeledBy.default).toBe('');
  });
  it('has a required Function searchFn prop for setting the input search behavior', () => {
    const { searchFn } = dropdownMixin.props;
    expect(searchFn.type).toBe(Function);
    expect(searchFn.required).toBe(true);
  });
  it('validates searchFn to have two arguments', () => {
    const { searchFn } = dropdownMixin.props;
    const { validator } = searchFn;
    expect(validator(() => {})).toBe(false);
    expect(validator((a) => {})).toBe(false);
    expect(validator((a, b) => {})).toBe(true);
    expect(validator((a, b, c) => {})).toBe(false);
  });
  it('has a required Function optionSelectedFn prop for determining which options are selected', () => {
    const { optionSelectedFn } = dropdownMixin.props;
    expect(optionSelectedFn.type).toBe(Function);
    expect(optionSelectedFn.required).toBe(true);
  });
  it('validates optionSelectedFn to have two arguments', () => {
    const { optionSelectedFn } = dropdownMixin.props;
    const { validator } = optionSelectedFn;
    expect(validator(() => {})).toBe(false);
    expect(validator((a) => {})).toBe(false);
    expect(validator((a, b) => {})).toBe(true);
    expect(validator((a, b, c) => {})).toBe(false);
  });
  it('has a non-required default (value) => false Function optionDisabledFn prop for disabling options', () => {
    const { optionDisabledFn } = dropdownMixin.props;
    expect(optionDisabledFn.type).toBe(Function);
    expect(optionDisabledFn.required).toBe(false);
    expect(optionDisabledFn.default(1)).toEqual(false);
  });
  it('validates optionDisabledFn to have at least one argument', () => {
    const { optionDisabledFn } = dropdownMixin.props;
    const { validator } = optionDisabledFn;
    expect(validator(() => {})).toBe(false);
    expect(validator((a) => {})).toBe(true);
    expect(validator((a, b) => {})).toBe(true);
  });
  it('has a non-required default (value) => false Function valueDisabledFn prop for disabling selected options', () => {
    const { valueDisabledFn } = dropdownMixin.props;
    expect(valueDisabledFn.type).toBe(Function);
    expect(valueDisabledFn.required).toBe(false);
    expect(valueDisabledFn.default(1)).toEqual(false);
  });
  it('validates valueDisabledFn to have at least one argument', () => {
    const { valueDisabledFn } = dropdownMixin.props;
    const { validator } = valueDisabledFn;
    expect(validator(() => {})).toBe(false);
    expect(validator((a) => {})).toBe(true);
    expect(validator((a, b) => {})).toBe(true);
  });
  it('has a non-required default (index, obj) => index Function calculateKey prop for calculating v-for keys', () => {
    const { calculateKey } = dropdownMixin.props;
    expect(calculateKey.type).toBe(Function);
    expect(calculateKey.required).toBe(false);
    expect(calculateKey.default(1, {})).toEqual(1);
  });
  it('validates calculateKey to have at least two arguments', () => {
    const { calculateKey } = dropdownMixin.props;
    const { validator } = calculateKey;
    expect(validator(() => {})).toBe(false);
    expect(validator((a) => {})).toBe(false);
    expect(validator((a, b) => {})).toBe(true);
    expect(validator((a, b, c) => {})).toBe(true);
  });
  it('renders a sane message when no options are provided', () => {
    const wrapper = mount(IFCDropdown, {
      propsData: {
        name: 'IFCDropdown',
        value: [],
        options: [
        ],

        searchFn: (a, b) => true,
        optionSelectedFn: (a, b) => true,
      },
    });
    const el = wrapper.find('li > button ').element;
    expect(el).toBeDefined();
    expect(el.innerHTML).toContain('No options to display');
  });
  it('renders a sane message when no options match search', async () => {
    const wrapper = mount(IFCDropdown, {
      propsData: {
        name: 'IFCDropdown',
        value: [],
        options: [
          {
            text: 'Value',
            value: 'value',
          },
        ],
        searchFn: (a, b) => false,
        optionSelectedFn: (a, b) => true,
      },
    });
    wrapper.vm.searchText = 'asdf';
    await wrapper.vm.$nextTick();
    const el = wrapper.find('li > button ').element;
    expect(el).toBeDefined();
    expect(el.innerHTML).toContain('No options match criteria');
  });
  it('mounts a resize observer on mounted', async () => {
    jest.useFakeTimers();
    const wrapper = mount(IFCDropdown, {
      propsData: {
        name: 'IFCDropdown',
        value: [],
        options: [
          {
            text: 'Value',
            value: 'value',
          },
        ],
        searchFn: (a, b) => false,
        optionSelectedFn: (a, b) => true,
      },
    });
    jest.runAllTimers();
    expect(wrapper.vm.observer).toBeDefined();
    expect(wrapper.vm.observer).toBeInstanceOf(ResizeObserver);
  });
  it('stops observing resize before destroy', async () => {
    jest.useFakeTimers();
    const wrapper = mount(IFCDropdown, {
      propsData: {
        name: 'IFCDropdown',
        value: [],
        options: [
          {
            text: 'Value',
            value: 'value',
          },
        ],
        searchFn: (a, b) => false,
        optionSelectedFn: (a, b) => true,
      },
    });
    await wrapper.vm.$nextTick();
    await wrapper.vm.$nextTick();
    // jest.runAllTimers();
    jest.advanceTimersByTime(1000);
    wrapper.vm.observer.disconnect = jest.fn();
    wrapper.destroy();
    expect(wrapper.vm.observer.disconnect).toHaveBeenCalled();
  });

  it('computes the aria-labelledby value when no extra data is passed to it', () => {
    const wrapper = mount(IFCDropdown, {
      propsData: {
        name: 'IFCDropdown',
        value: [],
        options: [
          {
            text: 'Value',
            value: 'value',
          },
        ],
        searchFn: (a, b) => false,
        optionSelectedFn: (a, b) => true,
      },
    });
    expect(wrapper.vm.computedAriaLabeledBy).toBe(wrapper.vm.computedLabelId);
  });
  it('computes the aria-labelledby value when a string value is passed to the prop', () => {
    const ariaLabeledBy = 'SomeOtherIdentifier';
    const wrapper = mount(IFCDropdown, {
      propsData: {
        name: 'IFCDropdown',
        value: [],
        options: [
          {
            text: 'Value',
            value: 'value',
          },
        ],
        searchFn: (a, b) => false,
        optionSelectedFn: (a, b) => true,
        ariaLabeledBy,
      },
    });
    expect(wrapper.vm.computedAriaLabeledBy).toBe(`${ariaLabeledBy} ${wrapper.vm.computedLabelId}`);
  });
  it('computes the aria-labelledby value when an array is passed to the prop', () => {
    const ariaLabeledBy = ['Another Identifier', 'SomeOtherIdentifier'];
    const wrapper = mount(IFCDropdown, {
      propsData: {
        name: 'IFCDropdown',
        value: [],
        options: [
          {
            text: 'Value',
            value: 'value',
          },
        ],
        searchFn: (a, b) => false,
        optionSelectedFn: (a, b) => true,
        ariaLabeledBy,
      },
    });
    expect(wrapper.vm.computedAriaLabeledBy).toBe(`${ariaLabeledBy.join(' ')} ${wrapper.vm.computedLabelId}`);
  });
  it('computes the name when id is passed to it', () => {
    const ariaLabeledBy = ['Another Identifier', 'SomeOtherIdentifier'];
    const id = 'Test';
    const wrapper = mount(IFCDropdown, {
      propsData: {
        name: 'IFCDropdown',
        value: [],
        options: [
          {
            text: 'Value',
            value: 'value',
          },
        ],
        searchFn: (a, b) => false,
        optionSelectedFn: (a, b) => true,
        ariaLabeledBy,
        id: 'Test',
      },
    });
    expect(wrapper.vm.computedName).toBe('Test');
  });
  it('computes the name when id isn\'t passed to it', () => {
    const ariaLabeledBy = ['Another Identifier', 'SomeOtherIdentifier'];
    const name = 'Test';
    const wrapper = mount(IFCDropdown, {
      propsData: {
        name,
        value: [],
        options: [
          {
            text: 'Value',
            value: 'value',
          },
        ],
        searchFn: (a, b) => false,
        optionSelectedFn: (a, b) => true,
        ariaLabeledBy,
      },
    });

    /**
     * Disabled because uid is an internal field of Vue, we don't control the naming convention.
     */
    /* eslint-disable-next-line no-underscore-dangle */
    expect(wrapper.vm.computedName).toBe(`${name}-${wrapper.vm._uid}`);
  });
  it('returns true for filled when searchText is not blank but values are empty', async () => {
    const wrapper = mount(IFCDropdown, {
      propsData: {
        name: 'IFCDropdown',
        value: [],
        options: [
          {
            text: 'Value',
            value: 'value',
          },
        ],
        searchFn: (a, b) => false,
        optionSelectedFn: (a, b) => true,
        id: 'Test',
      },
    });
    wrapper.vm.searchText = 'asdf';
    await wrapper.vm.$nextTick();
    expect(wrapper.vm.filled).toBe(true);
  });
  it('returns true for filled when searchText is blank but values are not empty', async () => {
    const wrapper = mount(IFCDropdown, {
      propsData: {
        name: 'IFCDropdown',
        value: [
          {
            text: 'Value',
            value: 'value',
          },
        ],
        options: [
          {
            text: 'Value',
            value: 'value',
          },
        ],
        searchFn: (a, b) => false,
        optionSelectedFn: (a, b) => true,
        id: 'Test',
      },
    });
    await wrapper.vm.$nextTick();
    expect(wrapper.vm.filled).toBe(true);
  });
  it('returns false for filled when neither searchText nor value are truthy', async () => {
    const wrapper = mount(IFCDropdown, {
      propsData: {
        name: 'IFCDropdown',
        value: [
        ],
        options: [
          {
            text: 'Value',
            value: 'value',
          },
        ],
        searchFn: (a, b) => false,
        optionSelectedFn: (a, b) => true,
        id: 'Test',
      },
    });
    await wrapper.vm.$nextTick();
    expect(wrapper.vm.filled).toBe(false);
  });
  it('uses searchFn to determine what to display', async () => {
    const wrapper = mount(IFCDropdown, {
      propsData: {
        name: 'IFCDropdown',
        value: [
        ],
        options: [
          {
            text: 'Value',
            value: 'value',
          },
        ],
        searchFn: jest.fn((a, b) => {}),
        optionSelectedFn: (a, b) => true,
        id: 'Test',
      },
    });
    wrapper.vm.searchText = 'asdf';
    await wrapper.vm.$nextTick();
    expect(wrapper.vm.searchFn).toHaveBeenCalled();
  });
  it('sets distances from the edge of the screen and menu size on checkPositionOnScreen', async () => {
    const wrapper = mount(IFCDropdown, {
      propsData: {
        name: 'IFCDropdown',
        value: [
        ],
        options: [
          {
            text: 'Value',
            value: 'value',
          },
        ],
        searchFn: jest.fn((a, b) => {}),
        optionSelectedFn: (a, b) => true,
        id: 'Test',
      },
    });
    wrapper.vm.distanceFromTop = undefined;
    wrapper.vm.distanceFromBottom = undefined;
    wrapper.vm.menuSize = undefined;
    wrapper.vm.checkPositionOnScreen();
    await wrapper.vm.$nextTick();
    expect(wrapper.vm.distanceFromTop).toBeDefined();
    expect(wrapper.vm.distanceFromBottom).toBeDefined();
    expect(wrapper.vm.menuSize).toBeDefined();
  });
  it('calls checkPositionOnScreen on input focus', async () => {
    const wrapper = mount(IFCDropdown, {
      propsData: {
        name: 'IFCDropdown',
        value: [
        ],
        options: [
          {
            text: 'Value',
            value: 'value',
          },
        ],
        searchFn: jest.fn((a, b) => {}),
        optionSelectedFn: (a, b) => true,
        id: 'Test',
      },
    });
    wrapper.vm.checkPositionOnScreen = jest.fn();
    const input = wrapper.find('input').element;
    input.focus();
    await wrapper.vm.$nextTick();
    expect(wrapper.vm.checkPositionOnScreen).toHaveBeenCalled();
  });
  it('blurs input on immediateBlur call', async () => {
    const wrapper = mount(IFCDropdown, {
      propsData: {
        name: 'IFCDropdown',
        value: [
        ],
        options: [
          {
            text: 'Value',
            value: 'value',
          },
        ],
        searchFn: jest.fn((a, b) => {}),
        optionSelectedFn: (a, b) => true,
        id: 'Test',
      },
    });
    wrapper.vm.checkPositionOnScreen = jest.fn();
    const input = wrapper.find('input').element;
    input.blur = jest.fn();
    wrapper.vm.immediateBlur();
    await wrapper.vm.$nextTick();
    expect(input.blur).toHaveBeenCalled();
  });
  it('uses calculateKey to calculateRef', async () => {
    const wrapper = mount(IFCDropdown, {
      propsData: {
        name: 'IFCDropdown',
        value: [
        ],
        options: [
          {
            text: 'Value',
            value: 'value',
          },
        ],
        searchFn: jest.fn((a, b) => {}),
        calculateKey: jest.fn((a, b) => {}),
        optionSelectedFn: (a, b) => true,
        id: 'Test',
      },
    });
    await wrapper.vm.$nextTick();
    expect(wrapper.vm.calculateKey).toHaveBeenCalled();
  });
  it('safely handles focusNext calls when shownOptions is empty', () => {
    const wrapper = mount(IFCDropdown, {
      propsData: {
        name: 'IFCDropdown',
        value: [
        ],
        options: [
        ],
        searchFn: jest.fn((a, b) => {}),
        calculateKey: jest.fn((a, b) => {}),
        optionSelectedFn: (a, b) => true,
        id: 'Test',
      },
    });
    expect(wrapper.vm.focusNext(0, { preventDefault: () => {} })).toBe(-1);
  });
  it('safely handles focusNext calls when shownOptions is not empty', () => {
    const wrapper = mount(IFCDropdown, {
      propsData: {
        name: 'IFCDropdown',
        value: [
        ],
        options: [
          {
            text: 'Value',
            value: 'value',
          },
        ],
        searchFn: jest.fn((a, b) => {}),
        calculateKey: jest.fn((a, b) => {}),
        optionSelectedFn: (a, b) => true,
        id: 'Test',
      },
    });
    expect(wrapper.vm.focusNext(0, { preventDefault: () => {} })).toBe(1);
  });
  it('defers blur when deferBlur is called by 100ms', () => {
    jest.useFakeTimers();
    const wrapper = mount(IFCDropdown, {
      propsData: {
        name: 'IFCDropdown',
        value: [
        ],
        options: [
          {
            text: 'Value',
            value: 'value',
          },
        ],
        searchFn: jest.fn((a, b) => {}),
        calculateKey: jest.fn((a, b) => {}),
        optionSelectedFn: (a, b) => true,
        id: 'Test',
      },
    });
    wrapper.vm.focus = true;
    wrapper.vm.deferBlur();
    expect(wrapper.vm.blurId).toBeTruthy();
    expect(wrapper.vm.focus).toBeTruthy();
    jest.runAllTimers();
    expect(wrapper.vm.focus).toBeFalsy();
  });
  it('cancels blur when cancelBlur is called before time is done', () => {
    jest.useFakeTimers();
    const wrapper = mount(IFCDropdown, {
      propsData: {
        name: 'IFCDropdown',
        value: [
        ],
        options: [
          {
            text: 'Value',
            value: 'value',
          },
        ],
        searchFn: jest.fn((a, b) => {}),
        calculateKey: jest.fn((a, b) => {}),
        optionSelectedFn: (a, b) => true,
        id: 'Test',
      },
    });
    wrapper.vm.focus = true;
    wrapper.vm.deferBlur();
    expect(wrapper.vm.blurId).toBeTruthy();
    expect(wrapper.vm.focus).toBeTruthy();
    wrapper.vm.cancelBlur();
    jest.runAllTimers();
    expect(wrapper.vm.focus).toBeTruthy();
  });
  it('emits change on menu click', async () => {
    jest.useFakeTimers();
    const option = {
      text: 'Value',
      value: 'value',
    };
    const wrapper = mount(IFCDropdown, {
      propsData: {
        name: 'IFCDropdown',
        value: [
        ],
        options: [
          option,
        ],
        searchFn: (a, b) => true,
        calculateKey: jest.fn((a, b) => {}),
        optionSelectedFn: (a, b) => true,
        id: 'Test',
      },
    });
    const menuButton = wrapper.find('button').element;
    menuButton.click();
    await wrapper.vm.$nextTick();
    expect(wrapper.emitted().input).toBeTruthy();
    expect(wrapper.emitted().input.length).toBe(1);
    expect(wrapper.emitted().input[0]).toStrictEqual([option]);
  });
  it('emits change on selected option click', async () => {
    jest.useFakeTimers();
    const option = {
      text: 'Value',
      value: 'value',
    };
    const wrapper = mount(IFCDropdown, {
      propsData: {
        name: 'IFCDropdown',
        value: [
          option,
        ],
        options: [
        ],
        searchFn: (a, b) => true,
        calculateKey: jest.fn((a, b) => {}),
        optionSelectedFn: (a, b) => true,
        id: 'Test',
      },
    });
    const menuButton = wrapper.find('button').element;
    menuButton.click();
    await wrapper.vm.$nextTick();
    expect(wrapper.emitted().input).toBeTruthy();
    expect(wrapper.emitted().input.length).toBe(1);
    expect(wrapper.emitted().input[0]).toStrictEqual([option]);
  });
  it('emits auto closes when closeAfterSelection is set to true and a user selects a value', async () => {
    const option = {
      text: 'Value',
      value: 'value',
    };
    const wrapper = mount(IFCDropdown, {
      propsData: {
        name: 'IFCDropdown',
        closeAfterSelection: true,
        value: [
          option,
        ],
        options: [
        ],
        searchFn: (a, b) => true,
        calculateKey: jest.fn((a, b) => {}),
        optionSelectedFn: (a, b) => true,
        id: 'Test',
      },
    });
    wrapper.vm.$emit = jest.fn();
    wrapper.vm.handleSelection(1);
    expect(wrapper.vm.$emit).toHaveBeenCalledWith('input', 1);
    expect(wrapper.vm.focus).toBe(false);
  });
  it('calls focusNext with 0 and event on keydown.down of input container', () => {
    const option = {
      text: 'Value',
      value: 'value',
    };
    const wrapper = mount(IFCDropdown, {
      propsData: {
        name: 'IFCDropdown',
        closeAfterSelection: true,
        value: [
          option,
        ],
        options: [
          option,
          option,
        ],
        searchFn: (a, b) => true,
        calculateKey: (a, b) => a,
        optionSelectedFn: (a, b) => true,
        id: 'Test',
      },
    });
    const inputContainer = wrapper.find('div > div > div');
    wrapper.vm.focusNext = jest.fn();
    inputContainer.trigger('keydown.down');
    const event = new KeyboardEvent({
      isTrusted: false,
    });
    expect(wrapper.vm.focusNext).toHaveBeenCalledWith(0, event);
  });
  it('calls focusNext with shownOptions.length - 1 and event on keydown.up of input container', () => {
    const option = {
      text: 'Value',
      value: 'value',
    };
    const wrapper = mount(IFCDropdown, {
      propsData: {
        name: 'IFCDropdown',
        closeAfterSelection: true,
        value: [
          option,
        ],
        options: [
          option,
          option,
        ],
        searchFn: (a, b) => true,
        calculateKey: (a, b) => a,
        optionSelectedFn: (a, b) => true,
        id: 'Test',
      },
    });
    const inputContainer = wrapper.find('div > div > div');
    wrapper.vm.focusNext = jest.fn();
    inputContainer.trigger('keydown.up');
    const event = new KeyboardEvent({
      isTrusted: false,
    });
    expect(wrapper.vm.focusNext).toHaveBeenCalledWith(wrapper.vm.shownOptions.length - 1, event);
  });
  it('emits input on click of selected badge', () => {
    const option = {
      text: 'Value',
      value: 'value',
    };
    const wrapper = mount(IFCDropdown, {
      propsData: {
        name: 'IFCDropdown',
        closeAfterSelection: true,
        value: [
          option,
        ],
        options: [
          option,
          option,
        ],
        searchFn: (a, b) => true,
        calculateKey: (a, b) => a,
        optionSelectedFn: (a, b) => true,
        id: 'Test',
      },
    });
    const selected = wrapper.find('button[data-selected="true"]');
    wrapper.vm.$emit = jest.fn();
    selected.trigger('click');
    expect(wrapper.vm.$emit).toHaveBeenCalledWith('input', option);
  });
  it('$emits focus, cancels blur, and checks position on screen on focus on input', () => {
    const option = {
      text: 'Value',
      value: 'value',
    };
    const wrapper = mount(IFCDropdown, {
      propsData: {
        name: 'IFCDropdown',
        closeAfterSelection: true,
        value: [
          option,
        ],
        options: [
          option,
          option,
        ],
        searchFn: (a, b) => true,
        calculateKey: (a, b) => a,
        optionSelectedFn: (a, b) => true,
        id: 'Test',
      },
    });
    const input = wrapper.find('input');
    wrapper.vm.cancelBlur = jest.fn();
    wrapper.vm.checkPositionOnScreen = jest.fn();
    wrapper.vm.$emit = jest.fn();
    input.trigger('focus');
    expect(wrapper.vm.$emit).toHaveBeenCalledWith('focus');
    expect(wrapper.vm.cancelBlur).toHaveBeenCalled();
    expect(wrapper.vm.checkPositionOnScreen).toHaveBeenCalled();
  });
  it('$emits blur, and defersBlur on blur of input', () => {
    const option = {
      text: 'Value',
      value: 'value',
    };
    const wrapper = mount(IFCDropdown, {
      propsData: {
        name: 'IFCDropdown',
        closeAfterSelection: true,
        value: [
          option,
        ],
        options: [
          option,
          option,
        ],
        searchFn: (a, b) => true,
        calculateKey: (a, b) => a,
        optionSelectedFn: (a, b) => true,
        id: 'Test',
      },
    });
    const input = wrapper.find('input');
    wrapper.vm.deferBlur = jest.fn();
    wrapper.vm.$emit = jest.fn();
    input.trigger('blur');
    expect(wrapper.vm.$emit).toHaveBeenCalledWith('blur');
    expect(wrapper.vm.deferBlur).toHaveBeenCalled();
  });
  it('$emits blur, and immediately blurs on keydown.esc of input', async () => {
    const option = {
      text: 'Value',
      value: 'value',
    };
    const wrapper = mount(IFCDropdown, {
      propsData: {
        name: 'IFCDropdown',
        closeAfterSelection: true,
        value: [
          option,
        ],
        options: [
          option,
          option,
        ],
        searchFn: (a, b) => true,
        calculateKey: (a, b) => a,
        optionSelectedFn: (a, b) => true,
        id: 'Test',
      },
    });
    const input = wrapper.find('input');
    wrapper.vm.$emit = jest.fn();
    input.trigger('keydown.esc');
    expect(wrapper.vm.$emit).toHaveBeenCalledWith('blur');
    wrapper.vm.immediateBlur = jest.fn();
    input.trigger('keydown.esc');
    expect(wrapper.vm.immediateBlur).toHaveBeenCalled();
  });
  it('calls cancelBlur on focus of dropdown option', async () => {
    const option = {
      text: 'Value',
      value: 'value',
    };
    const wrapper = mount(IFCDropdown, {
      propsData: {
        name: 'IFCDropdown',
        closeAfterSelection: true,
        value: [
          option,
        ],
        options: [
          option,
          option,
        ],
        searchFn: (a, b) => true,
        calculateKey: (a, b) => a,
        optionSelectedFn: (a, b) => true,
        id: 'Test',
      },
    });
    const searchedOption = wrapper.find('button[data-dropdownoption="true"]');
    wrapper.vm.cancelBlur = jest.fn();
    searchedOption.trigger('focus');
    expect(wrapper.vm.cancelBlur).toHaveBeenCalled();
  });
  it('calls focusNext with index + 1 and event on keydown.down of dropdown option', async () => {
    const option = {
      text: 'Value',
      value: 'value',
    };
    const wrapper = mount(IFCDropdown, {
      propsData: {
        name: 'IFCDropdown',
        closeAfterSelection: true,
        value: [
          option,
        ],
        options: [
          option,
          option,
        ],
        searchFn: (a, b) => true,
        calculateKey: (a, b) => a,
        optionSelectedFn: (a, b) => true,
        id: 'Test',
      },
    });
    const searchedOption = wrapper.find('button[data-dropdownoption="true"]');
    wrapper.vm.focusNext = jest.fn();
    searchedOption.trigger('keydown.down');
    const event = new KeyboardEvent({
      isTrusted: false,
    });
    expect(wrapper.vm.focusNext).toHaveBeenCalledWith(1, event);
  });
  it('calls focusNext with index - 1 and event on keydown.up of dropdown option', async () => {
    const option = {
      text: 'Value',
      value: 'value',
    };
    const wrapper = mount(IFCDropdown, {
      propsData: {
        name: 'IFCDropdown',
        closeAfterSelection: true,
        value: [
          option,
        ],
        options: [
          option,
          option,
        ],
        searchFn: (a, b) => true,
        calculateKey: (a, b) => a,
        optionSelectedFn: (a, b) => true,
        id: 'Test',
      },
    });
    const searchedOption = wrapper.find('button[data-dropdownoption="true"]');
    wrapper.vm.focusNext = jest.fn();
    searchedOption.trigger('keydown.up');
    const event = new KeyboardEvent({
      isTrusted: false,
    });
    expect(wrapper.vm.focusNext).toHaveBeenCalledWith(-1, event);
  });
  it('sets focus to false on keydown.esc of dropdown option', async () => {
    const option = {
      text: 'Value',
      value: 'value',
    };
    const wrapper = mount(IFCDropdown, {
      propsData: {
        name: 'IFCDropdown',
        closeAfterSelection: true,
        value: [
          option,
        ],
        options: [
          option,
          option,
        ],
        searchFn: (a, b) => true,
        calculateKey: (a, b) => a,
        optionSelectedFn: (a, b) => true,
        id: 'Test',
      },
    });
    const searchedOption = wrapper.find('button[data-dropdownoption="true"]');
    wrapper.vm.focus = true;
    await wrapper.vm.$nextTick();
    expect(wrapper.vm.focus).toBe(true);
    searchedOption.trigger('keydown.esc');
    expect(wrapper.vm.focus).toBe(false);
  });
  it('defers blur on blur of dropdown option', async () => {
    const option = {
      text: 'Value',
      value: 'value',
    };
    const wrapper = mount(IFCDropdown, {
      propsData: {
        name: 'IFCDropdown',
        closeAfterSelection: true,
        value: [
          option,
        ],
        options: [
          option,
          option,
        ],
        searchFn: (a, b) => true,
        calculateKey: (a, b) => a,
        optionSelectedFn: (a, b) => true,
        id: 'Test',
      },
    });
    const searchedOption = wrapper.find('button[data-dropdownoption="true"]');
    wrapper.vm.deferBlur = jest.fn();
    searchedOption.trigger('blur');
    expect(wrapper.vm.deferBlur).toHaveBeenCalled();
  });
  it('handles selection on dropdown option click', () => {
    const option = {
      text: 'Value',
      value: 'value',
    };
    const wrapper = mount(IFCDropdown, {
      propsData: {
        name: 'IFCDropdown',
        closeAfterSelection: true,
        value: [
          option,
        ],
        options: [
          option,
          option,
        ],
        searchFn: (a, b) => true,
        calculateKey: (a, b) => a,
        optionSelectedFn: (a, b) => true,
        id: 'Test',
      },
    });
    const searchedOption = wrapper.find('button[data-dropdownoption="true"]');
    wrapper.vm.handleSelection = jest.fn();
    searchedOption.trigger('click');
    expect(wrapper.vm.handleSelection).toHaveBeenCalledWith(option);
  });
  it('captures click of background', async () => {
    const option = {
      text: 'Value',
      value: 'value',
    };
    const wrapper = mount(IFCDropdown, {
      propsData: {
        name: 'IFCDropdown',
        closeAfterSelection: true,
        value: [
          option,
        ],
        options: [
          option,
          option,
        ],
        searchFn: (a, b) => true,
        calculateKey: (a, b) => a,
        optionSelectedFn: (a, b) => true,
        id: 'Test',
      },
    });
    const background = wrapper.find('div[data-background="true"]');
    wrapper.vm.captureFocus = jest.fn();
    await background.trigger('click');
    expect(wrapper.vm.captureFocus).toHaveBeenCalled();
  });
  it('captures focus for the input of the dropdown when captureFocus is called', async () => {
    const option = {
      text: 'Value',
      value: 'value',
    };
    const wrapper = mount(IFCDropdown, {
      propsData: {
        name: 'IFCDropdown',
        closeAfterSelection: true,
        value: [
          option,
        ],
        options: [
          option,
          option,
        ],
        searchFn: (a, b) => true,
        calculateKey: (a, b) => a,
        optionSelectedFn: (a, b) => true,
        id: 'Test',
      },
    });
    await wrapper.vm.$nextTick();
    wrapper.vm.$refs.input.focus = jest.fn();
    wrapper.vm.captureFocus();
    expect(wrapper.vm.$refs.input.focus).toHaveBeenCalled();
  });
  it('focuses the input of the dropdown when focusNext is called with a -1 index', async () => {
    const option = {
      text: 'Value',
      value: 'value',
    };
    const wrapper = mount(IFCDropdown, {
      propsData: {
        name: 'IFCDropdown',
        closeAfterSelection: true,
        value: [
          option,
        ],
        options: [
          option,
          option,
        ],
        searchFn: (a, b) => true,
        calculateKey: (a, b) => a,
        optionSelectedFn: (a, b) => true,
        id: 'Test',
      },
    });
    await wrapper.vm.$nextTick();
    wrapper.vm.$refs.input.focus = jest.fn();
    wrapper.vm.focusNext(-1, { preventDefault: jest.fn() });
    expect(wrapper.vm.$refs.input.focus).toHaveBeenCalled();
  });
  /**
   * We don't want multi line test names
   */
  /* eslint-disable-next-line max-len */
  it('focuses the first dropdown element of the dropdown when focusNext is called with an index greater than options.length',
    async () => {
      const option = {
        text: 'Value',
        value: 'value',
      };
      const wrapper = mount(IFCDropdown, {
        propsData: {
          name: 'IFCDropdown',
          closeAfterSelection: true,
          value: [
            option,
          ],
          options: [
            option,
            option,
          ],
          searchFn: (a, b) => true,
          calculateKey: (a, b) => a,
          optionSelectedFn: (a, b) => true,
          id: 'Test',
        },
      });
      await wrapper.vm.$nextTick();
      const element = wrapper.vm.$refs?.[wrapper.vm.calculateRef(0, wrapper.vm.shownOptions[0])]?.[0];
      element.focus = jest.fn();
      wrapper.vm.focusNext(100, { preventDefault: jest.fn() });
      expect(element.focus).toHaveBeenCalled();
    });
  it('handles input focus when the input isn\'t rendered',
    async () => {
      const option = {
        text: 'Value',
        value: 'value',
      };
      const wrapper = mount(IFCDropdown, {
        propsData: {
          name: 'IFCDropdown',
          closeAfterSelection: true,
          value: [
            option,
          ],
          options: [
            option,
            option,
          ],
          searchFn: (a, b) => true,
          calculateKey: (a, b) => a,
          optionSelectedFn: (a, b) => true,
          id: 'Test',
        },
      });
      await wrapper.vm.$nextTick();
      wrapper.vm.$refs.input = undefined;
      expect(wrapper.vm.focusNext(-1, { preventDefault: jest.fn() })).toBe(0);
    });
  it('sanely returns from focusNext when index is out of range',
    async () => {
      const option = {
        text: 'Value',
        value: 'value',
      };
      const wrapper = mount(IFCDropdown, {
        propsData: {
          name: 'IFCDropdown',
          closeAfterSelection: true,
          value: [
            option,
          ],
          options: [
            option,
            option,
          ],
          searchFn: (a, b) => true,
          calculateKey: (a, b) => a,
          optionSelectedFn: (a, b) => true,
          id: 'Test',
        },
      });
      await wrapper.vm.$nextTick();
      wrapper.vm.$refs.input = undefined;
      expect(wrapper.vm.focusNext(-2, { preventDefault: jest.fn() })).toBe(0);
    });
});
