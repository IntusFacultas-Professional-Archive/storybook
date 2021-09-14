<template>
  <nav class="IFCTableOfContents">
    <ul class="IFCTableOfContents__table">
      <li
        class="IFCTableOfContents__item IFCTableOfContents__item--title IFCTableOfContents__item--visible"
        tabindex="0"
        @click="toggleOverride"
        @keyup.space="toggleOverride"
        @keyup.enter="toggleOverride"
        title
        visible
      >
        Table of Contents
        <span class="IFCTableOfContents__toggler" v-if="!override">&#43;</span>
        <span class="IFCTableOfContents__toggler" v-else>&#8722;</span>
      </li>
      <li
        v-for="title in titles"
        role="link"
        :key="title.id"
        :tabindex="computeTOCVisibility(title) ? 0 : -1"
        :class="computeClass(title)"
        :style="computeStyle(title)"
        @click="scrollToEl(title.el)"
        @keyup.space="scrollToEl(title.el)"
        @keyup.enter="scrollToEl(title.el)"
        >
          {{ getInnerText(title) }}
        </li>
    </ul>
  </nav>
</template>

<script>

import { SmoothScrollPolyfill } from './SmoothScrollPolyfill.js';
import { TOCPluginEventName } from './IFCTableOfContentsPlugin.js';
import { TOCPolyfills } from './TOCPolyfills.js';

export const IFCTableOfContents = {
  data() {
    return {
      titles: [],
      override: false,
      scrollToOverride: false,
      observer: null,
      defaultQuery: 'h1, h2, h3, h4, h5, h6',
      titleOffsetThreshold: 20,
      customDataRank: 'IFC-toc-data-rank',
    };
  },
  props: {
    /**
     * The width for the TOC
     */
    width: {
      type: String,
      default: 'auto',
    },

    /**
     * Whether the ToC should use a MutationObserver to observe the document for changes and update.
     * If false, then you can use the IFCTableOfContentsPlugin $IFCTOCRefresh method to manually refresh
     * the table of contents
     */
    enableDomListening: {
      type: Boolean,
      default: false,
    },

    /**
     * Document selector queries that exclude elements which match them from the ToC
     */
    ignoreQuery: {
      type: [String, Array],
      default: '',
    },

    /**
     * Document selector for determining titles. By default, the query is h1,h2,h3,h4,h5,h6. If you choose to override
     * what counts as a title, you will need to attach an attribute to your custom titles IFC-toc-data-rank="1" with
     * the number being the rank of the title (lower numbers are higher priority, just like in h1-h6).
     */
    queryOverride: {
      type: String,
      default: '',
    },

    /**
     * How much vertical offset from the title elements should the table of contents scroll the user to
     * (positive numbers make the table of contents stop prior to actually reaching the title, negative numbers
     * make the table of contents scroll past the title)
     */
    offset: {
      type: Number,
      default: 0,
    },
  },
  async mounted() {
    await this.$nextTick();
    TOCPolyfills();
    const body = document.getElementsByTagName('body')[0];
    if (this.enableDomListening) {
      const config = { attributes: false, childList: true, subtree: false };
      this.observer = new MutationObserver(this.updateTitlesOnDOMChange);
      this.observer.observe(body, config);
    } else {
      window.addEventListener(TOCPluginEventName, this.updateTitles);
    }
    this.updateTitles();
    window.addEventListener('scroll', this.checkTitles);
    SmoothScrollPolyfill();
  },
  beforeDestroy() {
    if (!this.enableDomListening) {
      window.removeEventListener(TOCPluginEventName, this.updateTitles);
    } else {
      this.observer.disconnect();
    }
    window.removeEventListener('scroll', this.checkTitles);
  },
  methods: {
    /**
     * @function computeStyle
     * @param {Object} title the title we are computing the padding for
     * @returns {Object} inline styles
     * Computes the styling for a title
     */
    computeStyle(title) {
      return {
        'padding-left': `${(title.titleType - 1) * 10 + 10}px`,
      };
    },

    /**
     * @function computeClass
     * @param {Object} title the title we are computing the classes for
     * @returns {Object} classes
     * Computes the class bindings for a title
     */
    computeClass(title) {
      return {
        [`${this.baseClass}__item`]: true,
        [`${this.baseClass}__item--margined`]: this.margined(title),
        [`${this.baseClass}__item--visible`]: this.computeTOCVisibility(title),
        [`${this.baseClass}__item--active`]: title.visible,
      };
    },

    /**
     * @function getInnerText
     * @returns {String} innerText
     */
    getInnerText(title) {
      return title?.el?.innerText ?? 'Loading';
    },

    /**
     * @function toggleOverride
     * @listens onclick of toc title
     * Expands the ToC completely or collapses it
     */
    toggleOverride() {
      this.override = !this.override;
      this.titles.forEach((title) => {
        /**
         * Disabled because we want to cause the object override value to be changed to force a refresh
         * in the Vue lifecycle
         */
        /* eslint-disable-next-line no-param-reassign */
        title.override = this.override;
      });
    },

    /**
     * @function scrollToEl
     * @listens click of item
     * @listens keyup.space of item
     * @listens keyup.enter of item
     * Smoothly scrolls the window to the appropriate title
     */
    scrollToEl(el) {
      const y = el.getBoundingClientRect().top + window.pageYOffset - this.offset;
      const IEHoldOff = 5; // IE is dumb and can't appropriately calculate viewport
      window.scrollTo({ top: y - IEHoldOff, behavior: 'smooth' });
      this.scrollToOverride = true;
      const self = this;
      setTimeout(() => {
        setTimeout(() => {
          self.checkTitles();
        }, 100);
        self.scrollToOverride = false;
      }, 500);
      el.focus();
    },

    /**
     * @function isOverridden
     * @param {Object} title the title to compute override for
     * @returns {Boolean} whether the title visibility is overriden and therefore visible even if title isn't visible
     * on screen and if scrollToOverride is false
     */
    isOverridden(title) {
      return (
        (!this.scrollToOverride && this.override)
        || title.override
        || (title.children ?? []).filter((child) => child.override).length > 0
        || (title.parents ?? []).filter((parent) => parent.override).length > 0
      );
    },

    /**
     * @function computeScreenVisibility
     * @param {Object} title the title to compute screen visibility for
     * @returns {Boolean} whether the title or one of it's children is visible in the screen and scrollToOverride
     * is false
     */
    computeScreenVisibility(title) {
      return (!this.scrollToOverride && (title.visible || (
        title.children ?? []).filter((child) => child.visible).length > 0));
    },

    /**
     * @function computeTOCVisibility
     * @param {Object} title the title to compute overall visibility for
     * @see computeScreenVisibility
     * @see isOverridden
     * @returns {Boolean} Whether title should be displayed as visible for any reason whatsoever
     */
    computeTOCVisibility(title) {
      return (
        title.parents?.length === 0
        || (
          title.directParents?.length === 1
            && title.parents?.length === 1
            && this.computeScreenVisibility(title.directParents[0]))
        || this.isOverridden(title)
        || this.computeScreenVisibility(title)
      );
    },

    /**
     * @function margined
     * @param {Object} title the title to compute margin status for
     * @return {Boolean} whether the title is margined or not
     */
    margined(title) {
      return title.visible;
    },

    /**
     * @function isInView
     * @param {HTMLElement} el the element to check for visibiliy in screen
     * @return {Boolean} whether the element is in the viewport or not
     */
    isInView(el) {
      const box = el.getBoundingClientRect();
      return box.top < window.innerHeight && box.bottom >= 0;
    },

    /**
     * @function getPathTo
     * @param {HTMLElement} element the element to get the direct selector path to
     * @returns {String} the direct selector path to the element
     */
    getPathTo(element) {
      /**
       * Disabled because we want to keep the URL working so we can't break up the URL
       */
      /* eslint-disable-next-line max-len */
      // pulled from https://stackoverflow.com/questions/2631820/how-do-i-ensure-saved-click-coordinates-can-be-reloaed-to-the-same-place-even-i/2631931#2631931
      if (element.id !== '') return `id("${element.id}")`;
      if (element === document.body) return element.tagName;

      let ix = 0;
      const siblings = element.parentNode.childNodes;

      /**
       * Disabled because we can't use forEach if we intend to shortcircuit with a return
       */
      /* eslint-disable-next-line no-restricted-syntax */
      for (const sibling of siblings) {
        if (sibling === element) {
          return `${this.getPathTo(element.parentNode)}/${element.tagName}[${ix + 1}]`;
        }
        if (sibling.nodeType === Node.ELEMENT_NODE && sibling.tagName === element.tagName) {
          ix += 1;
        }
      }
      // this should never be reached, if we do get a null, there is an error
      return null;
    },

    /**
     * @function checkIfTitle
     * @param {HTMLElment} el the element to check whether it qualifies as a title
     * @returns {Boolean} whether the element is considered a title or not
     */
    checkIfTitle(el) {
      if (((Array.isArray(this.ignoreQuery) && this.ignoreQuery.length) || Boolean(this.ignoreQuery))
        && (
          (Array.isArray(this.ignoreQuery) && this.ignoreQuery.some((query) => el.matches(query)))
          || el.matches(this.ignoreQuery)
        )
      ) {
        return false;
      }
      const activeQuery = this.queryOverride ? this.queryOverride : this.defaultQuery;
      return el.matches(activeQuery);
    },

    /**
     * @function calculateTitleType
     * @param {HTMLElement} el the element to check the title rank for
     * @returns {Number} the title rank
     * Relies on the h tag numbering, or the data-rank attribute of you've overridden the query
     */
    calculateTitleType(el) {
      if (this.queryOverride) {
        const attemptedDataRank = parseInt(el.getAttribute(this.customDataRank), 10);
        return Number.isNaN(attemptedDataRank) ? 1 : attemptedDataRank;
      }
      return parseInt(el.tagName[1], 10);
    },

    /**
     * @function crawl
     * @param {HTMLElement} node the node to start the breadth first search from
     * @see getPathTo
     * @see checkIfTitle
     * @see calculateTitleType
     * @returns {Array} the titles in order from top to bottom on the page.
     */
    crawl(node) {
      const titles = [];
      const stack = [node];
      const visited = [];
      while (stack.length > 0) {
        const el = stack.pop();
        if (typeof el.children !== 'undefined') {
          const nonVisitedChildren = Array.from(el.children).filter(
            (child) => !visited.includes(this.getPathTo(child)) && !child.isEqualNode(el),
          );
          nonVisitedChildren.forEach((child) => {
            stack.push(child);
          });
        }
        const path = this.getPathTo(el);
        const notVisited = !visited.includes(path);
        const isTitle = this.checkIfTitle(el);
        if (notVisited && isTitle) {
          titles.push({
            el,
            id: this.getPathTo(el),
            titleType: this.calculateTitleType(el),
            offset: -1,
            visible: false,
            hovered: false,
            override: false,
          });
        }
        visited.push(this.getPathTo(el));
      }
      return titles.reverse();
    },

    /**
     * @function resetVisibleTitles
     * Sets all visible titles to false
     */
    resetVisibleTitles() {
      /**
       * Disabled because we need to modify the objects in order to cause a rerender for those objects
       */
      /* eslint-disable no-param-reassign */
      const visibleTitles = this.titles.filter((title) => title.visible);
      visibleTitles.forEach((visibleTitle) => {
        visibleTitle.visible = false;
      });
      /* eslint-enable no-param-reassign */
    },

    /**
     * @function setVisibleTitlesBasedOnViewportHeight
     * @param {Number} viewportHeight the height of the viewport
     * @see resetVisibleTitles
     */
    setVisibleTitlesBasedOnViewportHeight(viewportHeight) {
      /**
       * Disabled because we need to modify the objects in order to cause a rerender for those objects
       */
      /* eslint-disable no-param-reassign */
      Array.from(this.titles.entries()).forEach(([index, title]) => {
        title.offset = title.el.getBoundingClientRect().top;
        if (title.offset < this.titleOffsetThreshold + this.offset && title.offset > 0) {
          // if the title is at the top of the viewport, within the range defined by this.offset, its visible
          this.resetVisibleTitles();
          title.visible = true;
        } else if (title.visible && title.el.getBoundingClientRect().bottom >= viewportHeight) {
          // if the title is below the viewport, then we are in the above title's content, so we set that to visible
          if (this.titles[index - 1]) this.titles[index - 1].visible = true;
          title.visible = false;
        }
      });
      /* eslint-enable no-param-reassign */
    },

    /**
     * @function getWindowPosition
     * @returns {Number} yOffset
     */
    getWindowPosition() {
      return window.pageYOffset;
    },

    /**
     * @function screenHasNoScrollbar
     * @returns {Boolean} whether the screen has no scrollbar
     */
    screenHasNoScrollbar() {
      return window.innerWidth - document.documentElement.clientWidth === 0;
    },

    /**
     * @function checkTitles
     * @listens onscroll of window
     * @see resetVisibleTitles
     * @see setVisibleTitlesBasedOnViewportHeight
     * @see getWindowPosition
     * Checks whether any of the titles should be considered visible, based on its location relative
     * to the window viewport location on the document, as well as the window viewport location relative the
     * document height
     */
    checkTitles() {
      if (!this.titles.length) {
        return -1;
      }
      /**
       * Disabled because we need to modify the objects in order to cause a rerender for those objects
       */
      /* eslint-disable no-param-reassign */
      const yOffset = this.getWindowPosition();
      if (yOffset === 0 && this.screenHasNoScrollbar()) {
        // if the window is at the top of the document, then the first title should be considered visible
        this.resetVisibleTitles();
        this.titles[0].visible = true;
      } else if (window.innerHeight + yOffset >= document.body.offsetHeight) {
        // if the window is at the bottom of the document, then the last title should be considered visible
        this.resetVisibleTitles();
        this.titles[this.titles.length - 1].visible = true;
      } else {
        // the window is somewhere between the top and bottom of the document
        const viewportHeight = (window.innerHeight || document.documentElement.clientHeight);
        this.setVisibleTitlesBasedOnViewportHeight(viewportHeight);
      }
      /* eslint-enable no-param-reassign */
      return 1;
    },

    /**
     * @function assignChildren
     * Determines a title's children titles based on immediately succeeding titles in the titles array with
     * higher title numbers (h1 followed by h2 means h2 is h1's child)
     */
    assignChildren() {
      /**
       * Disabled because we need to modify the titles in order to have the appropriate children and parents
       * and we can't determine it at construction time
       */
      /* eslint-disable no-param-reassign */
      Array.from(this.titles.entries()).forEach(([index, parentTitle]) => {
        // instantiate parents, children, and direct parents arrays
        if (!parentTitle.children) {
          parentTitle.children = [];
        }
        if (!parentTitle.parents) {
          parentTitle.parents = [];
        }
        if (!parentTitle.directParents) {
          parentTitle.directParents = [];
        }
        if ((this.titles[index + 1]?.titleType ?? Number.NEGATIVE_INFINITY) > parentTitle.titleType) {
          // if the next child is larger, then we have children, otherwise we don't
          let succeedingTitles = this.titles.slice(index + 1);
          const indexOfFirstSucceedingTitleWithLowerType = succeedingTitles.findIndex((succeedingTitle) => (
            succeedingTitle.titleType <= parentTitle.titleType
          ));
          if (indexOfFirstSucceedingTitleWithLowerType !== -1) {
            succeedingTitles = succeedingTitles.slice(0, indexOfFirstSucceedingTitleWithLowerType);
          }
          succeedingTitles.forEach((childTitle) => {
            parentTitle.children.push(childTitle);
            if (!childTitle.parents) {
              childTitle.parents = [];
            }
            if (!childTitle.directParents) {
              childTitle.directParents = [];
            }
            childTitle.parents.push(parentTitle);
          });
        }
      });
      this.titles.forEach((title) => {
        if (title.parents.length === 1) {
          title.directParents.push(title.parents[0]);
        }
        if (title.parents.length === 0) {
          // no parents means it can't possibly have siblings
          title.siblings = [];
        } else {
          title.siblings = this.titles.filter(
            (otherTitles) => otherTitles.parents.filter(
              (parent) => title.parents.some((titleParent) => titleParent.id === parent.id),
            ).length > 0
              && otherTitles.parents.length === title.parents.length
              && otherTitles.id !== title.id,
          );
        }
      });
      /* eslint-enable no-param-reassign */
    },

    /**
     * @function updateTitles
     * @see assignChildren
     * @see checkTitles
     * @see crawl
     * @listens TOCPluginEventName
     * Updates the displayed title when a document change is detected via plugin or via MutationObserver
     */
    updateTitles() {
      this.titles = this.crawl(document.getElementsByTagName('body')[0]);
      this.assignChildren();
      this.checkTitles();
    },

    /**
     * @function updateTitlesOnDOMChange
     * @param {Array} mutationsList the list of mutations observed
     * @see updateTitles
     */
    updateTitlesOnDOMChange(mutationsList) {
      if (mutationsList.some((mutation) => mutation.type === 'childList')) {
        this.updateTitles();
      }
    },
  },
  computed: {
    baseClass() {
      return 'IFCTableOfContents';
    },
    computedStyle() {
      return {
        'max-width': this.width,
      };
    },
  },
};
export default IFCTableOfContents;
</script>

<style lang="scss">
@import './toc.scss';
</style>
