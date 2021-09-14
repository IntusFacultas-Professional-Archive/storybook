<template>
  <div class="IFCSidebar" :style="computedStyle">
    <aside :class="collapsedClass" >
      <IFCButton
        variant="transparent"
        class="IFCSidebar__button"
        :fill="buttonColor"
        :style="computedStyle"
        @click="handleToggle()"
        ref="toggler">
        <IFCScreenReaderText>
          <span v-if='!toggled'>Expand</span>
          <span v-else>Close</span>
           Sidebar
        </IFCScreenReaderText>
        <HamburgerMenu :fill="buttonColor"/>
      </IFCButton>
    </aside>
    <transition name="IFCSidebarBackdrop">
      <div class="IFCSidebar__backdrop" data-background="true" v-if="toggled" @click="handleToggle()" />
    </transition>
      <transition name="IFCSidebarCollapse">
        <div class="IFCSidebar__floatedContainer" v-if="toggled" :ref="focusCaptureRef">
          <aside class="IFCSidebar__toggleableSidebar"
            aria-label="Sidebar">
            <slot name="sidebar"></slot>
          </aside>
        </div>
      </transition>
    <aside :class="nonCollapsedClass">
      <slot name="sidebar"></slot>
    </aside>
    <main class="IFCSidebar__offsetContent">
      <slot></slot>
    </main>
  </div>

</template>

<script>
import { IFCScreenReaderText } from '@Components/Text/IFCScreenReaderText.vue';
import { BreakpointToggledMixin } from '@Components/mixins.js';
import { IFCButton } from '@Components/Button/IFCButton.vue';

import { HamburgerMenu } from './icons/HamburgerMenu.vue';

export const IFCSidebar = {
  components: {
    IFCButton,
    HamburgerMenu,
    IFCScreenReaderText,
  },
  mixins: [BreakpointToggledMixin],
  data() {
    return {
      focusCaptureRef: 'collapsedSidebar',
    };
  },
  props: {

    /**
     * The width of the sidebar when uncollapsed in pixels
     */
    width: {
      type: Number,
      required: true,
    },

    /**
     * Color of the fill for the collapsed button icon
     */
    buttonColor: {
      type: String,
      default: '#ffffff',
    },

    /**
     * The background color of the sidebar
     */
    background: {
      type: String,
      default: '#f1f1f1',
    },
  },
  watch: {
    breakpointTriggered(val) {
      if (!val) {
        document.removeEventListener('keydown', this.captureFocus);
      }
    },
  },
  methods: {
    /**
     * @function focusFirstElement
     * Focuses the first focusable element in the container
     */
    focusFirstElement() {
      const focusableElements = 'button, [href], a, input, select, textarea, [tabindex]:not([tabindex="-1"])';
      const element = this.$refs?.[this.focusCaptureRef].$el ?? this.$refs?.[this.focusCaptureRef];
      const focusableContent = element.querySelectorAll(focusableElements);
      const firstFocusableElement = focusableContent[0] ?? this.$refs?.toggler?.$el;
      if (firstFocusableElement) { firstFocusableElement.focus(); }
    },

    /**
     * @function captureFocus
     * @param {Event} e, the keyboard event
     * @listens window.onkeydown
     * This is overriden because we actually need to allow focus to stay between the toggler and the sidebar
     */
    captureFocus(e) {
      const focusableElements = 'button, [href], a, input, select, textarea, [tabindex]:not([tabindex="-1"])';
      const element = this.$refs?.[this.focusCaptureRef];
      const focusableContent = element.querySelectorAll(focusableElements);
      const togglerElement = this.$refs?.toggler?.$el;
      const firstFocusableElement = focusableContent[0]; // ?? togglerElement;
      const lastFocusableElement = focusableContent[focusableContent.length - 1] ?? null;
      const isTabPressed = e.key === 'Tab' || e.keyCode === 9;
      if (isTabPressed) {
        if (e.shiftKey) {
          if (document.activeElement === firstFocusableElement) {
            togglerElement.focus(); // add focus for the last focusable element
            e.preventDefault();
          } else if (document.activeElement === togglerElement) {
            const elementToFocus = lastFocusableElement ?? togglerElement;
            elementToFocus.focus();
            e.preventDefault();
          }
        } else if (document.activeElement === lastFocusableElement || lastFocusableElement === null) {
          togglerElement.focus(); // add focus for the first focusable element
          e.preventDefault();
        }
      }
    },

    /**
     * @function handleToggle
     * Toggles the expanded or collapsed Sidebar
     */
    handleToggle() {
      this.toggled = !this.toggled;
      if (this.toggled) {
        document.addEventListener('keydown', this.captureFocus);
        this.$nextTick(() => {
          this.focusFirstElement();
        });
      } else {
        document.removeEventListener('keydown', this.captureFocus);
      }
    },
  },
  computed: {
    baseClass() {
      return 'IFCSidebar';
    },

    /**
     * Applies the classes to the collapsed sidebar that allows the user to open the toggleable sidebar
     */
    collapsedClass() {
      return {
        [`${this.baseClass}__collapsedSidebar`]: true,
        [`${this.baseClass}__collapsedSidebar--override`]: this.collapseOverride || this.breakpointTriggered,
      };
    },

    /**
     * Applies the classes to the sidebar that exists before the breakpoint collapse
     */
    nonCollapsedClass() {
      return {
        [`${this.baseClass}__sidebar`]: true,
        [`${this.baseClass}__collapsedSidebar--override`]: !this.collapseOverride && !this.breakpointTriggered,
      };
    },
    computedStyle() {
      return {
        '--IFC-sidebar-button-color': this.buttonColor,
        '--IFC-sidebar-background': this.background,
        '--IFC-sidebar-width': `${this.width}px`,
      };
    },
  },
};

export default IFCSidebar;
</script>

<style lang="scss">
@import './sidebar.scss';
</style>
