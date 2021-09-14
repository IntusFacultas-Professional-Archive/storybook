<template>
  <span :class="computedClass">
    <slot></slot>
  </span>
</template>

<script>

export const IFCScreenReaderText = {
  props: {
    /**
     * Whether the text should be made visible again
     */
    show: {
      type: Boolean,
      default: false,
    },

  },
  computed: {
    baseClass() {
      return 'IFCScreenReaderText';
    },
    computedClass() {
      return {
        [this.baseClass]: true,
        [`${this.baseClass}--shown`]: this.show,
      };
    },
  },
};

export default IFCScreenReaderText;
</script>

<style lang='scss'>
@use './_text.scss' as text;
@include text.ScreenReader;
</style>
