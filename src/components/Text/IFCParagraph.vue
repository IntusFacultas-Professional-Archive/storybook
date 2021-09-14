<template>
  <p v-on="$listeners" v-bind="$props" :class="computedClass" :style="computedStyle">
    <slot></slot>
  </p>
</template>

<script>

export const IFCParagraph = {
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
     * Whether the paragraph should be marginless
     */
    marginless: {
      type: Boolean,
      default: false,
    },

  },
  computed: {
    baseClass() {
      return 'IFCParagraph';
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

export default IFCParagraph;
</script>

<style lang='scss'>
@use './_text.scss' as text;
@include text.Paragraph;
</style>
