<template>
  <span :class="computedClass">
    <slot></slot>
  </span>
</template>

<script>
import { STATE_MAP } from '@Components/Input/config.js';

export const IFCCap = {
  props: {
    front: {
      type: Boolean,
      default: false,
      required: false,
    },
    end: {
      type: Boolean,
      default: false,
      required: false,
    },
  },
  watch: {
    'inputParent.state': {
      handler() {
        this.$forceUpdate();
      },
    },
    'inputParent.disabled': {
      handler() {
        this.$forceUpdate();
      },
    },
    'inputParent.focus': {
      handler() {
        this.$forceUpdate();
      },
    },
  },
  computed: {
    inputParent() {
      return this?.$parent ?? {};
    },
    state() {
      return this.inputParent?.state ?? STATE_MAP.default;
    },
    disabled() {
      return this.inputParent?.disabled ?? false;
    },
    focus() {
      return this.inputParent?.focus ?? false;
    },
    baseClass() {
      return 'IFCCap';
    },
    endCap() {
      return this.end || !this.front;
    },
    computedClass() {
      return {
        [`${this.baseClass}`]: true,
        [`${this.baseClass}--${this.state}`]: true,
        [`${this.baseClass}--disabled`]: this.disabled,
        [`${this.baseClass}--focus`]: this.focus,
        [`${this.baseClass}--front`]: !this.endCap,
        [`${this.baseClass}--end`]: this.endCap,
      };
    },
  },
};

export default IFCCap;
</script>

<style lang="scss">
@import './cap.scss';
</style>
