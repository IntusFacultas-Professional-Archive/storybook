<template>
  <div class="IFCPageSelector" ref="outsidecontainer">
    <IFCButton
      class="IFCPageSelector__button"
      variant="transparent" role="button" ref="left" @click="handleLeftClick()">
      <IFCScreenReaderText>Go back one page</IFCScreenReaderText>
      <Left />
    </IFCButton>
    <div class="IFCPageSelector__container" :ref="`${nonCollapseRefPrefix}`">
      <input
        class="IFCPageSelector__input"
        @focus="openDropdown"
        @change="handleInput($event)"
        @keydown.tab="skipDropdown"
        @keydown.down="$event.preventDefault()"
        @keydown.up="$event.preventDefault()"
        @keyup.down="focus(0)"
        @keyup.up="focus(computedPages.length - 1)"
        :ref="`${nonCollapseRefPrefix}input`"
        tabindex="0"
        :value="value"
        step="0"
        aria-label="Input a page or use up and down arrow keys to select a page from the dropdown.
                  Use tab to skip the dropdown"
        type="number" />
      <div
        class="IFCPageSelector__dropdown"
        :style="computedStyle"
        v-show="clickOffDependantContainerOpen"
        :ref="`${nonCollapseRefPrefix}`"
      >
        <IFCButton
          class="IFCPageSelector__button"
          variant="transparent"
          v-for="(page, index) in computedPages"
          :key="page"
          @keydown.tab="skipDropdown"
          @keyup.down="focus(index === computedPages.length - 1 ? 0 : index + 1)"
          @keyup.up="focus(index === 0 ? computedPages.length - 1 : index - 1)"
          @click="$emit('change', page); $emit('input', page);"
          :ref="`${nonCollapseRefPrefix}${index}`"
          block>
          {{page}}
        </IFCButton>
      </div>
    </div>
    <IFCButton
      class="IFCPageSelector__button"
      variant="transparent" role="button" ref="right" @click="handleRightClick()">
      <IFCScreenReaderText>Go forward one page</IFCScreenReaderText>
      <Right />
    </IFCButton>
  </div>
</template>

<script>
import { IFCScreenReaderText } from '@Components/Text/IFCScreenReaderText.vue';
import { CollapseWhenOffClickedMixin } from '@Components/mixins.js';
import { IFCButton } from '@Components/Button/IFCButton.vue';
import Left from './icons/Left.vue';
import Right from './icons/Right.vue';

const MENU_HEIGHT_IN_PIXELS = 150;
const MENU_WIDTH_IN_PIXELS = 100;

export const IFCPageSelector = {
  data() {
    return {
      distanceFromBottom: -1,
      distanceFromLeft: -1,
      MENU_SIZE: MENU_HEIGHT_IN_PIXELS,
      MENU_WIDTH: MENU_WIDTH_IN_PIXELS,
      nonCollapseRefPrefix: 'dropdown-',
    };
  },
  mixins: [CollapseWhenOffClickedMixin],
  components: {
    Left,
    Right,
    IFCButton,
    IFCScreenReaderText,
  },
  props: {
    /**
     * The current page
     */
    value: {
      type: Number,
      required: true,
    },

    /**
     * The available pages or the max number of pages
     */
    pages: {
      type: [Array, Number],
      validator(value) {
        return (Array.isArray(value) && !value.some((v) => Number.isNaN(Number(v)))) || !Number.isNaN(Number(value));
      },
      required: true,
    },
  },
  methods: {

    handleInput(event) {
      let { value } = event.target;
      value = Number(value);
      const minimum = Array.isArray(this.pages) ? this.pages[0] : 1;
      const maximum = Array.isArray(this.pages) ? this.pages[this.pages.length - 1] : this.pages;
      value = value > maximum ? maximum : value;
      value = value < minimum ? minimum : value;
      if (Array.isArray(this.pages) && !this.pages.includes(value)) {
        // grab nearest value.
        const diffs = this.pages.slice().map((page) => Math.abs(page - value)).reduce((acc, cur, idx) => {
          if (acc.diff > cur) {
            acc.diff = cur;
            acc.index = idx;
          }
          return acc;
        }, { diff: Number.POSITIVE_INFINITY, index: -1 });
        value = this.pages[diffs.index];
      }
      if (value !== event.target.value) {
        this.$forceUpdate();
      }
      this.$emit('change', value);
      this.$emit('input', value);
    },

    /**
     * @function handleLeftClick
     * @listens onclick of left button
     */
    handleLeftClick() {
      let newValue;
      if (Array.isArray(this.pages)) {
        newValue = this.pages?.[this.pages.indexOf(this.value) - 1] ?? this.pages[0];
      } else {
        newValue = this.value - 1 < 1 ? 1 : this.value - 1;
      }
      this.$emit('change', newValue);
      this.$emit('input', newValue);
    },

    /**
     * @function handleRightClick
     * @listens onclick of right button
     */
    handleRightClick() {
      const max = Array.isArray(this.pages) ? this.pages[this.pages.length - 1] : this.pages;
      const newValue = Array.isArray(this.pages)
        ? (this.pages?.[this.pages.indexOf(this.value) + 1] ?? this.pages[this.pages.length - 1])
        : Math.min(this.value + 1, max);
      this.$emit('change', newValue);
      this.$emit('input', newValue);
    },

    /**
     * @function checkPositionOnScreen
     * @listens onfocus of input
     * Sets the distanceFromBottom variable to keep track of how far from the bottom of the viewport the searchbar
     */
    checkPositionOnScreen() {
      /**
       * This magic number exists because we have no easy way of determining the size of our internal dropdown options
       * but as the developer we roughly know the size. So in order to determine whether we have sufficient clearance
       * underneath, or whether we need to open above, we multiply our shownOptions length by the average element height
       * to get out needed size.
       */
      if (typeof this?.$refs?.outsidecontainer?.getBoundingClientRect !== 'undefined') {
        this.distanceFromTop = this?.$refs?.outsidecontainer?.getBoundingClientRect()?.top;
        this.distanceFromLeft = this?.$refs?.outsidecontainer?.getBoundingClientRect()?.left;
      }

      this.distanceFromBottom = window.innerHeight - this.distanceFromTop;
    },

    /**
     * @function openDropdown
     * @listens onfocus of input
     * Opens the dropdown and sets up the detection for clicking off the dropdown
     */
    openDropdown() {
      this.checkPositionOnScreen();
      this.openClickOffDependantContainer();
    },

    /**
     * @function skipDropdown
     * @param {WindowEvent} event
     * @listens keydown.tab of input
     * We don't want tab to enter the dropdown in case there are a lot of pages (which would trap keyboard users)
     * So we skip the dropdown for tab events. The user should use arrow keys instead to enter the dropdown.
     */
    skipDropdown(event) {
      event.preventDefault();
      this.clickOffDependantContainerOpen = false;

      /**
       * Disabled because we are actually doing something on the next line, but eslint doesn't
       * recognize that.
       */
      /* eslint-disable-next-line no-unused-expressions */
      event.shiftKey ? this.$refs.left.$el.focus() : this.$refs.right.$el.focus();
    },

    /**
     * @function focus
     * @listens keydown.down of input or button
     */
    focus(index) {
      this.$refs[`dropdown-${index}`][0].$el.focus();
    },
  },
  computed: {
    computedStyle() {
      return {
        'max-height': `${this.MENU_SIZE}px`,
        [this.distanceFromBottom < this.MENU_SIZE ? 'bottom' : 'top']: '100%',
        [this.distanceFromLeft < this.MENU_WIDTH ? 'left' : 'right']: 0,
      };
    },
    computedPages() {
      return Array.isArray(this.pages)
        ? this.pages : Array.from(new Array(this.pages).keys()).map((el) => el + 1);
    },
  },
};

export default IFCPageSelector;
</script>

<style lang="scss">
@import './pageSelector.scss';
</style>
