<template>
  <nav :class="computedClass" :style="computedStyle">
    <div class="IFCNavbar__externalContainer" >
      <div class="IFCNavbar__titleContainer">
        <slot name="title"></slot>
      </div>
      <div class="IFCNavbar__contentContainer" :style="hiddenAtBreakpoint">
        <div class="IFCNavbar__content">
          <slot name="left"></slot>
        </div>
        <div class="IFCNavbar__content">
          <slot name="middle"></slot>
        </div>
        <div class="IFCNavbar__content">
          <slot name="right"></slot>
        </div>
      </div>
      <div class="IFCNavbar__buttonContainer" :style="buttonVisibleAtBreakpoint" :breakpoint="breakpoint">
        <button class="IFCNavbar__button" type="button" role="button" @click="handleToggle()">
          <IFCScreenReaderText>Expand Navbar</IFCScreenReaderText>
          <HamburgerMenu />
        </button>
      </div>
      <transition name="IFCNavbarBackdrop">
        <div class="IFCNavbar__backdrop" v-if="toggled" @click="handleToggle" />
      </transition>
      <transition name="IFCNavbarCollapse">
        <nav class="IFCNavbar--collapsed"
          :background="background"
          v-if="toggled"
          :ref="focusCaptureRef"
          aria-label="Navigation bar">
          <div class="IFCNavbar__buttonContainer IFCNavbar__buttonContainer--override">
            <button class="IFCNavbar__button" type="button" role="button" @click="handleToggle()">
              <IFCScreenReaderText>Collapse Navbar</IFCScreenReaderText>
              <HamburgerMenu />
            </button>
          </div>
          <ul class="IFCNavbar__collapsedContent">
            <slot name="left"></slot>
            <slot name="middle"></slot>
            <slot name="right"></slot>
          </ul>
        </nav>
      </transition>
    </div>
  </nav>
</template>

<script>
import { IFCScreenReaderText } from '@Components/Text/IFCScreenReaderText.vue';
import { BreakpointToggledMixin } from '@Components/mixins.js';
import HamburgerMenu from './icons/HamburgerMenu.vue';

export const IFCNavbar = {
  components: {
    HamburgerMenu,
    IFCScreenReaderText,
  },
  mixins: [BreakpointToggledMixin],
  data() {
    return {
      focusCaptureRef: 'collapsedNavbar',
    };
  },
  props: {
    /**
     * What background color the navbar is
     */
    background: {
      type: String,
      default: '#ffffff',
    },

    /**
     * Color of the fill for the collapsed button icon
     */
    buttonColor: {
      type: String,
      default: '#ffffff',
    },

    /**
     * Whether the navbar is sticky
     */
    sticky: {
      type: Boolean,
      default: false,
    },

    /**
     * How far from the top the navbar should stick.
     */
    top: {
      type: Number,
      default: 0,
    },

  },
  computed: {
    baseClass() {
      return 'IFCNavbar';
    },
    computedClass() {
      return {
        [this.baseClass]: true,
        [`${this.baseClass}--sticky`]: this.sticky,
      };
    },
    hiddenAtBreakpoint() {
      const style = {};
      if (this.breakpointTriggered) {
        style.display = 'none';
      }
      return style;
    },
    buttonVisibleAtBreakpoint() {
      return this.breakpointTriggered ? {
        display: 'flex',
        'justify-content': 'flex-end',
        flex: 1,
      } : {};
    },
    computedStyle() {
      return {
        '--IFC-navbar-color': this.background,
        '--IFC-navbar-top': `${this.top}px`,
        '--IFC-navbar-button-color': this.buttonColor,
        '--IFC-navbar-breakpoint': `${this.breakpoint}px`,
      };
    },
  },
};

export default IFCNavbar;
</script>

<style lang="scss">
@import './navbar.scss';
</style>
