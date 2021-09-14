<template>
  <span v-bind="$props" v-on="$listeners" :class="computedClass" :style="computedStyle">
    <slot></slot>
  </span>
</template>

<script>

export const IFCSpan = {
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
      return 'IFCSpan';
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

export default IFCSpan;
</script>

<style lang='scss'>
@use './text.scss' as text;
@include text.Span;
</style>
