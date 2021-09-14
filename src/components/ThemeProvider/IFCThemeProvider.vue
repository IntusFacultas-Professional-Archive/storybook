<template>
  <div :class="activeTheme">
    <slot></slot>
  </div>
</template>

<script>

export const IFCThemeProvider = {
  props: {
    /**
     * Whether dark mode is enabled
     */
    dark: {
      type: Boolean,
      default: false,
      required: false,
    },
  },
  computed: {
    activeTheme() {
      return this.dark ? 'theme--dark' : 'theme--default';
    },
  },
};
export default IFCThemeProvider;
</script>

<style lang="scss">
@import './theme.scss';
</style>
