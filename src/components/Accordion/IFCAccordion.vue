<template>
  <div class="IFCAccordion__container">
    <div class="IFCAccordion__titleArea" :class="computedTitleClass">
      <slot name="title"></slot>
    </div>
    <div class="IFCAccordion__expander" :style="computedCollapseStyle" ref="content" :tabindex="!open ? -1 : null">
      <slot></slot>
    </div>
  </div>
</template>

<script>

export const IFCAccordion = {
  data() {
    return {
      defaultClosed: false,
      open: true,
    };
  },
  watch: {
    openState(newVal) {
      if (newVal !== this.open) {
        if (newVal) {
          this.expandSection();
        } else {
          this.collapseSection();
        }
      }
    },
  },
  props: {
    /**
     * Whether a small underline separating the title area from the content area should be included.
     * You can always style the title area however you like, but this is useful if you want a minimalist solution
     */
    underlined: {
      type: Boolean,
      default: false,
    },

    /**
     * Whether this section should be opened or closed. Used to define initial state, and can be used to
     * programmatically trigger an open or close by the parent by changing the value. true maps to open.
     * false maps to closed
     *
     */
    openState: {
      type: Boolean,
      default: true,
    },
  },
  mounted() {
    if (!this.openState) {
      this.defaultClosed = true;
      this.open = this.openState;
    }
  },
  methods: {
    /**
     * @function collapseSection
     * CSS cannot transition from auto height to a fixed height. The engine cannot calculate the appropriate
     * intermediary keyframes for that kind of transition so the height change snaps rather than smoothly transitions.
     * In order to fix this problem, we have to manually set the height to the scroll height (the minimum height needed
     * to contain the content), set overflow to hidden (so that the transitioning height can "hide" the content) then
     * wait until the next animationframe, then set the height to 0 to cause the collapse.
     */
    collapseSection() {
      this.open = false;
      this.$emit('toggle', this.open);
      const element = this.$refs.content;
      const sectionHeight = element.scrollHeight;
      // temporarily disable all css transitions
      const elementTransition = element.style.transition;
      element.style.transition = '';
      element.style.height = `${sectionHeight}px !important`;
      element.style.overflow = 'hidden';

      // on the next frame (as soon as the previous style change has taken effect),
      // explicitly set the element's height to its current pixel height, so we
      // aren't transitioning out of 'auto'
      requestAnimationFrame(() => {
        element.style.height = `${sectionHeight}px`;
        element.style.transition = elementTransition;

        // on the next frame (as soon as the previous style change has taken effect),
        // have the element transition to height: 0
        requestAnimationFrame(() => {
          element.style.height = `${0}px`;
        });
      });
    },

    /**
     * @function expandSection
     * CSS cannot transition from 0 height to auto height. The engine cannot calculate the appropriate
     * intermediary keyframes for that kind of transition so the height change snaps rather than smoothly transitions.
     * In order to fix this problem, we have to manually set the height to the scroll height (the minimum height needed
     * to contain the content), set overflow to hidden (so that the transitioning height can "reveal" the content) then
     * wait until the next animationframe, then set the height to auto after the animation concludes so that the
     * accordion can expand as normal if the interior contents change post animation..
     */
    expandSection() {
      this.open = true;
      this.$emit('toggle', this.open);
      const element = this.$refs.content;
      const sectionHeight = element.scrollHeight;
      // have the element transition to the height of its inner content
      element.style.height = `${sectionHeight}px`;
      element.style.overflow = 'hidden';

      // when the next css transition finishes (which should be the one we just triggered)
      element.addEventListener('transitionend', () => {
        // remove this event listener so it only gets triggered once
        element.removeEventListener('transitionend', this);
        if (this.open) {
          element.style.height = 'auto';
          element.style.overflow = '';
        }
      });
    },
  },
  computed: {
    computedTitleClass() {
      return this.underlined ? ['IFCAccordion__titleArea--underlined'] : [];
    },
    computedCollapseStyle() {
      return this.defaultClosed ? {
        height: '0px',
        overflow: 'hidden',
      } : {};
    },
  },
};

export default IFCAccordion;
</script>

<style lang="scss">
@import './accordion.scss';
</style>
