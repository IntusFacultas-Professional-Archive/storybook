import { IFCTableOfContents } from '@Components/TableOfContents/IFCTableOfContents.vue';
import { IFCTableOfContentsPlugin, TOCPluginEventName } from '@Components/TableOfContents/IFCTableOfContentsPlugin';
import { SmoothScrollPolyfill } from '@Components/TableOfContents/SmoothScrollPolyfill';
import { TOCPolyfills } from '@Components/TableOfContents/TOCPolyfills';
import { mount } from '@vue/test-utils';
import Vue from 'vue';

describe('IFCTableOfContents', () => {
  /**
   * Prop existence and validation tests
   */
  it('has a prop called width of type String with default value "auto"', () => {
    const { width } = IFCTableOfContents.props;
    expect(width.type).toBe(String);
    expect(width.default).toBe('auto');
  });

  it('has a prop called enableDomListening of type Boolean with default value false', () => {
    const { enableDomListening } = IFCTableOfContents.props;
    expect(enableDomListening.type).toBe(Boolean);
    expect(enableDomListening.default).toBe(false);
  });

  it('has a prop called ignoreQuery of type [String, Array] with default value ""', () => {
    const { ignoreQuery } = IFCTableOfContents.props;
    expect(ignoreQuery.type).toStrictEqual([String, Array]);
    expect(ignoreQuery.default).toBe('');
  });

  it('has a prop called queryOverride of type String with default value ""', () => {
    const { queryOverride } = IFCTableOfContents.props;
    expect(queryOverride.type).toBe(String);
    expect(queryOverride.default).toBe('');
  });

  it('has a prop called offset of type Number with default value 0', () => {
    const { offset } = IFCTableOfContents.props;
    expect(offset.type).toBe(Number);
    expect(offset.default).toBe(0);
  });

  /**
   * Document mutation handling tests
   */
  it('mounts a mutation observer if enableDocumentListening is true', async () => {
    const wrapper = mount(IFCTableOfContents, {
      attachTo: document.body,
      propsData: {
        enableDomListening: true,
      },
    });
    wrapper.vm.updateTitles = jest.fn();
    await wrapper.vm.$nextTick();
    await wrapper.vm.$nextTick();
    expect(wrapper.vm.observer).toBeInstanceOf(MutationObserver);
  });
  it('sets up an event listener for use by the plugin if enableDocumentListening is false', async () => {
    window.addEventListener = jest.fn();
    const wrapper = mount(IFCTableOfContents, {
      attachTo: document.body,
      propsData: {
        enableDomListening: false,
      },
    });
    await wrapper.vm.$nextTick();
    expect(window.addEventListener).toHaveBeenCalledWith(TOCPluginEventName, wrapper.vm.updateTitles);
  });

  /**
   * TOC Setup tests
   */
  it('calls updateTitles on mount', async () => {
    const wrapper = mount(IFCTableOfContents, {
      attachTo: document.body,
      propsData: {
        enableDomListening: true,
      },
    });
    wrapper.vm.updateTitles = jest.fn();
    await wrapper.vm.$nextTick();
    expect(wrapper.vm.updateTitles).toHaveBeenCalled();
  });
  it('binds an event listener to scroll for checking active title', async () => {
    window.addEventListener = jest.fn();
    const wrapper = mount(IFCTableOfContents, {
      attachTo: document.body,
      propsData: {
        enableDomListening: true,
      },
    });
    wrapper.vm.updateTitles = jest.fn();
    await wrapper.vm.$nextTick();
    await wrapper.vm.$nextTick();
    expect(window.addEventListener).toHaveBeenNthCalledWith(1, 'scroll', wrapper.vm.checkTitles);
  });

  /**
   * TOC teardown tests
   */
  it('stops observing if enableDomListening is set to true and the component gets destroyed', async () => {
    const wrapper = mount(IFCTableOfContents, {
      attachTo: document.body,
      propsData: {
        enableDomListening: true,
      },
    });
    wrapper.vm.updateTitles = jest.fn();
    await wrapper.vm.$nextTick();
    await wrapper.vm.$nextTick();
    const { observer } = wrapper.vm;
    observer.disconnect = jest.fn();
    wrapper.destroy();
    await wrapper.vm.$nextTick();
    expect(observer.disconnect).toHaveBeenCalled();
  });
  it('stops listening for plugin events on destroy if enableDomListening is set to false', async () => {
    const wrapper = mount(IFCTableOfContents, {
      attachTo: document.body,
      propsData: {
        enableDomListening: false,
      },
    });
    wrapper.vm.updateTitles = jest.fn();
    await wrapper.vm.$nextTick();
    await wrapper.vm.$nextTick();
    window.removeEventListener = jest.fn();
    wrapper.destroy();
    await wrapper.vm.$nextTick();
    expect(window.removeEventListener).toHaveBeenCalledWith(TOCPluginEventName, wrapper.vm.updateTitles);
  });
  it('stops listening for scroll events on destroy', async () => {
    const wrapper = mount(IFCTableOfContents, {
      attachTo: document.body,
      propsData: {
        enableDomListening: true,
      },
    });
    wrapper.vm.updateTitles = jest.fn();
    await wrapper.vm.$nextTick();
    await wrapper.vm.$nextTick();
    window.removeEventListener = jest.fn();
    wrapper.destroy();
    await wrapper.vm.$nextTick();
    expect(window.removeEventListener).toHaveBeenCalledWith('scroll', wrapper.vm.checkTitles);
  });

  /**
   * Plugin setup test
   */
  it('provides a plugin for adding a prototype function to Vue for manually causing an update to the toc', async () => {
    expect(Vue.prototype.$IFCTOCRefresh).toBeUndefined();
    Vue.use(IFCTableOfContentsPlugin);
    expect(Vue.prototype.$IFCTOCRefresh).toBeDefined();
  });

  /**
   * TOC Method tests
   */
  it('toggles override, setting all titles override to be true or false based on value of override', async () => {
    const wrapper = mount(IFCTableOfContents, {
      attachTo: document.body,
      propsData: {
        enableDomListening: false,
      },
    });
    wrapper.vm.updateTitles = jest.fn();
    expect(wrapper.vm.override).toBe(false);
    wrapper.vm.titles = [
      {
        override: false,
        parents: [],
        directParents: [],
        children: [],
        el: {
          innerText: 'Something',
        },
      },
      {
        override: false,
        parents: [],
        directParents: [],
        children: [],
        el: {
          innerText: 'Something',
        },
      },
      {
        override: false,
        parents: [],
        directParents: [],
        children: [],
        el: {
          innerText: 'Something',
        },
      },
      {
        override: false,
        parents: [],
        directParents: [],
        children: [],
        el: {
          innerText: 'Something',
        },
      },
    ];
    wrapper.vm.titles.forEach((title) => {
      expect(title.override).toBe(false);
    });
    wrapper.vm.toggleOverride();
    await wrapper.vm.$nextTick();
    expect(wrapper.vm.override).toBe(true);
    wrapper.vm.titles.forEach((title) => {
      expect(title.override).toBe(true);
    });
  });

  it('scrolls to an element when scrollToEl is called by a click event handler', async () => {
    jest.useFakeTimers();
    const wrapper = mount(IFCTableOfContents, {
      attachTo: document.body,
      propsData: {
        enableDomListening: false,
      },
    });
    wrapper.vm.updateTitles = jest.fn();
    await wrapper.vm.$nextTick();
    window.pageYOffset = 10;
    const el = {
      getBoundingClientRect: jest.fn(() => ({
        top: 100,
      })),
      focus: jest.fn(),
    };
    window.scrollTo = jest.fn();
    wrapper.vm.checkTitles = jest.fn();
    wrapper.vm.scrollToEl(el);

    expect(el.getBoundingClientRect).toHaveBeenCalled();
    expect(window.scrollTo).toHaveBeenCalledWith({
      top: 105, // 100 + 10 - 5 - 0 : top + window.pageYOffset - IEOffset - vm.offset
      behavior: 'smooth',
    });
    expect(wrapper.vm.scrollToOverride).toBe(true);
    jest.runAllTimers();
    expect(wrapper.vm.checkTitles).toHaveBeenCalled();
    expect(wrapper.vm.scrollToOverride).toBe(false);
  });

  it('returns true for isOverridden if vue override is set to true and scrollToOverride is false', () => {
    const title = {
      override: false,
      children: [
        {
          override: false,
        },
      ],
      parents: [
        {
          override: false,
        },
      ],
    };
    const wrapper = mount(IFCTableOfContents, {
      attachTo: document.body,
      propsData: {
        enableDomListening: false,
      },
    });
    wrapper.vm.updateTitles = jest.fn();
    wrapper.vm.override = true;
    expect(wrapper.vm.isOverridden(title)).toBe(true);
  });
  it('returns false for isOverridden if vue override is set to true and scrollToOverride is true', () => {
    const title = {
      override: false,
      children: [
        {
          override: false,
        },
      ],
      parents: [
        {
          override: false,
        },
      ],
    };
    const wrapper = mount(IFCTableOfContents, {
      attachTo: document.body,
      propsData: {
        enableDomListening: false,
      },
    });
    wrapper.vm.updateTitles = jest.fn();
    wrapper.vm.override = true;
    wrapper.vm.scrollToOverride = true;
    expect(wrapper.vm.isOverridden(title)).toBe(false);
  });
  it(`returns true for isOverridden if vue override is set to true and scrollToOverride
      is true but title override is true`, () => {
    const title = {
      override: true,
      children: [
        {
          override: false,
        },
      ],
      parents: [
        {
          override: false,
        },
      ],
    };
    const wrapper = mount(IFCTableOfContents, {
      attachTo: document.body,
      propsData: {
        enableDomListening: false,
      },
    });
    wrapper.vm.updateTitles = jest.fn();
    wrapper.vm.override = true;
    wrapper.vm.scrollToOverride = true;
    expect(wrapper.vm.isOverridden(title)).toBe(true);
  });
  it(`returns true for isOverridden if vue override is set to true and scrollToOverride
      is true but title parent override is true`, () => {
    const title = {
      override: false,
      children: [
        {
          override: false,
        },
      ],
      parents: [
        {
          override: true,
        },
      ],
    };
    const wrapper = mount(IFCTableOfContents, {
      attachTo: document.body,
      propsData: {
        enableDomListening: false,
      },
    });
    wrapper.vm.updateTitles = jest.fn();
    wrapper.vm.override = true;
    wrapper.vm.scrollToOverride = true;
    expect(wrapper.vm.isOverridden(title)).toBe(true);
  });
  it(`returns true for isOverridden if vue override is set to true and scrollToOverride
      is true but title child override is true`, () => {
    const title = {
      override: false,
      children: [
        {
          override: true,
        },
      ],
      parents: [
        {
          override: false,
        },
      ],
    };
    const wrapper = mount(IFCTableOfContents, {
      attachTo: document.body,
      propsData: {
        enableDomListening: false,
      },
    });
    wrapper.vm.updateTitles = jest.fn();
    wrapper.vm.override = true;
    wrapper.vm.scrollToOverride = true;
    expect(wrapper.vm.isOverridden(title)).toBe(true);
  });
  it(`returns true for isOverridden if vue override is set to false and scrollToOverride
      is false but title override is true`, () => {
    const title = {
      override: true,
      children: [
        {
          override: false,
        },
      ],
      parents: [
        {
          override: false,
        },
      ],
    };
    const wrapper = mount(IFCTableOfContents, {
      attachTo: document.body,
      propsData: {
        enableDomListening: false,
      },
    });
    wrapper.vm.updateTitles = jest.fn();
    wrapper.vm.override = false;
    wrapper.vm.scrollToOverride = false;
    expect(wrapper.vm.isOverridden(title)).toBe(true);
  });
  it(`returns true for isOverridden if vue override is set to false and scrollToOverride
      is false but title parent override is true`, () => {
    const title = {
      override: false,
      children: [
        {
          override: false,
        },
      ],
      parents: [
        {
          override: true,
        },
      ],
    };
    const wrapper = mount(IFCTableOfContents, {
      attachTo: document.body,
      propsData: {
        enableDomListening: false,
      },
    });
    wrapper.vm.updateTitles = jest.fn();
    wrapper.vm.override = false;
    wrapper.vm.scrollToOverride = false;
    expect(wrapper.vm.isOverridden(title)).toBe(true);
  });
  it(`returns true for isOverridden if vue override is set to false and scrollToOverride
      is false but title child override is true`, () => {
    const title = {
      override: false,
      children: [
        {
          override: true,
        },
      ],
      parents: [
        {
          override: false,
        },
      ],
    };
    const wrapper = mount(IFCTableOfContents, {
      attachTo: document.body,
      propsData: {
        enableDomListening: false,
      },
    });
    wrapper.vm.updateTitles = jest.fn();
    wrapper.vm.override = false;
    wrapper.vm.scrollToOverride = false;
    expect(wrapper.vm.isOverridden(title)).toBe(true);
  });

  it('computes screen visibility for a title based on whether it is visible and scrollToOverride is false', () => {
    const title = {
      override: false,
      visible: false,
      children: [
        {
          override: true,
        },
      ],
      parents: [
        {
          override: false,
        },
      ],
    };
    const wrapper = mount(IFCTableOfContents, {
      attachTo: document.body,
      propsData: {
        enableDomListening: false,
      },
    });
    wrapper.vm.updateTitles = jest.fn();
    expect(wrapper.vm.computeScreenVisibility(title)).toBe(false);
    title.visible = true;
    expect(wrapper.vm.computeScreenVisibility(title)).toBe(true);
  });
  it('overrides computed screen visibility for a title when scrollToOverride is true', () => {
    const title = {
      override: false,
      visible: true,
      children: [
        {
          override: true,
        },
      ],
      parents: [
        {
          override: false,
        },
      ],
    };
    const wrapper = mount(IFCTableOfContents, {
      attachTo: document.body,
      propsData: {
        enableDomListening: false,
      },
    });
    wrapper.vm.updateTitles = jest.fn();
    wrapper.vm.scrollToOverride = true;
    expect(wrapper.vm.computeScreenVisibility(title)).toBe(false);
  });
  it('returns true for screen visiblity when a title\'s child is visible and scrollToOverride is false', () => {
    const title = {
      override: false,
      visible: false,
      children: [
        {
          visible: true,
          override: true,
        },
      ],
      parents: [
        {
          override: false,
        },
      ],
    };
    const wrapper = mount(IFCTableOfContents, {
      attachTo: document.body,
      propsData: {
        enableDomListening: false,
      },
    });
    wrapper.vm.updateTitles = jest.fn();
    wrapper.vm.scrollToOverride = false;
    expect(wrapper.vm.computeScreenVisibility(title)).toBe(true);
  });

  it('returns true for visibility in the TOC if the title is a root level title', () => {
    const title = {
      override: false,
      visible: false,
      children: [
        {
          visible: true,
          override: true,
        },
      ],
      // no parents means its a root level title
      parents: [],
    };
    const wrapper = mount(IFCTableOfContents, {
      attachTo: document.body,
      propsData: {
        enableDomListening: false,
      },
    });
    wrapper.vm.updateTitles = jest.fn();
    expect(wrapper.vm.computeTOCVisibility(title)).toBe(true);
  });
  it('returns true for visibility in the TOC if the title has one directParent and only one parent that is visible',
    () => {
      const title = {
        override: false,
        visible: false,
        children: [
          {
            visible: true,
            override: true,
          },
        ],
        parents: [
          {
            id: 1,
            visible: true,
          },
        ],
        // one direct parent that is visible with only one parent means this is directly nested below a root title
        // we show second level titles when the first level is considered visible so users can skip between sections
        directParents: [
          {
            id: 1,
            visible: true,
          },
        ],
      };
      const wrapper = mount(IFCTableOfContents, {
        attachTo: document.body,
        propsData: {
          enableDomListening: false,
        },
      });
      wrapper.vm.updateTitles = jest.fn();
      wrapper.vm.computeScreenVisibility = jest.fn((otherTitle) => otherTitle.visible);
      expect(wrapper.vm.computeTOCVisibility(title)).toBe(true);
      expect(wrapper.vm.computeScreenVisibility).toHaveBeenCalledWith({
        id: 1,
        visible: true,
      });
    });
  it('returns true for visibility in the TOC if the title has overriden visibility',
    () => {
      const title = {
        override: true,
        visible: false,
        children: [
          {
            visible: false,
            override: false,
          },
        ],
        parents: [
          {
            id: 1,
            visible: false,
          },
          {
            id: 2,
            visible: false,
          },
        ],
        directParents: [
          {
            id: 1,
            visible: false,
          },
        ],
      };
      const wrapper = mount(IFCTableOfContents, {
        attachTo: document.body,
        propsData: {
          enableDomListening: false,
        },
      });
      wrapper.vm.updateTitles = jest.fn();
      wrapper.vm.isOverridden = jest.fn((otherTitle) => otherTitle.override);
      expect(wrapper.vm.computeTOCVisibility(title)).toBe(true);
      expect(wrapper.vm.isOverridden).toHaveBeenCalledWith(title);
    });
  it('returns true for visibility in the TOC if the title has is visible on screen',
    () => {
      const title = {
        override: false,
        visible: true,
        children: [
          {
            visible: false,
            override: false,
          },
        ],
        parents: [
          {
            id: 1,
            visible: false,
          },
          {
            id: 2,
            visible: false,
          },
        ],
        directParents: [
          {
            id: 1,
            visible: false,
          },
        ],
      };
      const wrapper = mount(IFCTableOfContents, {
        attachTo: document.body,
        propsData: {
          enableDomListening: false,
        },
      });
      wrapper.vm.updateTitles = jest.fn();
      wrapper.vm.isOverridden = jest.fn((otherTitle) => otherTitle.override);
      wrapper.vm.computeScreenVisibility = jest.fn((otherTitle) => otherTitle.visible);
      expect(wrapper.vm.computeTOCVisibility(title)).toBe(true);
      expect(wrapper.vm.isOverridden).toHaveBeenCalledWith(title);
      expect(wrapper.vm.computeScreenVisibility).toHaveBeenCalledWith(title);
    });
  it(`returns false for visibility in the TOC if the title has is not visible on screen, isn't a second level title
      with a visible direct parent, andisn't overriden`, () => {
    const title = {
      override: false,
      visible: false,
      children: [
        {
          visible: false,
          override: false,
        },
      ],
      parents: [
        {
          id: 1,
          visible: false,
        },
        {
          id: 2,
          visible: false,
        },
      ],
      directParents: [
        {
          id: 1,
          visible: false,
        },
      ],
    };
    const wrapper = mount(IFCTableOfContents, {
      attachTo: document.body,
      propsData: {
        enableDomListening: false,
      },
    });
    wrapper.vm.updateTitles = jest.fn();
    wrapper.vm.isOverridden = jest.fn((otherTitle) => otherTitle.override);
    wrapper.vm.computeScreenVisibility = jest.fn((otherTitle) => otherTitle.visible);
    expect(wrapper.vm.computeTOCVisibility(title)).toBe(false);
    expect(wrapper.vm.isOverridden).toHaveBeenCalledWith(title);
    expect(wrapper.vm.computeScreenVisibility).toHaveBeenCalledWith(title);
  });
  it('determines whether a title should be margined on the left in the TOC based on title screen visibility', () => {
    const title = {
      override: false,
      visible: false,
      children: [
        {
          visible: false,
          override: false,
        },
      ],
      parents: [
        {
          id: 1,
          visible: false,
        },
        {
          id: 2,
          visible: false,
        },
      ],
      directParents: [
        {
          id: 1,
          visible: false,
        },
      ],
    };
    const wrapper = mount(IFCTableOfContents, {
      attachTo: document.body,
      propsData: {
        enableDomListening: false,
      },
    });
    wrapper.vm.updateTitles = jest.fn();
    expect(wrapper.vm.margined(title)).toBe(false);
    title.visible = true;
    expect(wrapper.vm.margined(title)).toBe(true);
  });
  it(`determines whether a title is visible on screen based on whether the top is less than the window innerheight
    and the bottom is above 0`, () => {
    let el = {
      getBoundingClientRect: () => ({
        top: 100,
        bottom: 0,
      }),
    };
    window.innerHeight = 110;
    const wrapper = mount(IFCTableOfContents, {
      attachTo: document.body,
      propsData: {
        enableDomListening: false,
      },
    });
    wrapper.vm.updateTitles = jest.fn();
    expect(wrapper.vm.isInView(el)).toBe(true);
    el = {
      getBoundingClientRect: () => ({
        top: 150,
        bottom: 0,
      }),
    };
    expect(wrapper.vm.isInView(el)).toBe(false);
    el = {
      getBoundingClientRect: () => ({
        top: 100,
        bottom: -10,
      }),
    };
    expect(wrapper.vm.isInView(el)).toBe(false);
  });

  /**
   * Query Selector generation tests
   */
  it('returns the element\'s id for the selector if the element has an id', () => {
    const el = {
      id: 'Test',
    };
    const wrapper = mount(IFCTableOfContents, {
      attachTo: document.body,
      propsData: {
        enableDomListening: false,
      },
    });
    wrapper.vm.updateTitles = jest.fn();
    expect(wrapper.vm.getPathTo(el)).toBe(`id("${el.id}")`);
  });
  it('returns null for an element without id or siblings and isn\'t the document body', () => {
    const el = {
      id: '',
      parentNode: {
        childNodes: [],
      },
    };
    const wrapper = mount(IFCTableOfContents, {
      attachTo: document.body,
      propsData: {
        enableDomListening: false,
      },
    });
    wrapper.vm.updateTitles = jest.fn();
    expect(wrapper.vm.getPathTo(el)).toBe(null);
  });
  it('returns the element\'s tag for the selector if the element is the body tag', () => {
    const wrapper = mount(IFCTableOfContents, {
      attachTo: document.body,
      propsData: {
        enableDomListening: false,
      },
    });
    wrapper.vm.updateTitles = jest.fn();
    expect(wrapper.vm.getPathTo(document.body)).toBe('BODY');
  });
  it('handles multiple sibling elements of the same tag with no id to rely on', () => {
    const el = {
      tagName: 'H1',
      id: '',
      nodeType: Node.ELEMENT_NODE,
      parentNode: {
        id: 'ParentNode',
        nodeType: Node.ELEMENT_NODE,
        childNodes: [
          {
            id: 'Sibling',
            tagName: 'H1',
            nodeType: Node.ELEMENT_NODE,
          },
          {
            id: 'Sibling',
            tagName: 'H1',
            nodeType: Node.TEXT_NODE,
          },
        ],
      },
    };
    el.parentNode.childNodes.push(el);
    const wrapper = mount(IFCTableOfContents, {
      attachTo: document.body,
      propsData: {
        enableDomListening: false,
      },
    });
    wrapper.vm.updateTitles = jest.fn();
    expect(wrapper.vm.getPathTo(el)).toBe('id("ParentNode")/H1[2]');
  });

  /**
   * Title identification tests
   */
  it('handles an array of ignored queries for ignoring elements', () => {
    const el = document.createElement('h2');
    const wrapper = mount(IFCTableOfContents, {
      attachTo: document.body,
      propsData: {
        enableDomListening: false,
        ignoreQuery: [
          'h1,h3',
          'h2',
        ],
      },
    });
    wrapper.vm.updateTitles = jest.fn();
    expect(wrapper.vm.checkIfTitle(el)).toBe(false);
  });
  it('handles a single string ignore query for ignoring elements', () => {
    const el = document.createElement('h2');
    const wrapper = mount(IFCTableOfContents, {
      attachTo: document.body,
      propsData: {
        enableDomListening: false,
        ignoreQuery: 'h1,h2,h3',
      },
    });
    wrapper.vm.updateTitles = jest.fn();
    expect(wrapper.vm.checkIfTitle(el)).toBe(false);
  });
  it('handles a identifying titles with the default query', () => {
    const el = document.createElement('h2');
    const el3 = document.createElement('h3');
    const wrapper = mount(IFCTableOfContents, {
      attachTo: document.body,
      propsData: {
        enableDomListening: false,
      },
    });
    wrapper.vm.updateTitles = jest.fn();
    expect(wrapper.vm.checkIfTitle(el)).toBe(true);
    expect(wrapper.vm.checkIfTitle(el3)).toBe(true);
  });
  it('handles a identifying titles with an overriden query', () => {
    const el = document.createElement('h2');
    const el3 = document.createElement('h3');
    const wrapper = mount(IFCTableOfContents, {
      attachTo: document.body,
      propsData: {
        enableDomListening: false,
        queryOverride: 'h1,h2,h4',
      },
    });
    wrapper.vm.updateTitles = jest.fn();
    expect(wrapper.vm.checkIfTitle(el)).toBe(true);
    expect(wrapper.vm.checkIfTitle(el3)).toBe(false);
  });
  it('determines title type for normal titles when queryOverride is not used', () => {
    const el = document.createElement('h1');
    const el2 = document.createElement('h2');
    const el3 = document.createElement('h3');
    const el4 = document.createElement('h4');
    const el5 = document.createElement('h5');
    const el6 = document.createElement('h6');
    const el7 = document.createElement('h7');
    const wrapper = mount(IFCTableOfContents, {
      attachTo: document.body,
      propsData: {
        enableDomListening: false,
      },
    });
    wrapper.vm.updateTitles = jest.fn();
    expect(wrapper.vm.calculateTitleType(el)).toBe(1);
    expect(wrapper.vm.calculateTitleType(el2)).toBe(2);
    expect(wrapper.vm.calculateTitleType(el3)).toBe(3);
    expect(wrapper.vm.calculateTitleType(el4)).toBe(4);
    expect(wrapper.vm.calculateTitleType(el5)).toBe(5);
    expect(wrapper.vm.calculateTitleType(el6)).toBe(6);
    expect(wrapper.vm.calculateTitleType(el7)).toBe(7);
  });
  it(`determines title type for normal titles when queryOverride is not used, even when elements
    lack the rank attribute`, () => {
    const el = document.createElement('span');
    const el2 = document.createElement('span');
    const wrapper = mount(IFCTableOfContents, {
      attachTo: document.body,
      propsData: {
        enableDomListening: false,
        queryOverride: 'span',
      },
    });
    wrapper.vm.updateTitles = jest.fn();
    el.setAttribute(wrapper.vm.customDataRank, '2');
    expect(wrapper.vm.calculateTitleType(el)).toBe(2);
    expect(wrapper.vm.calculateTitleType(el2)).toBe(1);
  });
  it('appropriately consumes a node tree via breadth first search to generate an approrpiate list of titles in order',
    () => {
      document.body.innerHTML = `
        <div>
          <h1>Title 1</h1>
          <section>
            <h2>Subtitle 1</h2>
            <p>Officia ad ut enim sunt laborum id deserunt fugiat duis deserunt eiusmod cupidatat cupidatat.
            Nulla Lorem minim enim ea cillum amet minim duis ad non elit exercitation. Tempor veniam adipisicing elit
            cillum in magna aliqua commodo dolore sint nostrud.</p>
            <<h3>Subtitle 2</h3>
            <p>Officia ad ut enim sunt laborum id deserunt fugiat duis deserunt eiusmod cupidatat cupidatat.
            Nulla Lorem minim enim ea cillum amet minim duis ad non elit exercitation. Tempor veniam adipisicing elit
            cillum in magna aliqua commodo dolore sint nostrud.</p>
          </section>
          <h1>Title 2</h1>
          <section>
            <h4>
              Subsubtitle 1
            </h4>
            <p>Officia ad ut enim sunt laborum id deserunt fugiat duis deserunt eiusmod cupidatat cupidatat.
            Nulla Lorem minim enim ea cillum amet minim duis ad non elit exercitation. Tempor veniam adipisicing elit
            cillum in magna aliqua commodo dolore sint nostrud.</p>
          </section>
        </div>
      `;
      const wrapper = mount(IFCTableOfContents, {
        attachTo: document.body,
        propsData: {
          enableDomListening: false,
        },
      });

      const [h1, secondH1] = document.getElementsByTagName('h1');
      const [h2] = document.getElementsByTagName('h2');
      const [h3] = document.getElementsByTagName('h3');
      const [h4] = document.getElementsByTagName('h4');
      expect(wrapper.vm.crawl(document.body)).toStrictEqual([
        {
          el: h1,
          id: 'BODY/DIV[1]/H1[1]',
          titleType: 1,
          offset: -1,
          visible: false,
          hovered: false,
          override: false,
        },
        {
          el: h2,
          id: 'BODY/DIV[1]/SECTION[1]/H2[1]',
          titleType: 2,
          offset: -1,
          visible: false,
          hovered: false,
          override: false,
        },
        {
          el: h3,
          id: 'BODY/DIV[1]/SECTION[1]/H3[1]',
          titleType: 3,
          offset: -1,
          visible: false,
          hovered: false,
          override: false,
        },
        {
          el: secondH1,
          id: 'BODY/DIV[1]/H1[2]',
          titleType: 1,
          offset: -1,
          visible: false,
          hovered: false,
          override: false,
        },
        {
          el: h4,
          id: 'BODY/DIV[1]/SECTION[2]/H4[1]',
          titleType: 4,
          offset: -1,
          visible: false,
          hovered: false,
          override: false,
        },
      ]);
    });
  it('short circuits checking titles for visibility when titles length is 0', () => {
    const wrapper = mount(IFCTableOfContents, {
      attachTo: document.body,
      propsData: {
        enableDomListening: false,
        queryOverride: 'span',
      },
    });
    wrapper.vm.updateTitles = jest.fn();
    expect(wrapper.vm.checkTitles()).toBe(-1);
  });

  it('sets first title visibility to true when viewport is at the top', async () => {
    const wrapper = mount(IFCTableOfContents, {
      attachTo: document.body,
      propsData: {
        enableDomListening: false,
        queryOverride: 'span',
      },
    });
    wrapper.vm.updateTitles = jest.fn();
    wrapper.vm.resetVisibleTitles = jest.fn();
    wrapper.vm.titles = [
      {
        override: false,
        visible: false,
        parents: [],
        directParents: [],
        children: [],
        el: {
          innerText: 'Something',
        },
      },
      {
        override: false,
        visible: false,
        parents: [],
        directParents: [],
        children: [],
        el: {
          innerText: 'Something',
        },
      },
      {
        override: false,
        visible: false,
        parents: [],
        directParents: [],
        children: [],
        el: {
          innerText: 'Something',
        },
      },
      {
        override: false,
        visible: false,
        parents: [],
        directParents: [],
        children: [],
        el: {
          innerText: 'Something',
        },
      },
    ];
    wrapper.vm.getWindowPosition = jest.fn(() => 0);
    wrapper.vm.screenHasNoScrollbar = jest.fn(() => true);
    expect(wrapper.vm.checkTitles()).toBe(1);
    expect(wrapper.vm.resetVisibleTitles).toHaveBeenCalled();
    expect(wrapper.vm.titles[0].visible).toBe(true);
  });
  it('sets visibility for titles based on viewport when viewport isn\'t at top or bottom', async () => {
    document.body.style.height = '1000px';
    const wrapper = mount(IFCTableOfContents, {
      attachTo: document.body,
      propsData: {
        enableDomListening: false,
        queryOverride: 'span',
      },
    });
    wrapper.vm.updateTitles = jest.fn();
    wrapper.vm.resetVisibleTitles = jest.fn();
    wrapper.vm.titles = [
      {
        override: false,
        visible: false,
        parents: [],
        directParents: [],
        children: [],
        el: {
          innerText: 'Something',
        },
      },
      {
        override: false,
        visible: false,
        parents: [],
        directParents: [],
        children: [],
        el: {
          innerText: 'Something',
        },
      },
      {
        override: false,
        visible: false,
        parents: [],
        directParents: [],
        children: [],
        el: {
          innerText: 'Something',
        },
      },
      {
        override: false,
        visible: false,
        parents: [],
        directParents: [],
        children: [],
        el: {
          innerText: 'Something',
        },
      },
    ];
    wrapper.vm.getWindowPosition = jest.fn(() => -1000000);
    wrapper.vm.screenHasNoScrollbar = jest.fn(() => true);
    wrapper.vm.setVisibleTitlesBasedOnViewportHeight = jest.fn();
    expect(wrapper.vm.checkTitles()).toBe(1);
    expect(wrapper.vm.setVisibleTitlesBasedOnViewportHeight).toHaveBeenCalled();
  });

  /**
   * Children assignation tests
   */
  it('assigns children to each title retrieved from the DOM based on their title type and their position in the array',
    async () => {
      const wrapper = mount(IFCTableOfContents, {
        attachTo: document.body,
        propsData: {
          enableDomListening: false,
          queryOverride: 'span',
        },
      });
      wrapper.vm.updateTitles = jest.fn();
      wrapper.vm.titles = [
        {
          id: 'h1',
          titleType: 1,
        },
        {
          id: 'h2',
          titleType: 2,
        },
        {
          id: 'h3',
          titleType: 3,
        },
        {
          id: 'h3-2',
          titleType: 3,
        },
        {
          id: 'h2-2',
          titleType: 2,
        },
        {
          id: 'h1-2',
          titleType: 1,
        },
        {
          id: 'h4',
          titleType: 4,
        },
      ];
      wrapper.vm.assignChildren();
      await wrapper.vm.$nextTick();

      /**
       * The structure that is generated by assignChildren is circularly recursive. So we do this instead of
       * a direct strict equals comparison
       */

      // test whether the h1 is appropriately set up
      expect(wrapper.vm.titles[0].siblings.length).toBe(0);
      expect(wrapper.vm.titles[0].directParents.length).toBe(0);
      expect(wrapper.vm.titles[0].parents.length).toBe(0);
      expect(wrapper.vm.titles[0].children.map((child) => child.id)).toStrictEqual([
        'h2', 'h3', 'h3-2', 'h2-2',
      ]);

      // test whether the h2 is appropriately set up
      expect(wrapper.vm.titles[1].children.map((child) => child.id)).toStrictEqual([
        'h3', 'h3-2',
      ]);
      expect(wrapper.vm.titles[1].parents.map((parent) => parent.id)).toStrictEqual(['h1']);
      expect(wrapper.vm.titles[1].directParents.map((parent) => parent.id)).toStrictEqual(['h1']);
      expect(wrapper.vm.titles[1].siblings.map((sibling) => sibling.id)).toStrictEqual([
        'h2-2',
      ]);

      // test whether the h3 is appropriately set up
      expect(wrapper.vm.titles[2].children.length).toBe(0);
      expect(wrapper.vm.titles[2].directParents.length).toBe(0);
      expect(wrapper.vm.titles[2].siblings.map((sibling) => sibling.id)).toStrictEqual([
        'h3-2',
      ]);
      expect(wrapper.vm.titles[2].parents.map((parent) => parent.id)).toStrictEqual([
        'h1', 'h2',
      ]);

      // test whether the second h3 is appropriately set up
      expect(wrapper.vm.titles[3].children.length).toBe(0);
      expect(wrapper.vm.titles[3].siblings.map((sibling) => sibling.id)).toStrictEqual([
        'h3',
      ]);
      expect(wrapper.vm.titles[3].parents.map((parent) => parent.id)).toStrictEqual([
        'h1', 'h2',
      ]);
      expect(wrapper.vm.titles[3].directParents.length).toBe(0);

      // test whether the second h2 is appropriately set up
      expect(wrapper.vm.titles[4].children.length).toBe(0);
      expect(wrapper.vm.titles[4].parents.map((parent) => parent.id)).toStrictEqual([
        'h1',
      ]);
      expect(wrapper.vm.titles[4].siblings.map((sibling) => sibling.id)).toStrictEqual([
        'h2',
      ]);
      expect(wrapper.vm.titles[4].directParents.map((parent) => parent.id)).toStrictEqual([
        'h1',
      ]);

      // test whether the second h1 is appropriately set up
      expect(wrapper.vm.titles[5].children.map((child) => child.id)).toStrictEqual([
        'h4',
      ]);
      expect(wrapper.vm.titles[5].directParents.length).toBe(0);
      expect(wrapper.vm.titles[5].parents.length).toBe(0);
      expect(wrapper.vm.titles[5].siblings.length).toBe(0);

      // test whether the h4 is appropriately set up
      expect(wrapper.vm.titles[6].children.length).toBe(0);
      expect(wrapper.vm.titles[6].siblings.length).toBe(0);
      expect(wrapper.vm.titles[6].directParents.map((parent) => parent.id)).toStrictEqual(['h1-2']);
      expect(wrapper.vm.titles[6].parents.map((parent) => parent.id)).toStrictEqual(['h1-2']);
    });

  it('crawls the document, assigns children, then checks visiblity on updateTitle', () => {
    const wrapper = mount(IFCTableOfContents, {
      attachTo: document.body,
      propsData: {
        enableDomListening: false,
        queryOverride: 'span',
      },
    });
    const { updateTitles } = wrapper.vm;
    wrapper.vm.updateTitles = jest.fn();
    wrapper.vm.crawl = jest.fn();
    wrapper.vm.assignChildren = jest.fn();
    wrapper.vm.checkTitles = jest.fn();
    updateTitles();
    expect(wrapper.vm.crawl).toHaveBeenCalledWith(document.getElementsByTagName('body')[0]);
    expect(wrapper.vm.assignChildren).toHaveBeenCalled();
    expect(wrapper.vm.checkTitles).toHaveBeenCalled();
  });

  it('calls updateTitles only if it receives a mutation to the childList in updateTitlesOnDOMChange', () => {
    const wrapper = mount(IFCTableOfContents, {
      attachTo: document.body,
      propsData: {
        enableDomListening: false,
        queryOverride: 'span',
      },
    });
    wrapper.vm.updateTitles = jest.fn();
    wrapper.vm.updateTitlesOnDOMChange([
      { type: 'SomethingThatIsNotChildList' },
    ]);
    expect(wrapper.vm.updateTitles).not.toHaveBeenCalled();
    wrapper.vm.updateTitlesOnDOMChange([
      { type: 'SomethingThatIsNotChildList' },
      { type: 'childList' },
    ]);
    expect(wrapper.vm.updateTitles).toHaveBeenCalled();
  });

  it('resets all titles to not visible when resetVisibleTitles is called', async () => {
    const wrapper = mount(IFCTableOfContents, {
      attachTo: document.body,
      propsData: {
        enableDomListening: false,
        queryOverride: 'span',
      },
    });
    wrapper.vm.updateTitles = jest.fn();
    wrapper.vm.titles = [
      {
        id: 'h1',
        titleType: 1,
        visible: true,
      },
      {
        id: 'h2',
        titleType: 2,
        visible: true,
      },
      {
        id: 'h3',
        titleType: 3,
        visible: true,
      },
      {
        id: 'h3-2',
        titleType: 3,
        visible: true,
      },
      {
        id: 'h2-2',
        titleType: 2,
        visible: true,
      },
      {
        id: 'h1-2',
        titleType: 1,
        visible: true,
      },
      {
        id: 'h4',
        titleType: 4,
        visible: true,
      },
    ];
    wrapper.vm.resetVisibleTitles();
    wrapper.vm.titles.forEach((title) => {
      expect(title.visible).toBe(false);
    });
  });
  it('sets title visibility to true when the title is below the top of the viewport in the threshold area',
    async () => {
      const wrapper = mount(IFCTableOfContents, {
        attachTo: document.body,
        propsData: {
          enableDomListening: false,
          queryOverride: 'span',
          offset: 0,
        },
      });
      wrapper.vm.updateTitles = jest.fn();
      const viewportHeight = 100;
      wrapper.vm.titles = [
        {
          id: 'h1',
          titleType: 1,
          visible: false,
          el: {
            getBoundingClientRect: () => ({
              top: wrapper.vm.titleOffsetThreshold + wrapper.vm.offset - 1,
              bottom: 0,
            }),
          },
        },
      ];
      wrapper.vm.setVisibleTitlesBasedOnViewportHeight(viewportHeight);
      await wrapper.vm.$nextTick();
      expect(wrapper.vm.titles[0].visible).toBe(true);
    });
  it('does not set visibility when the title is above the viewport', async () => {
    const wrapper = mount(IFCTableOfContents, {
      attachTo: document.body,
      propsData: {
        enableDomListening: false,
        queryOverride: 'span',
        offset: 0,
      },
    });
    wrapper.vm.updateTitles = jest.fn();
    const viewportHeight = 100;
    wrapper.vm.titles = [
      {
        id: 'h2',
        titleType: 2,
        visible: false,
        el: {
          getBoundingClientRect: () => ({
            top: -25,
            bottom: 0,
          }),
        },
      },
    ];
    wrapper.vm.setVisibleTitlesBasedOnViewportHeight(viewportHeight);
    await wrapper.vm.$nextTick();
    expect(wrapper.vm.titles[0].visible).toBe(false);
  });
  it('sets the previous title\'s visibility to true when the current title is below the viewport', async () => {
    const wrapper = mount(IFCTableOfContents, {
      attachTo: document.body,
      propsData: {
        enableDomListening: false,
        queryOverride: 'span',
        offset: 0,
      },
    });
    wrapper.vm.updateTitles = jest.fn();
    const viewportHeight = 100;
    wrapper.vm.titles = [
      {
        id: 'h3',
        titleType: 3,
        visible: false,
        el: {
          getBoundingClientRect: () => ({
            top: -25,
            bottom: 0,
          }),
        },
      },
      {
        id: 'h3',
        titleType: 3,
        visible: true,
        el: {
          getBoundingClientRect: () => ({
            top: viewportHeight,
            bottom: viewportHeight * 2,
          }),
        },
      },
    ];
    wrapper.vm.setVisibleTitlesBasedOnViewportHeight(viewportHeight);
    await wrapper.vm.$nextTick();
    expect(wrapper.vm.titles[0].visible).toBe(true);
    expect(wrapper.vm.titles[1].visible).toBe(false);
  });

  it('returns false when a scrollbar is present', async () => {
    const wrapper = mount(IFCTableOfContents, {
      attachTo: document.body,
      propsData: {
        enableDomListening: false,
        queryOverride: 'span',
        offset: 0,
      },
    });
    expect(wrapper.vm.screenHasNoScrollbar()).toBe(false);
  });
  it('computes a style for the width', async () => {
    const wrapper = mount(IFCTableOfContents, {
      attachTo: document.body,
      propsData: {
        width: 100,
        enableDomListening: false,
        queryOverride: 'span',
        offset: 0,
      },
    });
    expect(wrapper.vm.computedStyle).toStrictEqual({
      'max-width': wrapper.vm.width,
    });
  });
  it('has a base class equal to the base SCSS class', async () => {
    const wrapper = mount(IFCTableOfContents, {
      attachTo: document.body,
      propsData: {
        width: 100,
        enableDomListening: false,
        queryOverride: 'span',
        offset: 0,
      },
    });
    expect(wrapper.vm.baseClass).toBe('IFCTableOfContents');
  });

  it('appropriately polyfills Element.prototype.matches and Array.from', () => {
    Array.from = undefined;
    Element.prototype.matches = undefined;
    TOCPolyfills();
    expect(Array.from).toBeDefined();
    expect(Element.prototype.matches).toBeDefined();
  });
  it('appropriately polyfills SmoothScroll behavior', () => {
    SmoothScrollPolyfill();
  });
  it('installs the plugin and polyfills CustomEvent if necessary', () => {
    window.CustomEvent = undefined;
    Vue.use(IFCTableOfContentsPlugin);
    IFCTableOfContentsPlugin.install(Vue);
    expect(Vue.prototype.$IFCTOCRefresh).toBeDefined();
    Vue.prototype.$IFCTOCRefresh();
    expect(window.CustomEvent).toBeDefined();
  });
  it('dispatches events when the plugin is used', () => {
    window.dispatchEvent = jest.fn();
    window.CustomEvent = undefined;
    Vue.use(IFCTableOfContentsPlugin);
    IFCTableOfContentsPlugin.install(Vue);
    expect(Vue.prototype.$IFCTOCRefresh).toBeDefined();
    Vue.prototype.$IFCTOCRefresh();
    expect(window.dispatchEvent).toHaveBeenCalled();
  });
});
