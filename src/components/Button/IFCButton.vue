<template>
  <button
    :class="computedClass"
    :style="computedStyle"
    v-on="$listeners"
    v-bind="$props">
    <slot></slot>
  </button>
</template>

<script>

export const IFCButton = {
  props: {

    /**
     * What height and width the circular button should be.
     */
    height: {
      type: Number,
      default: 40,
    },

    /**
     * Whether the button should be a circle
     */
    circle: {
      type: Boolean,
      default: false,
    },

    /**
     * Whether to style this button as an endcap for an input
     */
    endcap: {
      type: Boolean,
      default: false,
      required: false,
    },

    /**
     * What type of button to display (primary, error, etc.)
     */
    variant: {
      type: String,
      required: true,
    },

    /**
     * Whether the button should fill the full size of the container or only fill to meet the inner contents
     */
    block: {
      type: Boolean,
      default: false,
    },

    /**
     * The size of the button
     */
    size: {
      type: String,
      default: 'md',
    },

    /**
     * Where to align the text in the button
     */
    textAlign: {
      type: String,
      default: 'center',
    },

    /**
     * You can override the color of text and SVG fills if necessary with this.
     */
    colorOverride: {
      type: String,
      default: null,
    },
  },
  computed: {
    baseClass() {
      return 'IFCButton';
    },
    computedClass() {
      return {
        [this.baseClass]: true,
        [`${this.baseClass}--${this.size}`]: true,
        [`${this.baseClass}--${this.variant}`]: true,
        [`${this.baseClass}--block`]: this.block,
        [`${this.baseClass}--circle`]: this.circle,
        [`${this.baseClass}--endcap`]: this.endcap,

      };
    },
    computedStyle() {
      return {
        '--IFC-button-circle-dimension': `${this.height}px`,
        '--IFC-button-text-align': this.textAlign,
        '--IFC-button-color-override': this.colorOverride,
      };
    },
  },
};

export default IFCButton;
</script>

<style lang="scss">
@import './button.scss';
</style>
