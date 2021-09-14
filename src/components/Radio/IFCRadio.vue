<template>
  <label :class="computedClass" :for="computedID">
    <div :class="computedCircleClass" :variant="variant" :checked="checked" />
    <input class="IFCRadio__input"
      :id="computedID"
      :name="name"
      tabindex="0"
      type="radio"
      :aria-checked="checked"
      :value="value"
      @change="$emit('change', value)"
      :checked="checked"/>
    <slot></slot>
  </label>
</template>

<script>

export const IFCRadio = {
  props: {
    /**
     * What variant to use. You can use any color defined in the theme
     */
    variant: {
      type: String,
      default: 'primary',
    },

    /**
     * The id of the radio input. We will generate one off the name if this is not provided.
     */
    id: {
      type: String,
      default: '',
    },

    /**
     * The value to be emitted when a user checks this radio button
     */
    value: {
      type: [String, Object, Number, Array],
      required: true,
    },

    /**
     * Whether this radio button is checked
     */
    checked: {
      type: Boolean,
      default: false,
    },

    /**
     * The name of the radio input
     */
    name: {
      type: String,
      required: true,
    },
  },
  computed: {
    computedID() {
      /**
       * Disabled because _uid is a Vue internal variable. We have no control over it.
       */
      /* eslint-disable-next-line no-underscore-dangle */
      return this.id || `${this.name}-${this._uid}`;
    },
    baseClass() {
      return 'IFCRadio';
    },
    computedCircleClass() {
      return {
        [`${this.baseClass}__circle`]: true,
        [`${this.baseClass}__circle--${this.variant}`]: true,
        [`${this.baseClass}__circle--${this.variant}--checked`]: this.checked,
      };
    },
    computedClass() {
      return {
        [this.baseClass]: true,
        [`${this.baseClass}--${this.variant}`]: true,
        [`${this.baseClass}--${this.variant}--checked`]: this.checked,
      };
    },
  },
};

export default IFCRadio;
</script>

<style lang='scss'>
@import './radio.scss';
</style>
