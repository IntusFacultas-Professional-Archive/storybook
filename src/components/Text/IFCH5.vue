<template>
  <h5 v-on="$listeners" v-bind="$props" :class="computedClass" :style="computedStyle">
    <slot></slot>
  </h5>
</template>

<script>

export const IFCH5 = {
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

    /**
     * Whether the element should have no margins
     */
    marginless: {
      type: Boolean,
      default: false,
    },
  },
  computed: {
    baseClass() {
      return 'IFCH5';
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
        [`${this.baseClass}--marginless`]: this.marginless,
      };
    },
  },
};

export default IFCH5;
</script>

<style lang='scss'>
@use './_text.scss' as text;
@include text.H5;
</style>
