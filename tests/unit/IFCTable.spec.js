import { mount } from '@vue/test-utils';
import { IFCTable } from '@Components/Table/IFCTable.vue';
import { StringReplaceAllPolyfill } from '@Components/StringReplaceAllPolyfill';

StringReplaceAllPolyfill();
describe('IFCTable', () => {
  it('has prop hideActiveFilters of type: Boolean, with default: false', () => {
    const { hideActiveFilters } = IFCTable.props;
    expect(hideActiveFilters.type).toBe(Boolean);
    expect(hideActiveFilters.default).toBe(false);
  });
  it('has prop hideSpacing of type: Boolean, with default: false', () => {
    const { hideSpacing } = IFCTable.props;
    expect(hideSpacing.type).toBe(Boolean);
    expect(hideSpacing.default).toBe(false);
  });
  it('has prop hidePagination of type: Boolean, with default: false', () => {
    const { hidePagination } = IFCTable.props;
    expect(hidePagination.type).toBe(Boolean);
    expect(hidePagination.default).toBe(false);
  });
  it('has prop hidePaginationSizeControls of type: Boolean, with default: false', () => {
    const { hidePaginationSizeControls } = IFCTable.props;
    expect(hidePaginationSizeControls.type).toBe(Boolean);
    expect(hidePaginationSizeControls.default).toBe(false);
  });
  it('has prop hideFilters of type: Boolean, with default: false', () => {
    const { hideFilters } = IFCTable.props;
    expect(hideFilters.type).toBe(Boolean);
    expect(hideFilters.default).toBe(false);
  });
  it('has prop textAlign of type: String, with default: \'left\'', () => {
    const { textAlign } = IFCTable.props;
    expect(textAlign.type).toBe(String);
    expect(textAlign.default).toBe('left');
  });
  it('has prop showActions of type: Boolean, with default: false', () => {
    const { showActions } = IFCTable.props;
    expect(showActions.type).toBe(Boolean);
    expect(showActions.default).toBe(false);
  });
  it('has prop actions of type: Array, with default: [] that validates all actions to be strings', () => {
    const { actions } = IFCTable.props;
    expect(actions.type).toBe(Array);
    expect(actions.default()).toStrictEqual([]);
    const { validator } = actions;
    expect(validator([1])).toBe(false);
    expect(validator([])).toBe(true);
    expect(validator(['asdf'])).toBe(true);
    expect(validator(['asdf', 1])).toBe(false);
  });

  it('has prop sizing of type: String with default: \'regular\'', () => {
    const { sizing } = IFCTable.props;
    expect(sizing.type).toBe(String);
    expect(sizing.default).toBe('regular');
  });

  it('has prop pageSizes of type: Array, with default: [25,50,100] that validates that all page sizes are numbers',
    () => {
      const { pageSizes } = IFCTable.props;
      expect(pageSizes.type).toBe(Array);
      expect(pageSizes.default()).toStrictEqual([25, 50, 100]);
      const { validator } = pageSizes;
      expect(validator([1])).toBe(true);
      expect(validator([])).toBe(true);
      expect(validator(['asdf'])).toBe(false);
      expect(validator(['1'])).toBe(true);
    });

  it('has prop resultsPerPage of type: Number with default: 25', () => {
    const { resultsPerPage } = IFCTable.props;
    expect(resultsPerPage.type).toBe(Number);
    expect(resultsPerPage.default).toBe(25);
  });

  it('has prop page of type: Number with default: 1', () => {
    const { page } = IFCTable.props;
    expect(page.type).toBe(Number);
    expect(page.default).toBe(1);
  });

  it('has prop pages of type: [Array, Number], with default: 1, that validates value as a number or array of numbers',
    () => {
      const { pages } = IFCTable.props;
      expect(pages.type).toStrictEqual([Array, Number]);
      expect(pages.default).toBe(1);
      const { validator } = pages;
      expect(validator(1)).toBe(true);
      expect(validator([1])).toBe(true);
      expect(validator([])).toBe(true);
      expect(validator(['asdf'])).toBe(false);
      expect(validator(['asdf', 1])).toBe(false);
    });

  it('has prop sizes of type: Array, with default ["condensed", "regular", "relaxed"] that validates an array of str',
    () => {
      const { sizes } = IFCTable.props;
      expect(sizes.type).toBe(Array);
      expect(sizes.default()).toStrictEqual(['condensed', 'regular', 'relaxed']);
      const { validator } = sizes;
      expect(validator([])).toBe(true);
      expect(validator(['asdf'])).toBe(true);
      expect(validator(['asdf', 1])).toBe(false);
      expect(validator([1])).toBe(false);
    });

  it('has prop defineKey of type: Function', () => {
    const { defineKey } = IFCTable.props;
    expect(defineKey.type).toBe(Function);
  });

  it('has prop computeSortable of type: Function with default: (key) => false', () => {
    const { computeSortable } = IFCTable.props;
    expect(computeSortable.type).toBe(Function);
    expect(computeSortable.default.length).toBe(1);
    expect(computeSortable.default()).toBe(false);
  });

  it('has prop computeSortDirection of type: Function with default: (key) => \'descending\'', () => {
    const { computeSortDirection } = IFCTable.props;
    expect(computeSortDirection.type).toBe(Function);
    expect(computeSortDirection.default.length).toBe(1);
    expect(computeSortDirection.default()).toBe('descending');
  });

  it('has prop computeFitContent of type: Function with default: (key) => false', () => {
    const { computeFitContent } = IFCTable.props;
    expect(computeFitContent.type).toBe(Function);
    expect(computeFitContent.default.length).toBe(1);
    expect(computeFitContent.default()).toBe(false);
  });

  it('has prop computeActivelySortedHeader of type: Function with default: (key) => false', () => {
    const { computeActivelySortedHeader } = IFCTable.props;
    expect(computeActivelySortedHeader.type).toBe(Function);
    expect(computeActivelySortedHeader.default.length).toBe(1);
    expect(computeActivelySortedHeader.default()).toBe(false);
  });

  it('has prop computeInteractive of type: Function with default: (system, isHeader, key) => false', () => {
    const { computeInteractive } = IFCTable.props;
    expect(computeInteractive.type).toBe(Function);
    expect(computeInteractive.default.length).toBe(3);
    expect(computeInteractive.default()).toBe(false);
  });

  it('has prop grid of type: Boolean with default: false', () => {
    const { grid } = IFCTable.props;
    expect(grid.type).toBe(Boolean);
    expect(grid.default).toBe(false);
  });
  it('has prop resizeable of type: Boolean with default: false', () => {
    const { resizeable } = IFCTable.props;
    expect(resizeable.type).toBe(Boolean);
    expect(resizeable.default).toBe(false);
  });
  it('has prop hoverable of type: Boolean with default: false', () => {
    const { hoverable } = IFCTable.props;
    expect(hoverable.type).toBe(Boolean);
    expect(hoverable.default).toBe(false);
  });
  it('has prop outlined of type: Boolean with default: false', () => {
    const { outlined } = IFCTable.props;
    expect(outlined.type).toBe(Boolean);
    expect(outlined.default).toBe(false);
  });
  it('has prop striped of type: Boolean with default: false', () => {
    const { striped } = IFCTable.props;
    expect(striped.type).toBe(Boolean);
    expect(striped.default).toBe(false);
  });
  it('has prop items of type: Array with default: []', () => {
    const { items } = IFCTable.props;
    expect(items.type).toBe(Array);
    expect(items.default()).toStrictEqual([]);
  });
  it('creates a unique set of keys that the items contain', () => {
    const wrapper = mount(IFCTable, {
      propsData: {
        items: [
          {
            aircraft_type: 1,
          },
          {
            battleProfile: 1,
          },
          {
            'Aircraft Type': 1,
          },
          {
            charliecompany: 1,
          },
        ],
      },
      slots: {
      },
    });
    expect(wrapper.vm.generatePossibleKeys(wrapper.vm.items)).toStrictEqual([
      {
        key: 'aircraft_type',
        text: 'Aircraft Type',
      },
      {
        key: 'battleProfile',
        text: 'Battle Profile',
      },
      {
        key: 'Aircraft Type',
        text: 'Aircraft Type',
      },
      {
        key: 'charliecompany',
        text: 'Charliecompany',
      },
    ]);
  });
});
