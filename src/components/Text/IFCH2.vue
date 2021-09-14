<template>
  <h2 v-on="$listeners" v-bind="$props" :class="computedClass" :style="computedStyle">
    <slot></slot>
  </h2>
</template>

<script>

export const IFCH2 = {
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
      return 'IFCH2';
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

export default IFCH2;
</script>

<style lang='scss'>
@use './_text' as text;
@include text.H2;
</style>
