import ResizeObserver from 'resize-observer-polyfill';
import { recompute, recomputable } from '@App/recompute.js';

/**
 * This mixin is designed to handle the auto closing of dropdown menus that can be escaped by clicking off of
 * them. In order to use it, you must:
 * - create a nonCollapseRefPrefix which you use in assigning refs to elements
 *    that do **not** cause a collapse when clicked (therefore whitelisting interactive elements that are part of the
 *    dropdown).
 * - use the data variable clickOffDependantContainerOpen to show or hide your dropdown

 * - use the method openClickOffDependantContainer (which can accept one callback function) to open your container
 * - Create a method called afterClickOff to handle callbacks that should occur after the user clicks off. The
 *    Triggering event will be passed as an argumnet
 */
export const CollapseWhenOffClickedMixin = {
  data() {
    return {
      clickOffDependantContainerOpen: false,
      nonCollapseRefPrefix: 'CollapseWhenOffClickedMixinWhitelistedParent',
    };
  },
  beforeDestroy() {
    this.closeCleanup();
  },
  methods: {

    /**
     * @function isNode
     * @param {Node} o
     * @returns {Boolean} if o is a node, returns true
     */
    isNode(o) {
      return (
        typeof Node === 'object' ? o instanceof Node
          : o && typeof o === 'object' && typeof o.nodeType === 'number' && typeof o.nodeName === 'string'
      );
    },

    openClickOffDependantContainer(callback = () => {}) {
      this.clickOffDependantContainerOpen = true;
      window.addEventListener('click', this.detectOffClick);
      callback();
    },

    /**
     * @function afterClickOff
     * A sane after click off callback in case the user doesn't provide one
     */
    afterClickOff() {

    },

    /**
     * @function closeCleanup
     * Cleans up the event listener to avoid data leaks.
     */
    closeCleanup() {
      window.removeEventListener('click', this.detectOffClick);
    },

    /**
     * We need to determine if the user clicks off the dropdown, and this is the easiest way to do it.
     * If the user clicks on something that isn't one of our interactable elements, then we can close it.
     */
    detectOffClick(event) {
      // we don't put this in a computed function because we need to generate it in the moment to ensure
      // no cached state
      const computedClickOffImmuneElements = Object
        .entries(this.$refs)
        .filter(([ref, el]) => ref.includes(this.nonCollapseRefPrefix))
        .map(([, el]) => el?.$el ?? el?.[0]?.$el ?? el?.[0] ?? el ?? { isEqualNode: () => false });
      if (!computedClickOffImmuneElements.some(
        (el) => this.isNode(el) && (el.isEqualNode(event.target) || el.isEqualNode(event.target.parentNode)),
      )) {
        this.clickOffDependantContainerOpen = false;
        this.closeCleanup();
        this.afterClickOff(event);
      }
    },
  },
};

/**
 * This mixin is designed to handle the floating label and borders of inputs. In order to use it you must assign
 * the ref labelContainer to the container that contains the label.
 *
 * In order to use it you must
 * - set a baseClass data variable or comnputed variable with the base CSS class of the component
 */
export const FloatingLabelMixin = {
  data() {
    return {
      observer: null,
    };
  },
  beforeDestroy() {
    if (this.observer !== null) {
      this.observer.disconnect();
    }
  },
  mounted() {
    /**
     * This whole nonsense is necessary because computedMarginRight fires *before* the elements load in,
     * so the appropriate margin for inputs that initialize with data already in them (and therefore labels already
     * floated) is calculated *after* paint, and computedMarginRight doesn't retrigger until a reactive property
     * changes (which usually is focus changing). So in order to force a recompute, we wait a tick so that
     * the paint is complete and the refs are defined, then force recompute.
     */
    setTimeout(() => {
      recompute(this, 'computedMarginRight');

      this.observer = new ResizeObserver(this.handleResize);
      this.observer.observe(this.$refs?.labelContainer);
    }, 50);
  },
  methods: {
    handleResize() {
      recompute(this, 'computedMarginRight');
    },
  },
  computed: {
    /**
     * Computes the amount the label container should have the right border shifted so that the
     * right border element appropriately lines up with the transformed label on focus
     */
    computedMarginRight: recomputable(function computedMarginRight() {
      const retrieveLabelOffsetWidth = (el) => {
        if (typeof el === 'undefined') {
          return 0;
        }
        const MINIMIZATION_FACTOR = 0.8;
        const PADDING = 6;
        const shrunkSize = (el.querySelector('label').offsetWidth * MINIMIZATION_FACTOR) + PADDING;
        return parseInt(shrunkSize.toFixed(0), 10);
      };

      const containerOffsetWidth = this.$refs?.labelContainer?.offsetWidth ?? 0;
      const labelOffsetWidth = retrieveLabelOffsetWidth(this.$refs?.labelContainer);
      return this.focus || Boolean(this.value) ? `-${containerOffsetWidth - labelOffsetWidth}px` : '0px';
    }),

    computedBorderClass() {
      return {
        [`${this.baseClass}__border--${this.state}`]: true,
        [`${this.baseClass}__border--focus`]: this.focus,
        [`${this.baseClass}__border--disabled`]: this.disabled,
      };
    },
    computedLeftBorderClass() {
      return {
        [`${this.baseClass}__border--left`]: true,
        ...this.computedBorderClass,
      };
    },
    computedLabelBorderClass() {
      return {
        [`${this.baseClass}__border--label`]: true,
        [`${this.baseClass}__border--label--focusOrFilled`]: this.focus || (
          this.value !== null && this.value !== undefined && this.value !== ''),
        ...this.computedBorderClass,
      };
    },
    computedLabelStyle() {
      const style = {};
      if (this.focus || (this.value !== null && this.value !== undefined && this.value !== '')) {
        style['margin-right'] = this.computedMarginRight;
      }
      return style;
    },
    computedSVGClass() {
      return {
        [`${this.baseClass}__svgContainer`]: true,
        [`${this.baseClass}__svgContainer--${this.state}`]: true,
      };
    },
    computedRightBorderClass() {
      return {
        [`${this.baseClass}__border--right`]: true,
        ...this.computedBorderClass,
      };
    },
  },
};

/**
 * This mixin is designed to handle the capture of focus within a floating content like the collapsed navbar
 * or a modal. In order to use it, you must:
 * - create a focusCaptureRef in your data which you use to indicate the container of the modal or the navbar by
 * binding that data value as the ref name for the element.
 * - set a document event listener on keydown with captureFocus as the event handler
 * - call forcusFirstElement
 *
 */
export const FocusCaptureMixin = {
  data() {
    return {
      focusCaptureRef: 'FocusCaptureRefMixin',
    };
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
      const firstFocusableElement = focusableContent[0];
      if (firstFocusableElement) { firstFocusableElement.focus(); }
    },

    /**
     * @function captureFocus
     * @param {Event} e, the keyboard event
     * @listens window.onkeydown
     * Keeps keyboard focus inside of the expanded navbar
     */
    captureFocus(e) {
      const focusableElements = 'button, [href], a, input, select, textarea, [tabindex]:not([tabindex="-1"])';
      const element = this.$refs?.[this.focusCaptureRef].$el ?? this.$refs?.[this.focusCaptureRef];
      const focusableContent = element.querySelectorAll(focusableElements);
      const firstFocusableElement = focusableContent[0];
      const lastFocusableElement = focusableContent[focusableContent.length - 1];
      const isTabPressed = e.key === 'Tab' || e.keyCode === 9;

      if (isTabPressed) {
        if (e.shiftKey) {
          if (document.activeElement === firstFocusableElement) {
            lastFocusableElement.focus(); // add focus for the last focusable element
            e.preventDefault();
          }
        } else if (document.activeElement === lastFocusableElement) {
          firstFocusableElement.focus(); // add focus for the first focusable element
          e.preventDefault();
        }
      }
    },
  },
};

/**
 * This mixin is designed to handle content that changes behavior to be toggleable
 * at a specific breakpoint like navbars and sidebars.
 *
 * Toggled is whether the collapsed version of the element is opened or not (so user is opening or closing the
 * menu )
 *
 * breakpointTriggered is whether the viewport is smaller than the provided breakpoint
 */
export const BreakpointToggledMixin = {
  data() {
    return {
      toggled: false,
      breakpointTriggered: false,
    };
  },
  mixins: [FocusCaptureMixin],
  watch: {
    breakpoint() {
      this.detectIfCollapsed();
    },
  },
  props: {
    /**
     * The breakpoint in pixels when the element should change to a collapsed toggleable element
     */
    breakpoint: {
      type: Number,
      required: true,
    },

    /**
     * Whether to force the element to always be collapsed regardless of breakpoint state.
     */
    collapseOverride: {
      type: Boolean,
      default: false,
    },
  },
  mounted() {
    window.addEventListener('resize', this.handleWindowResize, { passive: true });
    window.addEventListener('resize', this.detectIfCollapsed, { passive: true });
    this.detectIfCollapsed();
  },
  beforeDestroy() {
    window.removeEventListener('resize', this.handleWindowResize);
    window.removeEventListener('resize', this.detectIfCollapsed);
  },
  methods: {
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

    /**
     * @function detectIfCollapsed
     * @listens onresize of window
     * Determines whether the content should be collapsed or not
     */
    detectIfCollapsed() {
      this.breakpointTriggered = window.matchMedia(`(max-width: ${this.breakpoint}px)`).matches;
    },

    /**
     * @function handleWindowResize
     * @listens onresize of window
     * Collapses navbar when window innerwidth is smaller than the breakpoint
     */
    handleWindowResize() {
      if (window.innerWidth > this.breakpoint && !this.collapseOverride) {
        this.toggled = false;
      }
    },
  },
};
