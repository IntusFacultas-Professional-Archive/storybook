import { VALID_STATES } from '@Components/Input/config.js';

export const DropdownMixin = {
  props: {
    /**
     * The name of the input. Used to generate the input label :for attribute as well.
     */
    name: {
      type: String,
      required: true,
    },

    /**
     * Whether the dropdown should close after single selection.
     */
    closeAfterSelection: {
      type: Boolean,
      default: false,
    },

    /**
     * The id of the input. Used to generate the input label :for attribute as well.
     */
    id: {
      type: String,
      required: false,
    },

    /**
     * Whether the input is disabled or not
     */
    disabled: {
      type: Boolean,
      required: false,
      default: false,
    },

    /**
     * Whether the input is disabled or not
     */
    readonly: {
      type: Boolean,
      required: false,
      default: false,
    },

    /**
     * Whether the input should be autofocused or not
     */
    autofocus: {
      type: Boolean,
      required: false,
      default: false,
    },

    /**
     * What state the input is in (options are default, error, success)
     */
    state: {
      type: String,
      required: false,
      default: VALID_STATES.default,
      validator(value) {
        return VALID_STATES.includes(value);
      },
    },

    /**
     * What elements label this input (the label is already handled by default. Use this for additional labels)
     */
    ariaLabeledBy: {
      type: [String, Array],
      required: false,
      default: '',
    },

    /**
     * The value the input has
    */
    value: {
      type: Array,
      required: true,
    },

    /**
     * The options to be displayed
     */
    options: {
      type: Array,
      required: true,
    },

    /**
     * When a user searches for a value, this function will be used to determine what to display.
     * Must accept (searchedValue, object) as parameters, and return true if matches or false otherwise.
     */
    searchFn: {
      type: Function,
      required: true,
      validator(value) {
        return value.length === 2;
      },
    },

    /**
     * This is used to determine which options in the dropdown are already selected. Must accept an object and
     * the values array as parameters and return true if selected and false otherwise. (the way this will be used
     * is to determine whether an option in options exists in value)
     */
    optionSelectedFn: {
      type: Function,
      required: true,
      validator(value) {
        return value.length === 2;
      },
    },

    /**
     * This is used to determine which options in the dropdown should be disabled. Must at least accept an object,
     * and return at true if disabled and false otherwise. By default, option and the value array are passed
     * as parameters.
     */
    optionDisabledFn: {
      type: Function,
      required: false,
      /**
       * Disabled because the validator expects at least one argument
       */
      /* eslint-disable-next-line no-unused-vars */
      default: (value) => false,
      validator(value) {
        return value.length >= 1;
      },
    },

    /**
     * This is used to determine which selected optionsshould be disabled. Must at least accept an object,
     * and return at true if disabled and false otherwise. By default, option and the value array are passed
     * as parameters.
     */
    valueDisabledFn: {
      type: Function,
      required: false,
      /**
       * Disabled because the validator expects at least one argument
       */
      /* eslint-disable-next-line no-unused-vars */
      default: (value) => false,
      validator(value) {
        return value.length >= 1;
      },
    },

    /**
     * This is used to calculate the key for options and values on interation. You can override this to provide
     * a custom key, which can help with performance. By default, the dropdown uses the index since it knows
     * nothing about the options. This component will call the function passing the index and object arguments.
     */
    calculateKey: {
      type: Function,
      required: false,
      /**
       * Disabled because the validator expects at least 2 arguments
       */
      /* eslint-disable-next-line no-unused-vars */
      default: (index, obj) => (index),
      validator(value) {
        return value.length >= 2;
      },
    },
  },
};

export default DropdownMixin;
