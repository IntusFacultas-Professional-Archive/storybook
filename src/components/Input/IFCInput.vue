<template>
<div class="IFCInput">
  <div class="IFCInput__endcapAndInputContainer">
    <div class="IFCInput__endcapContainer">
      <slot name="front-endcap">

      </slot>
    </div>
    <div class="IFCInput__formContainer">
      <div class="IFCInput__labelContainer">
        <div :class="computedLeftBorderClass" />
        <div
          :class="computedLabelBorderClass"
          :style="computedLabelStyle"
          ref="labelContainer"
        >
          <label :id="computedLabelId" :for="computedId">
            <slot name="label"></slot>
            <span v-if="readonly">(Read only)</span>
          </label>
        </div>
        <div :class="computedRightBorderClass" />
        <div :class="computedSVGClass">
          <Correct v-if="state === SUCCESS"/>
          <Wrong v-else-if="state === ERROR"/>
        </div>
      </div>
      <input class="IFCInput__input"
        ref="input"
        :name="name"
        :id="computedId"
        :type="type"
        :value="value"
        :required="required"
        :autofocus="autofocus"
        :state="state"
        :aria-required="required"
        :max='max'
        :min='min'
        :step="step"
        :autocomplete="autocomplete"
        :pattern="pattern"
        :minlength='minlength'
        :maxlength="maxlength"
        :aria-labelledby="computedAriaLabeledBy"
        :aria-placeholder="placeholder"
        :placeholder="placeholder"
        :disabled="disabled"
        :readonly="readonly"
        @blur="handleInputBlur()"
        @focus="handleInputFocus()"
        @input="$emit('input', $event.target.value)"
        @change="$emit('change', $event.target.value)" />
    </div>
    <div class="IFCInput__endcapContainer">
      <slot name="endcap">

      </slot>
    </div>
  </div>
  <slot name="microcopy">
    <IFCSpan>
      {{defaultMinMaxMicrocopy}}
    </IFCSpan>
  </slot>
</div>
</template>

<script>
import Correct from '@Components/Input/icons/Correct.vue';
import Wrong from '@Components/Input/icons/Wrong.vue';
import { FloatingLabelMixin } from '@Components/mixins.js';
import { IFCSpan } from '@Components/Text/IFCSpan.vue';
import {
  DEFAULT,
  ERROR,
  SUCCESS,
  VALID_INPUT_TYPES,
  VALID_STATES,
} from './config.js';

export const IFCInput = {
  components: {
    Correct,
    Wrong,
    IFCSpan,
  },
  data() {
    return {
      DEFAULT,
      ERROR,
      SUCCESS,
      focus: false,
    };
  },
  mixins: [FloatingLabelMixin],
  props: {
    /**
     * The name of the input. Used to generate the input label :for attribute as well.
     */
    name: {
      type: String,
      required: true,
    },

    /**
     * The id of the input. Used to generate the input label :for attribute as well.
     */
    id: {
      type: String,
      required: false,
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
     * Whether the input should be autofocused or not
     */
    autocomplete: {
      type: String,
      required: false,
      default: '',
    },

    /**
     * Whether the input should be labeled required or not
     */
    required: {
      type: Boolean,
      default: false,
      required: false,
    },

    /**
     * Whether the input is readonly or not
     */
    readonly: {
      type: Boolean,
      required: false,
      default: false,
    },

    /**
     * The pattern input must match
     */
    pattern: {
      type: String,
      required: false,
      default: undefined,
    },

    /**
     * The max value a number input can receive
     */
    max: {
      type: Number,
      required: false,
      default: undefined,
    },

    /**
     * The step value a number input can receive
     */
    step: {
      type: Number,
      required: false,
      default: undefined,
    },

    /**
     * The min value a number input can receive
     */
    min: {
      type: Number,
      required: false,
      default: undefined,
    },

    /**
     * The min length the input should have
     */
    minlength: {
      type: Number,
      required: false,
      default: undefined,
    },

    /**
     * The max length the input can have
     */
    maxlength: {
      type: Number,
      required: false,
      default: undefined,
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
     * What elements label this input (the label is already handled by default. Use this for additional labels)
     */
    ariaLabeledBy: {
      type: [String, Array],
      required: false,
      default: '',
    },

    /**
     * What placeholder text should be present on the input
     */
    placeholder: {
      type: String,
      required: false,
      default: null,
    },

    /**
     * What type of input this is. Options are 'text', 'number', 'password', 'email', 'hidden'
     */
    type: {
      type: String,
      required: true,
      default: 'text',
      validator(value) {
        return VALID_INPUT_TYPES.includes(value);
      },
    },

    /**
     * What state the input is in (options are default, error, success)
     */
    state: {
      type: String,
      required: false,
      default: 'default',
      validator(value) {
        return VALID_STATES.includes(value);
      },
    },

    /**
     * The value the input has
    */
    value: {
      type: [String, Number],
      required: true,
      default: '',
    },
  },
  watch: {
    focus() {
      this.$forceUpdate();
    },
    value(newVal, oldVal) {
      if (Boolean(newVal) !== Boolean(oldVal)) {
        this.$forceUpdate();
      }
    },
  },
  methods: {

    /**
     * @function handleInputFocus
     * @listens onfocus of input
     * @emits focus
     * Sets focus to true to float the label up and emits focus.
     */
    handleInputFocus() {
      this.$emit('focus');
      this.focus = true;
    },

    /**
     * @function handleInputBlur
     * @listens onblur of input
     * @emits blur
     * Sets focus to false so that label drops back down if value is empty
     */
    handleInputBlur() {
      this.$emit('blur');
      this.focus = false;
    },
  },
  computed: {
    baseClass() {
      return 'IFCInput';
    },

    defaultMinMaxMicrocopy() {
      if (this.minlength && this.value.length < this.minlength) {
        return this.calculatedRequired;
      }
      if (this.maxlength) {
        return this.calculatedRemaining;
      }
      return '';
    },
    calculatedRemaining() {
      if (this.value.length > this.maxlength) {
        const over = this.value.length - this.maxlength;
        return `${over} character${over !== 1 ? 's' : ''} over maximum length.`;
      }
      const remaining = this.maxlength - this.value.length;
      return `${remaining} more character${remaining !== 1 ? 's' : ''} allowed.`;
    },
    calculatedRequired() {
      const left = this.minlength - this.value.length;
      return `${left} more character${left !== 1 ? 's' : ''} required.`;
    },
    /**
     * Computes the complete aria-labelled-by attribute
     */
    computedAriaLabeledBy() {
      const consumerProvidedAriaLabel = Array.isArray(this.ariaLabeledBy)
        ? this.ariaLabeledBy.join(' ') : this.ariaLabeledBy;
      return `${consumerProvidedAriaLabel ? `${consumerProvidedAriaLabel} ` : ''}${this.computedLabelId}`;
    },
    computedLabelId() {
      /**
       * Disabled next line because _uid is an internal variable of Vue, so we can't control the naming convention
       */
      /* eslint-disable-next-line no-underscore-dangle */
      return `label-${this.name}-${this._uid}`;
    },
    computedId() {
      /**
       * Disabled next line because _uid is an internal variable of Vue, so we can't control the naming convention
       */
      /* eslint-disable-next-line no-underscore-dangle */
      return this.id ?? `${this.name}-${this._uid}`;
    },
  },
};
export default IFCInput;
</script>

<style lang='scss'>
@import './input.scss';
</style>
