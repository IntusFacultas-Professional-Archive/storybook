import { recompute, recomputable } from '@App/recompute.js';
import ResizeObserver from 'resize-observer-polyfill';

export const cellMixin = {
  data() {
    return {
      observer: null,
      debounceId: null,
      type: 'cell',
      minimumCellWidth: '0px',
    };
  },
  props: {
    /**
     * What variant this cell should be.
     */
    variant: {
      type: String,
      default: 'default',
    },

    /**
     * Whether the cell should shrink to fit content.
     */
    fitContent: {
      type: Boolean,
      default: false,
    },

    /**
     * How to text align the content
     */
    textAlign: {
      type: String,
      default: 'left',
    },

    /**
     * Whether this cell is interactive or not.
     */
    interactive: {
      type: Boolean,
      default: false,
    },

    /**
     * Whether this cell can be pinned
     */
    pinnable: {
      type: Boolean,
      default: false,
    },

    /**
     * Whether this cell is horizontally pinned (for horizontal scroll)
     */
    pinned: {
      type: Boolean,
      default: false,
    },

    /**
     * How left aligned this cell should be if horizontally pinned.
     */
    left: {
      type: Number,
      default: 0,
    },

    /**
     * Whether the cell should have vertical borders
     */
    grid: {
      type: Boolean,
      default: false,
    },

    /**
     * The sizing of this cell. Options are defined in the theme.
     */
    sizing: {
      type: String,
      default: 'regular',
    },

    /**
     *  Whether this cell is manually resizable
     */
    resizeable: {
      type: Boolean,
      default: false,
    },

  },
  methods: {
    clearStyling() {
      /**
       * Resize events happen frequently when the user is dragging, so we need to debounce the style clearing
       * to avoid it snapping constantly back to full widht while the user drags.
       */
      if (this.debounceId !== null) {
        clearTimeout(this.debounceId);
      }
      this.debounceId = setTimeout(() => {
        /**
         * We do this because if we don't, then the resizer can slowly creep out of sync in size
         * with the container. So after the user stops resizing, we clear out the styling so that
         * it resumes to be 100% of the container (which now will have a defined width because we resized
         * it).
         *
         * The logic flow is that the div resizes the td or th. We then set the td or th minimum width equal to
         * the width of the div, then clear the width style on the div so that it snaps back to full width of the cell.
         * The good news is that when the div shrinks, the min-width of the td or th shrinks as well, and they shrink
         * alongside it.
         */
        this.$refs.content.style.width = '';
        this.$forceUpdate();
        this.debounceId = null;
      }, 50);
    },
    handleResize() {
      this.minimumCellWidth = `${this.$refs?.content?.offsetWidth ?? 0}px`;
      this.clearStyling();
    },
    setupObserver() {
      setTimeout(() => {
        /** We immediately recompute the minwidth necessary to appropriately contain content */
        this.minimumCellWidth = `${this.$refs?.content?.offsetWidth ?? 0}px`;

        this.observer = new ResizeObserver(this.handleResize);
        this.observer.observe(this.$refs.content);
      }, 50);
    },
  },
  watch: {
    resizeable(newVal) {
      if (!this.observer && newVal) {
        this.setupObserver();
      }
    },
  },
  mounted() {
    if (this.resizeable) {
      this.setupObserver();
    }
  },
  beforeDestroy() {
    if (this.resizeable) {
      this.observer.disconnect();
    }
  },
  computed: {
    baseClass() {
      return this.type[0].toUpperCase() + this.type.substring(1);
    },
    computedStyle() {
      const style = {
        'text-align': this.textAlign,
        'min-width': this.minimumCellWidth,
      };
      if (this.pinned) {
        style.left = `${this.left}px`;
      }
      if (this.type === 'header') {
        style.top = `${this.top}px`;
      }
      return style;
    },
    computedResizeableStyle() {
      return {
        'text-align': this.textAlign,
      };
    },
    computedResizeableClass() {
      const baseClass = 'IFCTableResizeableWrapper';
      return {
        [baseClass]: true,
        [`${baseClass}--resizeable`]: this.resizeable,
        [`${baseClass}--resizeable--${this.sizing}`]: this.resizeable,
      };
    },
    computedClass() {
      return {
        [`IFCTable${this.baseClass}`]: true,
        [`IFCTable${this.baseClass}--${this.sizing}`]: true,
        [`IFCTable${this.baseClass}--pinned`]: this.pinned,
        [`IFCTable${this.baseClass}--${this.variant}`]: true,
        [`IFCTable${this.baseClass}--${this.variant}--interactive`]: this.interactive,
        [`IFCTable${this.baseClass}--grid`]: this.grid,
      };
    },
  },
};

export default {
  cellMixin,
};
