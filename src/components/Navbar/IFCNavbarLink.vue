<template>
  <li class="IFCNavbarLink">
    <a class="IFCNavbarLink__link" :style="computedStyle" role="navigation" v-bind="$props" tabindex="0">
      <slot></slot>
    </a>
  </li>
</template>

<script>

export const IFCNavbarLink = {
  props: {
    /**
     * The color of the text
     */
    color: {
      type: String,
      default: 'white',
    },
  },
  computed: {
    computedStyle() {
      return {
        color: `${this.color} !important`,
      };
    },
  },
};
export default IFCNavbarLink;
</script>
