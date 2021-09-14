<template>
  <div class="IFCButtonGroup" :class="{'IFCButtonGroup--block': block}">
    <slot></slot>
  </div>
</template>

<script>
export const IFCButtonGroup = {
  props: {
    block: {
      type: Boolean,
      default: false,
    },
  },
};

export default IFCButtonGroup;
</script>

<style lang="scss">
@import './buttonGroup.scss';
</style>
