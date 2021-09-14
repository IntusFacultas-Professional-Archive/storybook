<template>
  <small v-on="$listeners" v-bind='$props' :class="computedClass" :style="computedStyle">
    <slot></slot>
  </small>
</template>

<script>

export const IFCSmall = {
  props: {
    /**
     * Whether the text should be bolded
     */
    bold: {
      type: Boolean,
      default: false,
    },

    /**
     * Font size override
     */
    size: {
      type: Number,
      default: null,
    },

    /**
     * Font color override
     */
    color: {
      type: String,
      default: null,
    },

  },
  computed: {
    baseClass() {
      return 'IFCSmall';
    },
    computedStyle() {
      const style = {};
      if (this.color !== null) {
        style.color = this.color;
      }
      if (this.size !== null) {
        style['font-size'] = `${this.size}px`;
      }
      return style;
    },
    computedClass() {
      return {
        [this.baseClass]: true,
        [`${this.baseClass}--bold`]: this.bold,
      };
    },
  },
};

export default IFCSmall;
</script>

<style lang='scss'>
@use './_text.scss' as text;
@include text.Small;
</style>
