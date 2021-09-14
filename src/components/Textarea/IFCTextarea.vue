<template>
<div class="IFCTextArea">
  <div class="IFCTextArea__endcapAndInputContainer">
    <div class="IFCTextArea__endcapContainer">
      <slot name="front-endcap">

      </slot>
    </div>
    <div class="IFCTextArea__formContainer">
      <div class="IFCTextArea__labelContainer">
        <div :class="computedLeftBorderClass" />
        <div
          :class="computedLabelBorderClass"
          :style="computedLabelStyle"
          ref="labelContainer"
        >
          <label :id="computedLabelId" :for="computedName">
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
      <textarea
        class="IFCTextArea__textarea"
        ref="input"
        :style="computedStyle"
        :name="name"
        :id="computedName"
        :cols="cols"
        :rows="rows"
        :value="value"
        :required="required"
        :autofocus="autofocus"
        :dark="dark"
        :state="state"
        :aria-required="required"
        :autocomplete="autocomplete"
        :pattern="pattern"
        :minlength='minlength'
        :maxlength="maxlength"
        :aria-labelledby="computedAriaLabeledBy"
        :aria-placeholder="placeholder"
        :placeholder="placeholder"
        :disabled="disabled"
        :readonly="readonly"
        @blur="handleTextareaBlur()"
        @focus="handleTextareaFocus()"
        @input="$emit('input', $event.target.value)"
        @keydown.enter="updateTextAreaHeight()"
        @change="$emit('change', $event.target.value)" />
    </div>
    <div class="IFCTextArea__endcapContainer">
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
import {
  DEFAULT,
  ERROR,
  SUCCESS,
  VALID_STATES,
} from '@Components/Input/config.js';
import { IFCSpan } from '@Components/Text/IFCSpan.vue';
import { FloatingLabelMixin } from '@Components/mixins.js';

export const IFCTextarea = {
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
      textAreaHeight: 0,
      verticalTextAreaPadding: 4,
      observer: null,
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
     * Whether dark mode is enabled or not
     */
    dark: {
      type: Boolean,
      default: false,
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
      default: '',
    },

    /**
     * How many columns this textarea should have
     */
    cols: {
      type: Number,
      required: false,
      default: null,
    },

    /**
     * How many rows this textarea should have
     */
    rows: {
      type: Number,
      required: false,
      default: null,
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
    },
  },
  watch: {
    focus() {
      this.$forceUpdate();
    },
    value(newVal, oldVal) {
      if (newVal !== oldVal) {
        this.$forceUpdate();
      }
    },
  },
  mounted() {
    this.updateTextAreaHeight();
  },
  methods: {
    /**
     * @function updateTextAreaHeight()
     * @listens onenter of textarea
     * Increases text area height
     */
    updateTextAreaHeight() {
      this.textAreaHeight = this.$refs.input.scrollHeight + this.verticalTextAreaPadding;
    },

    /**
     * @function handleTextareaBlur
     * @emits blur
     * @listens onblur of textarea
     * Sets focus to false to collapse label if value is falsey,
     */
    handleTextareaBlur() {
      this.$emit('blur');
      this.focus = false;
    },

    /**
     * @function handleTextareaFocus
     * @emits focus
     * @listens onfocus of textarea
     * Sets focus to true to expand label, emits focus
     */
    handleTextareaFocus() {
      this.$emit('focus');
      this.focus = true;
    },
  },
  computed: {
    baseClass() {
      return 'IFCTextArea';
    },
    computedStyle() {
      return {
        height: `${this.textAreaHeight}px`,
      };
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
    computedName() {
      /**
       * Disabled next line because _uid is an internal variable of Vue, so we can't control the naming convention
       */
      /* eslint-disable-next-line no-underscore-dangle */
      return this.id ? this.id : `${this.name}-${this._uid}`;
    },
  },
};
export default IFCTextarea;
</script>

<style lang="scss">
@import './textarea.scss';
</style>
