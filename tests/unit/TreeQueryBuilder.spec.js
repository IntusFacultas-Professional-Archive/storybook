import { Expression } from '@Components/TreeQueryBuilder/Expression.vue';
import { TreeExpressionController } from '@Components/TreeQueryBuilder/TreeExpressionController.vue';
import { IFCTreeQueryBuilder } from '@Components/TreeQueryBuilder/IFCTreeQueryBuilder.vue';
import { deepClone } from '@Components/utils';
import { mount } from '@vue/test-utils';
import {
  eventFactory,
  expressionIdGenerator,
  EXPRESSION_TYPE,
  treeIdGenerator,
  validateExpressionState,
} from '@Components/TreeQueryBuilder/utils';

class FakeTreeExpressionController {
  constructor(
    invalidExpressions = [],
    invalidTrees = [],
    child = {},
    operators = [],
    treeOperators = [],
    listOperators = [],
  ) {
    this.invalidExpressions = invalidExpressions;
    this.invalidTrees = invalidTrees;
    this.expressionIds = expressionIdGenerator();
    this.treeIds = treeIdGenerator();
    this.child = child;
    this.operators = operators;
    this.treeOperators = treeOperators;
    this.listOperators = listOperators;
    this.$emit = jest.fn();
  }
  /**
   * This function doesn't use this because we are mocking Vue.set which is a static function
   */
  /* eslint-disable-next-line */
  $set(el, property, value) {
    /**
     * $set by design modifies the passed in parameter. This is a necessity.
     */
    /* eslint-disable-next-line no-param-reassign */
    el[property] = value;
  }
}

describe('utils.js', () => {
  it('exports a valid expression type for use by components', () => {
    expect(EXPRESSION_TYPE).toBeDefined();
  });
  it('can validate an expression that doesn\'t use a list operator', () => {
    expect(validateExpressionState([], '', '', '')).toBe(false);
    expect(validateExpressionState([], 'a', '', '')).toBe(false);
    expect(validateExpressionState([], 'a', 'b', '')).toBe(false);
    expect(validateExpressionState([], 'a', 'b', 'c')).toBe(true);
  });
  it('can validate an expression that does use a list operator', () => {
    expect(validateExpressionState(['a'], '', '', '')).toBe(false);
    expect(validateExpressionState(['a'], 'a', '', '')).toBe(false);
    expect(validateExpressionState(['a'], 'a', 'b', '')).toBe(false);
    expect(validateExpressionState(['a'], 'a', 'b', 'c')).toBe(false);
    expect(validateExpressionState(['a'], 'a', ['b'], 'c')).toBe(true);
    expect(validateExpressionState(['a'], 'a', [''], 'c')).toBe(false);
    expect(validateExpressionState(['a'], 'a', [], 'c')).toBe(false);
  });
  it('has a tree id generator that is a generator function', () => {
    const generator = treeIdGenerator();
    expect(generator).toBeDefined();
    expect(generator.next().value).toBeDefined();
  });
  it('has a expression id generator that is a generator function', () => {
    const generator = expressionIdGenerator();
    expect(generator).toBeDefined();
    expect(generator.next().value).toBeDefined();
  });
  it('exports an event factory that returns a well formed event based on passed in args', () => {
    const event1 = eventFactory(1);
    const event2 = eventFactory(1, false);
    const event3 = eventFactory(1, true, true);
    expect(event1).toStrictEqual({ value: 1, valid: true, handled: false });
    expect(event2).toStrictEqual({ value: 1, valid: false, handled: false });
    expect(event3).toStrictEqual({ value: 1, valid: true, handled: true });
  });
});

describe('TreeExpressionController.vue', () => {
  /**
   * So the reason these tests don't mount TreeExpressionController is that something about the recursive nature
   * of this component causes Jest to fatal error out. Given I have a week left before I leave, I want to prioritize
   * code coverage over just leaving this for someone else to solve. Feel free to do more research and rewrite these
   * tests with proper mounts.
   */
  it('has an appropriately formatted data function', () => {
    const data = TreeExpressionController.data();
    expect(data.EXPRESSION_TYPE).toBe(EXPRESSION_TYPE);
    expect(data.invalidTrees).toStrictEqual([]);
    expect(data.invalidExpressions).toStrictEqual([]);
    expect(data.expressionIds).toBe(null);
    expect(data.treeIds).toBe(null);
  });
  it('has an appropriate base class', () => {
    expect(TreeExpressionController.computed.baseClass()).toBe('IFCTreeQueryBuilderTree');
  });
  it('correctly adds error class if there are invalid expressions', () => {
    const comp = new FakeTreeExpressionController([1, 2, 3]);
    comp.baseClass = '';
    const extractedMethod = TreeExpressionController.computed.computedClass.bind(comp);
    expect(extractedMethod()['--error']).toBe(true);
  });
  it('correctly adds error class if there are invalid trees', () => {
    const comp = new FakeTreeExpressionController([], [1, 2, 3]);
    comp.baseClass = '';
    const extractedMethod = TreeExpressionController.computed.computedClass.bind(comp);
    expect(extractedMethod()['--error']).toBe(true);
  });
  it('correctly determines if child is tree based on tree operators', () => {
    const comp = new FakeTreeExpressionController([], [], { type: 'AND' }, [], ['AND']);
    let extractedMethod = TreeExpressionController.computed.childIsTree.bind(comp);
    expect(extractedMethod()).toBe(true);
    const comp2 = new FakeTreeExpressionController([], [], { type: EXPRESSION_TYPE }, [], ['AND']);
    extractedMethod = TreeExpressionController.computed.childIsTree.bind(comp2);
    expect(extractedMethod()).toBe(false);
  });
  it('correctly does not add error class if there are no invalid trees or expressions', () => {
    const comp = new FakeTreeExpressionController([], []);
    comp.baseClass = '';
    const extractedMethod = TreeExpressionController.computed.computedClass.bind(comp);
    expect(extractedMethod()['--error']).toBe(false);
  });
  it('calls validateState on mount and initializes the generators', () => {
    const comp = new FakeTreeExpressionController([1, 2, 3]);
    comp.validateState = jest.fn();
    const extractedMethod = TreeExpressionController.mounted.bind(comp);
    extractedMethod();
    expect(comp.validateState).toHaveBeenCalled();
    expect(comp.expressionIds).toBeDefined();
    expect(comp.treeIds).toBeDefined();
  });
  it('invalidates self on mount if child is expression and expression isn\'t filled out', () => {
    const comp = new FakeTreeExpressionController([], [], {
      id: 1, type: EXPRESSION_TYPE, opr: '', key: '', value: '',
    });
    comp.validateState = jest.fn();
    comp.handleInvalidation = jest.fn();
    const extractedMethod = TreeExpressionController.mounted.bind(comp);
    extractedMethod();
    expect(comp.handleInvalidation).toHaveBeenCalledWith(comp.child);
  });
  it('does not invalidate self on mount if child is expression and expression is filled out', () => {
    const comp = new FakeTreeExpressionController([], [], {
      id: 1, type: EXPRESSION_TYPE, key: 'a', opr: 'a', value: 'a',
    });
    comp.validateState = jest.fn();
    comp.handleInvalidation = jest.fn();
    const extractedMethod = TreeExpressionController.mounted.bind(comp);
    extractedMethod();
    expect(comp.handleInvalidation).not.toHaveBeenCalled();
  });
  it('invalidates self on mount if child is tree and children.length === 0', () => {
    // this by definition happens when user clicks new branch
    const comp = new FakeTreeExpressionController([], [], { id: 1, type: 'AND', children: [] }, [], ['AND']);
    comp.validateState = jest.fn();
    comp.handleTreeInvalidation = jest.fn();
    const extractedMethod = TreeExpressionController.mounted.bind(comp);
    extractedMethod();
    expect(comp.handleTreeInvalidation).toHaveBeenCalledWith(comp.child.id);
  });
  it('invalidates self on mount if child is tree and children.length === 1', () => {
    // this by definition happens when user clicks new branch
    const comp = new FakeTreeExpressionController([], [], {
      id: 1,
      type: 'AND',
      children: [
        {
          type: EXPRESSION_TYPE,
        },
      ],
    }, [], ['AND']);
    comp.validateState = jest.fn();
    comp.handleTreeInvalidation = jest.fn();
    const extractedMethod = TreeExpressionController.mounted.bind(comp);
    extractedMethod();
    expect(comp.handleTreeInvalidation).toHaveBeenCalledWith(comp.child.id);
  });
  it('does not self on mount if child is tree and children.length === 2', () => {
    // this by definition happens when user clicks new branch
    const comp = new FakeTreeExpressionController([], [], {
      id: 1,
      type: 'AND',
      children: [
        {
          type: EXPRESSION_TYPE,
        },
        {
          type: EXPRESSION_TYPE,
        },
      ],
    }, [], ['AND']);
    comp.validateState = jest.fn();
    comp.handleTreeInvalidation = jest.fn();
    const extractedMethod = TreeExpressionController.mounted.bind(comp);
    extractedMethod();
    expect(comp.handleTreeInvalidation).not.toHaveBeenCalledWith(comp.child.id);
  });
  it('correctly removes a now valid expression from a list of invalid expressions', () => {
    const comp = new FakeTreeExpressionController([1, 2, 3]);
    const extractedMethod = TreeExpressionController.methods.handleValidation.bind(comp);
    extractedMethod({ id: 2 });
    expect(comp.invalidExpressions.includes(2)).toBe(false);
  });
  it('correctly adds a now invalid expression to the list of invalid expressions without duplication', () => {
    const comp = new FakeTreeExpressionController([]);
    const extractedMethod = TreeExpressionController.methods.handleInvalidation.bind(comp);
    extractedMethod({ id: 2 });
    extractedMethod({ id: 2 });
    expect(comp.invalidExpressions.includes(2)).toBe(true);
    expect(comp.invalidExpressions.length).toBe(1);
  });
  it('correctly removes a now valid tree from a list of valid trees', () => {
    const comp = new FakeTreeExpressionController([], [1]);
    const extractedMethod = TreeExpressionController.methods.handleTreeValidation.bind(comp);
    extractedMethod({ id: 1 });
    expect(comp.invalidExpressions.includes(1)).toBe(false);
  });
  it('correctly adds a now invalid tree to the list of invalid trees without duplication', () => {
    const comp = new FakeTreeExpressionController([]);
    const extractedMethod = TreeExpressionController.methods.handleTreeInvalidation.bind(comp);
    extractedMethod(2);
    extractedMethod(2);
    expect(comp.invalidTrees.includes(2)).toBe(true);
    expect(comp.invalidTrees.length).toBe(1);
  });
  it('correctly adds an invalid expression then emits a change event on expressionFactory call', () => {
    const comp = new FakeTreeExpressionController([], [], {
      children: [],
    }, ['EQUALS']);
    comp.handleInvalidation = jest.fn();
    const extractedMethod = TreeExpressionController.methods.expressionFactory.bind(comp);
    extractedMethod();
    expect(comp.handleInvalidation).toHaveBeenCalledWith(comp.child.children[0]);
    expect(comp.child.children.length).toBe(1);
    expect(typeof comp.child.children[0].id).toBeDefined();
    expect(comp.child.children[0].type).toBe(EXPRESSION_TYPE);
    expect(comp.child.children[0].opr).toBe('EQUALS');
    expect(comp.child.children[0].value).toBe('');
    expect(comp.$emit).toHaveBeenCalledWith('change', { handled: false, valid: false, value: comp.child });
  });
  it('correctly adds an expression when no operators are provided', () => {
    const comp = new FakeTreeExpressionController([], [], {
      children: [],
    });
    comp.handleInvalidation = jest.fn();
    const extractedMethod = TreeExpressionController.methods.expressionFactory.bind(comp);
    extractedMethod();
    expect(comp.child.children.length).toBe(1);
    expect(comp.child.children[0].opr).toBe('NO OPERATORS PROVIDED');
  });
  it('correctly adds an invalid tree then emits a change event on treeFactory call', () => {
    const comp = new FakeTreeExpressionController([], [], {
      children: [],
    }, ['EQUALS']);
    const extractedMethod = TreeExpressionController.methods.treeFactory.bind(comp);
    comp.handleTreeInvalidation = jest.fn();
    extractedMethod('AND');
    expect(comp.handleTreeInvalidation).toHaveBeenCalledWith(comp.child.children[0].id);
    expect(comp.child.children.length).toBe(1);
    expect(typeof comp.child.children[0].id).toBeDefined();
    expect(comp.child.children[0].type).toBe('AND');
    expect(Array.isArray(comp.child.children[0].children)).toBe(true);
    expect(comp.$emit).toHaveBeenCalledWith('change', { handled: false, valid: false, value: comp.child });
  });

  /**
   * Disabled because we don't want multi line test descriptions in the console
   */
  /* eslint-disable-next-line max-len */
  it('shortcircuits validateState when the child type is Expression because Expression validation is handled in Expression.vue', () => {
    const comp = new FakeTreeExpressionController([], [], {
      type: EXPRESSION_TYPE,
    }, ['EQUALS']);
    const extractedMethod = TreeExpressionController.methods.validateState.bind(comp);
    expect(extractedMethod()).toBe(0);
  });
  it('invalidates self when type is tree and children.length !== 2', () => {
    const comp = new FakeTreeExpressionController([], [], {
      type: 'AND',
      children: [],
    }, ['EQUALS'], ['AND']);
    comp.handleTreeInvalidation = jest.fn();
    const extractedMethod = TreeExpressionController.methods.validateState.bind(comp);
    expect(extractedMethod()).toBe(-1);
    expect(comp.$emit).not.toHaveBeenCalled();
  });
  it('invalidates self when type is tree and children.length !== 2 and emits change when event is not undefined',
    () => {
      const comp = new FakeTreeExpressionController([], [], {
        type: 'AND',
        children: [],
      }, ['EQUALS'], ['AND']);
      comp.handleTreeInvalidation = jest.fn();
      const extractedMethod = TreeExpressionController.methods.validateState.bind(comp);
      expect(extractedMethod(1)).toBe(-1);
      expect(comp.$emit).toHaveBeenCalledWith('change', eventFactory(comp.child, false));
    });
  it('invalidates self when one of its expression children are invalid and only emits when event is defined', () => {
    const comp = new FakeTreeExpressionController([2], [], {
      type: 'AND',
      children: [
        {
          id: 2,
          type: EXPRESSION_TYPE,
        },
        {
          id: 3,
          type: EXPRESSION_TYPE,
        },
      ],
    }, ['EQUALS'], ['AND']);
    comp.handleTreeInvalidation = jest.fn();
    const extractedMethod = TreeExpressionController.methods.validateState.bind(comp);
    expect(extractedMethod()).toBe(1);
    expect(extractedMethod(1)).toBe(1);
    expect(comp.handleTreeInvalidation).toHaveBeenCalledWith(comp.child.id);
    expect(comp.$emit).toHaveBeenCalledWith('change', eventFactory(comp.child, false));
  });
  it('invalidates self when both of its expression children are invalid and only emits when event is defined', () => {
    const comp = new FakeTreeExpressionController([2, 3], [], {
      type: 'AND',
      children: [
        {
          id: 2,
          type: EXPRESSION_TYPE,
        },
        {
          id: 3,
          type: EXPRESSION_TYPE,
        },
      ],
    }, ['EQUALS'], ['AND']);
    comp.handleTreeInvalidation = jest.fn();
    const extractedMethod = TreeExpressionController.methods.validateState.bind(comp);
    expect(extractedMethod()).toBe(1);
    expect(extractedMethod(1)).toBe(1);
    expect(comp.handleTreeInvalidation).toHaveBeenCalledWith(comp.child.id);
    expect(comp.$emit).toHaveBeenCalledWith('change', eventFactory(comp.child, false));
  });
  it('invalidates self when one of its tree children are invalid and only emits when event is defined', () => {
    const comp = new FakeTreeExpressionController([], [3], {
      type: 'AND',
      children: [
        {
          id: 2,
          type: EXPRESSION_TYPE,
        },
        {
          id: 3,
          type: 'AND',
        },
      ],
    }, ['EQUALS'], ['AND']);
    comp.handleTreeInvalidation = jest.fn();
    const extractedMethod = TreeExpressionController.methods.validateState.bind(comp);
    expect(extractedMethod()).toBe(1);
    expect(extractedMethod(1)).toBe(1);
    expect(comp.handleTreeInvalidation).toHaveBeenCalledWith(comp.child.id);
    expect(comp.$emit).toHaveBeenCalledWith('change', eventFactory(comp.child, false));
  });
  it('invalidates self when both of its tree children are invalid and only emits when event is defined', () => {
    const comp = new FakeTreeExpressionController([], [2, 3], {
      type: 'AND',
      children: [
        {
          id: 2,
          type: 'AND',
        },
        {
          id: 3,
          type: 'AND',
        },
      ],
    }, ['EQUALS'], ['AND']);
    comp.handleTreeInvalidation = jest.fn();
    const extractedMethod = TreeExpressionController.methods.validateState.bind(comp);
    expect(extractedMethod()).toBe(1);
    expect(extractedMethod(1)).toBe(1);
    expect(comp.handleTreeInvalidation).toHaveBeenCalledWith(comp.child.id);
    expect(comp.$emit).toHaveBeenCalledWith('change', eventFactory(comp.child, false));
  });
  it('validates self when both of its tree children are valid and only emits when event is defined', () => {
    const comp = new FakeTreeExpressionController([], [], {
      type: 'AND',
      children: [
        {
          id: 2,
          type: 'AND',
        },
        {
          id: 3,
          type: 'AND',
        },
      ],
    }, ['EQUALS'], ['AND']);
    comp.handleTreeValidation = jest.fn();
    const extractedMethod = TreeExpressionController.methods.validateState.bind(comp);
    expect(extractedMethod()).toBe(2);
    expect(extractedMethod(1)).toBe(2);
    expect(comp.handleTreeValidation).toHaveBeenCalledWith(comp.child.id);
    expect(comp.$emit).toHaveBeenCalledWith('change', eventFactory(comp.child, true));
  });
  it('validates self when both of its expression children are valid and only emits when event is defined', () => {
    const comp = new FakeTreeExpressionController([], [], {
      type: 'AND',
      children: [
        {
          id: 2,
          type: EXPRESSION_TYPE,
        },
        {
          id: 3,
          type: EXPRESSION_TYPE,
        },
      ],
    }, ['EQUALS'], ['AND']);
    comp.handleTreeValidation = jest.fn();
    const extractedMethod = TreeExpressionController.methods.validateState.bind(comp);
    expect(extractedMethod()).toBe(2);
    expect(extractedMethod(1)).toBe(2);
    expect(comp.handleTreeValidation).toHaveBeenCalledWith(comp.child.id);
    expect(comp.$emit).toHaveBeenCalledWith('change', eventFactory(comp.child, true));
  });
  it('validates self when both of its mixed children are valid and only emits when event is defined', () => {
    const comp = new FakeTreeExpressionController([], [], {
      type: 'AND',
      children: [
        {
          id: 2,
          type: 'AND',
        },
        {
          id: 3,
          type: EXPRESSION_TYPE,
        },
      ],
    }, ['EQUALS'], ['AND']);
    comp.handleTreeValidation = jest.fn();
    const extractedMethod = TreeExpressionController.methods.validateState.bind(comp);
    expect(extractedMethod()).toBe(2);
    expect(extractedMethod(1)).toBe(2);
    expect(comp.handleTreeValidation).toHaveBeenCalledWith(comp.child.id);
    expect(comp.$emit).toHaveBeenCalledWith('change', eventFactory(comp.child, true));
  });
  it('validates self when both of its mixed in alternate order children are valid and only emits when event is defined',
    () => {
      const comp = new FakeTreeExpressionController([], [], {
        type: 'AND',
        children: [
          {
            id: 3,
            type: EXPRESSION_TYPE,
          },
          {
            id: 2,
            type: 'AND',
          },
        ],
      }, ['EQUALS'], ['AND']);
      comp.handleTreeValidation = jest.fn();
      const extractedMethod = TreeExpressionController.methods.validateState.bind(comp);
      expect(extractedMethod()).toBe(2);
      expect(extractedMethod(1)).toBe(2);
      expect(comp.handleTreeValidation).toHaveBeenCalledWith(comp.child.id);
      expect(comp.$emit).toHaveBeenCalledWith('change', eventFactory(comp.child, true));
    });
  it('shorcircuits update if event has already been handled', () => {
    const comp = new FakeTreeExpressionController([], [], {
      type: 'AND',
      children: [
        {
          id: 3,
          type: EXPRESSION_TYPE,
        },
        {
          id: 2,
          type: 'AND',
        },
      ],
    }, ['EQUALS'], ['AND']);
    const extractedMethod = TreeExpressionController.methods.handleUpdate.bind(comp);
    expect(extractedMethod({ handled: true })).toBe(-1);
  });
  it('emits change and shorcircuits update if child type is expression', () => {
    const comp = new FakeTreeExpressionController([], [], {
      type: EXPRESSION_TYPE,
      children: [
        {
          id: 3,
          type: EXPRESSION_TYPE,
        },
        {
          id: 2,
          type: 'AND',
        },
      ],
    }, ['EQUALS'], ['AND']);
    const extractedMethod = TreeExpressionController.methods.handleUpdate.bind(comp);
    const event = { handled: false };
    expect(extractedMethod(event)).toBe(0);
    expect(comp.$emit).toHaveBeenCalledWith('change', event);
  });
  it('updates expression child, handlesValidation for child and calls validateState on a valid event', () => {
    const child1 = {
      id: 3,
      type: EXPRESSION_TYPE,
    };
    const comp = new FakeTreeExpressionController([], [], {
      type: 'AND',
      children: [
        child1,
        {
          id: 2,
          type: 'AND',
        },
      ],
    }, ['EQUALS'], ['AND']);
    comp.validateState = jest.fn();
    comp.handleValidation = jest.fn();
    const extractedMethod = TreeExpressionController.methods.handleUpdate.bind(comp);
    const event = eventFactory({ ...child1, value: 1 });
    expect(extractedMethod(event)).toBe(1);
    expect(comp.child.children[0].value).toBe(1);
    expect(comp.handleValidation).toHaveBeenCalledWith(event.value);
    expect(comp.validateState).toHaveBeenCalledWith(event);
  });
  it('updates tree child, handlesTreeValidation for child and calls validateState on a valid event', () => {
    const child1 = {
      id: 3,
      type: EXPRESSION_TYPE,
    };
    const child2 = {
      id: 2,
      type: 'AND',
    };
    const comp = new FakeTreeExpressionController([], [], {
      type: 'AND',
      children: [
        child1,
        child2,
      ],
    }, ['EQUALS'], ['AND']);
    comp.validateState = jest.fn();
    comp.handleTreeValidation = jest.fn();
    const extractedMethod = TreeExpressionController.methods.handleUpdate.bind(comp);
    const event = eventFactory({ ...child2, value: 1 });
    expect(extractedMethod(event)).toBe(1);
    expect(comp.child.children[1].value).toBe(1);
    expect(comp.handleTreeValidation).toHaveBeenCalledWith(event.value.id);
    expect(comp.validateState).toHaveBeenCalledWith(event);
  });
  it('updates expression child, handlesInvalidation for child and calls validateState on a invalid event', () => {
    const child1 = {
      id: 3,
      type: EXPRESSION_TYPE,
    };
    const comp = new FakeTreeExpressionController([], [], {
      type: 'AND',
      children: [
        child1,
        {
          id: 2,
          type: 'AND',
        },
      ],
    }, ['EQUALS'], ['AND']);
    comp.validateState = jest.fn();
    comp.handleInvalidation = jest.fn();
    const extractedMethod = TreeExpressionController.methods.handleUpdate.bind(comp);
    const event = eventFactory({ ...child1, value: 1 }, false);
    expect(extractedMethod(event)).toBe(1);
    expect(comp.child.children[0].value).toBe(1);
    expect(comp.handleInvalidation).toHaveBeenCalledWith(event.value);
    expect(comp.validateState).toHaveBeenCalledWith(event);
  });
  it('updates tree child, handlesTreeInvalidation for child and calls validateState on a valid event', () => {
    const child1 = {
      id: 3,
      type: EXPRESSION_TYPE,
    };
    const child2 = {
      id: 2,
      type: 'AND',
    };
    const comp = new FakeTreeExpressionController([], [], {
      type: 'AND',
      children: [
        child1,
        child2,
      ],
    }, ['EQUALS'], ['AND']);
    comp.validateState = jest.fn();
    comp.handleTreeInvalidation = jest.fn();
    const extractedMethod = TreeExpressionController.methods.handleUpdate.bind(comp);
    const event = eventFactory({ ...child2, value: 1 }, false);
    expect(extractedMethod(event)).toBe(1);
    expect(comp.child.children[1].value).toBe(1);
    expect(comp.handleTreeInvalidation).toHaveBeenCalledWith(event.value.id);
    expect(comp.validateState).toHaveBeenCalledWith(event);
  });

  it('shorcircuits delete if event has already been handled', () => {
    const comp = new FakeTreeExpressionController([], [], {
      type: 'AND',
      children: [
        {
          id: 3,
          type: EXPRESSION_TYPE,
        },
        {
          id: 2,
          type: 'AND',
        },
      ],
    }, ['EQUALS'], ['AND']);
    const extractedMethod = TreeExpressionController.methods.handleDeletion.bind(comp);
    expect(extractedMethod({ handled: true })).toBe(-1);
  });
  it('shorcircuits delete and emits delete if child is of type expression', () => {
    const comp = new FakeTreeExpressionController([], [], {
      type: EXPRESSION_TYPE,
    }, ['EQUALS'], ['AND']);
    const extractedMethod = TreeExpressionController.methods.handleDeletion.bind(comp);
    const event = { handled: false };
    expect(extractedMethod(event)).toBe(0);
    expect(comp.$emit).toHaveBeenCalledWith('delete', event);
  });
  it('self deletes if it has no children left as a tree node', () => {
    const comp = new FakeTreeExpressionController([], [], {
      type: 'AND',
      id: 1,
      children: [],
    }, ['EQUALS'], ['AND']);
    const extractedMethod = TreeExpressionController.methods.handleDeletion.bind(comp);
    const event = { handled: false };
    expect(extractedMethod(event)).toBe(1);
    expect(comp.$emit).toHaveBeenCalledWith('delete', { handled: false, value: { id: 1 } });
  });
  /**
   * multi line story descriptions suck in console
   */
  /* eslint-disable-next-line max-len */
  it('deletes expression child, invalidate self, and removes child id from invalid list to avoid zombies if event has not already been handled', () => {
    const child1 = {
      id: 3,
      type: EXPRESSION_TYPE,
    };
    const child2 = {
      id: 2,
      type: 'AND',
    };
    const comp = new FakeTreeExpressionController([], [], {
      type: 'AND',
      id: 'tree-1',
      children: [
        child1,
        child2,
      ],
    }, ['EQUALS'], ['AND']);
    comp.handleValidation = jest.fn();
    comp.handleTreeInvalidation = jest.fn();
    const extractedMethod = TreeExpressionController.methods.handleDeletion.bind(comp);
    const event = { handled: false, value: { id: child1.id } };
    expect(extractedMethod(event)).toBe(2);
    expect(comp.child.children.length).toBe(1);
    expect(event.handled).toBe(true);
    expect(comp.handleValidation).toHaveBeenCalledWith(child1);
    expect(comp.handleTreeInvalidation).toHaveBeenCalledWith(comp.child.id);
  });
  /**
   * multi line story descriptions suck in console
   */
  /* eslint-disable-next-line max-len */
  it('deletes tree child, invalidate self, and removes child id from invalid list to avoid zombies if event has not already been handled', () => {
    const child1 = {
      id: 3,
      type: EXPRESSION_TYPE,
    };
    const child2 = {
      id: 2,
      type: 'AND',
    };
    const comp = new FakeTreeExpressionController([], [], {
      type: 'AND',
      id: 'tree-1',
      children: [
        child1,
        child2,
      ],
    }, ['EQUALS'], ['AND']);
    comp.handleTreeValidation = jest.fn();
    comp.handleTreeInvalidation = jest.fn();
    const extractedMethod = TreeExpressionController.methods.handleDeletion.bind(comp);
    const event = { handled: false, value: { id: child2.id } };
    expect(extractedMethod(event)).toBe(2);
    expect(comp.child.children.length).toBe(1);
    expect(event.handled).toBe(true);
    expect(comp.handleTreeValidation).toHaveBeenCalledWith(child2.id);
    expect(comp.handleTreeInvalidation).toHaveBeenCalledWith(comp.child.id);
  });

  //  handleDeletion

  it('has prop child of type Object that is required', () => {
    const { child } = TreeExpressionController.props;
    expect(child.type).toBe(Object);
    expect(child.required).toBe(true);
  });

  it('has prop alternated of type Boolean with default false', () => {
    const { alternated } = TreeExpressionController.props;
    expect(alternated.type).toBe(Boolean);
    expect(alternated.default).toBe(false);
  });

  it('has prop operators of type Array of Strings that validates input and is required', () => {
    const { operators } = TreeExpressionController.props;
    expect(operators.type).toBe(Array);
    expect(operators.required).toBe(true);
    const { validator } = operators;
    expect(validator([])).toBe(true);
    expect(validator(['asdf'])).toBe(true);
    expect(validator(['asdf', 1])).toBe(false);
    expect(validator([1])).toBe(false);
  });
  it('has prop treeOperators of type Array of Strings that validates input with sane defaults', () => {
    const { treeOperators } = TreeExpressionController.props;
    expect(treeOperators.type).toBe(Array);
    expect(treeOperators.default()).toStrictEqual(['AND', 'OR']);
    const { validator } = treeOperators;
    expect(validator([])).toBe(true);
    expect(validator(['asdf'])).toBe(true);
    expect(validator(['asdf', 1])).toBe(false);
    expect(validator([1])).toBe(false);
  });
  it('has prop listOperators of type Array of Strings that validates input and is required', () => {
    const { listOperators } = TreeExpressionController.props;
    expect(listOperators.type).toBe(Array);
    expect(listOperators.required).toBe(true);
    const { validator } = listOperators;
    expect(validator([])).toBe(true);
    expect(validator(['asdf'])).toBe(true);
    expect(validator(['asdf', 1])).toBe(false);
    expect(validator([1])).toBe(false);
  });
});

describe('IFCTreeQueryBuilder', () => {
  it('has prop value of type Object that is required', () => {
    const { value } = IFCTreeQueryBuilder.props;
    expect(value.type).toBe(Object);
    expect(value.required).toBe(true);
  });

  it('has prop treeOperators of type Array of Strings that validates input with sane defaults', () => {
    const { treeOperators } = IFCTreeQueryBuilder.props;
    expect(treeOperators.type).toBe(Array);
    expect(treeOperators.default()).toStrictEqual(['AND', 'OR']);
    const { validator } = treeOperators;
    expect(validator([])).toBe(true);
    expect(validator(['asdf'])).toBe(true);
    expect(validator(['asdf', 1])).toBe(false);
    expect(validator([1])).toBe(false);
  });
  it('has prop operators of type Array of Strings that validates input and is required', () => {
    const { operators } = IFCTreeQueryBuilder.props;
    expect(operators.type).toBe(Array);
    expect(operators.required).toBe(true);
    const { validator } = operators;
    expect(validator([])).toBe(true);
    expect(validator(['asdf'])).toBe(true);
    expect(validator(['asdf', 1])).toBe(false);
    expect(validator([1])).toBe(false);
  });
  it('has prop listOperators of type Array of Strings that validates input and has a sane default value', () => {
    const { listOperators } = IFCTreeQueryBuilder.props;
    expect(listOperators.type).toBe(Array);
    expect(listOperators.default()).toStrictEqual([]);
    const { validator } = listOperators;
    expect(validator([])).toBe(true);
    expect(validator(['asdf'])).toBe(true);
    expect(validator(['asdf', 1])).toBe(false);
    expect(validator([1])).toBe(false);
  });
  it('sets id generators on create', () => {
    const wrapper = mount(IFCTreeQueryBuilder, {
      propsData: {
        value: {},
        operators: [],
      },
    });
    expect(wrapper.vm.expressionIds).toBeDefined();
    expect(wrapper.vm.treeIds).toBeDefined();
  });
  it('forces update on value change', async () => {
    const wrapper = mount(IFCTreeQueryBuilder, {
      propsData: {
        value: {},
        operators: [],
      },
    });
    wrapper.vm.$forceUpdate = jest.fn();
    await wrapper.setProps({
      value: {
        type: EXPRESSION_TYPE,
      },
    });
    expect(wrapper.vm.$forceUpdate).toHaveBeenCalled();
  });
  it('coerces the id for an expression value', () => {
    const wrapper = mount(IFCTreeQueryBuilder, {
      propsData: {
        value: {
          type: EXPRESSION_TYPE,
        },
        operators: [],
      },
    });
    const result = wrapper.vm.coerceId(wrapper.vm.value);
    expect(result.id).toBeDefined();
    expect(result.type).toBe(EXPRESSION_TYPE);
  });
  it('coerces the id for an tree value and its children', () => {
    const wrapper = mount(IFCTreeQueryBuilder, {
      propsData: {
        value: {
          type: 'OR',
          children: [
            {
              type: EXPRESSION_TYPE,
            },
            {
              type: 'AND',
            },
          ],
        },
        operators: [],
      },
    });
    const result = wrapper.vm.coerceId(wrapper.vm.value);
    expect(result.id).toBeDefined();
    expect(result.children[0].id).toBeDefined();
    expect(result.children[1].id).toBeDefined();
  });
  it('emits change with an expression on expressionFactory call', () => {
    const wrapper = mount(IFCTreeQueryBuilder, {
      propsData: {
        value: {},
        operators: ['EQUALS'],
      },
    });
    wrapper.vm.$emit = jest.fn();
    wrapper.vm.expressionFactory();
    expect(wrapper.vm.$emit).toHaveBeenCalledWith('change',
      expect.objectContaining({
        type: EXPRESSION_TYPE,
        key: '',
        opr: 'EQUALS',
        value: '',
        id: expect.any(String),
      }));
  });
  it('emits change with an expression that has a sane warning for no operators on expressionFactory call', () => {
    const wrapper = mount(IFCTreeQueryBuilder, {
      propsData: {
        value: {
          type: 'AND',
          children: [],
        },
        operators: [],
      },
    });
    wrapper.vm.$emit = jest.fn();
    wrapper.vm.expressionFactory();
    expect(wrapper.vm.$emit).toHaveBeenCalledWith('change', {
      id: expect.any(String),
      type: EXPRESSION_TYPE,
      key: '',
      opr: 'NO OPERATORS PROVIDED',
      value: '',
    });
  });
  it('emits change and valid for a treeFactory call, and assigns child to tree if value is defined', () => {
    const wrapper = mount(IFCTreeQueryBuilder, {
      propsData: {
        value: {
          type: 'AND',
          children: [],
        },
        operators: [],
      },
    });
    wrapper.vm.$emit = jest.fn();
    wrapper.vm.treeFactory('OR');
    expect(wrapper.vm.$emit).toHaveBeenNthCalledWith(1, 'change', {
      type: 'OR',
      id: expect.any(String),
      children: [
        wrapper.vm.value,
      ],
    });
    expect(wrapper.vm.$emit).toHaveBeenNthCalledWith(2, 'valid', false);
  });
  it('emits change and valid for a treeFactory call, and does not assign child to tree if child type is undefined',
    () => {
      const wrapper = mount(IFCTreeQueryBuilder, {
        propsData: {
          value: {

          },
          operators: [],
        },
      });
      wrapper.vm.$emit = jest.fn();
      wrapper.vm.treeFactory('OR');
      expect(wrapper.vm.$emit).toHaveBeenNthCalledWith(1, 'change', {
        type: 'OR',
        id: expect.any(String),
        children: [
        ],
      });
      expect(wrapper.vm.$emit).toHaveBeenNthCalledWith(2, 'valid', false);
    });
  it('handles change when the event is unhandled', () => {
    const wrapper = mount(IFCTreeQueryBuilder, {
      propsData: {
        value: {

        },
        operators: [],
      },
    });
    wrapper.vm.$emit = jest.fn();
    const event = eventFactory(1);
    wrapper.vm.handleChange(event);
    expect(wrapper.vm.$emit).toHaveBeenNthCalledWith(1, 'change', event.value);
    expect(wrapper.vm.$emit).toHaveBeenNthCalledWith(2, 'valid', event.valid);
  });
  it('ignores change when the event is handled', () => {
    const wrapper = mount(IFCTreeQueryBuilder, {
      propsData: {
        value: {

        },
        operators: [],
      },
    });
    wrapper.vm.$emit = jest.fn();
    const event = eventFactory(1, true, true);
    wrapper.vm.handleChange(event);
    expect(wrapper.vm.$emit).not.toHaveBeenCalled();
  });
  it('emits change if it when a non-handled delete event has been detected', () => {
    const wrapper = mount(IFCTreeQueryBuilder, {
      propsData: {
        value: {

        },
        operators: [],
      },
    });
    wrapper.vm.$emit = jest.fn();
    const event = eventFactory(1, true, false);
    wrapper.vm.handleDelete(event);
    expect(wrapper.vm.$emit).toHaveBeenCalledWith('change', {});
  });
  it('ignores delete event when the event has been already handled', () => {
    const wrapper = mount(IFCTreeQueryBuilder, {
      propsData: {
        value: {

        },
        operators: [],
      },
    });
    wrapper.vm.$emit = jest.fn();
    const event = eventFactory(1, true, true);
    wrapper.vm.handleDelete(event);
    expect(wrapper.vm.$emit).not.toHaveBeenCalledWith();
  });
});

describe('Expression.vue', () => {
  it('has prop expression of type Object that validates the structure and is required', () => {
    const { expression } = Expression.props;
    expect(expression.type).toBe(Object);
    expect(expression.required).toBe(true);
    const { validator } = expression;
    expect(validator({})).toBe(false);
    expect(validator({ value: '' })).toBe(false);
    expect(validator({ value: '', opr: '' })).toBe(false);
    expect(validator({ value: '', opr: '', key: '' })).toBe(true);
  });
  it('has prop operators of type Array of Strings that validates input and is required', () => {
    const { operators } = Expression.props;
    expect(operators.type).toBe(Array);
    expect(operators.required).toBe(true);
    const { validator } = operators;
    expect(validator([])).toBe(true);
    expect(validator(['asdf'])).toBe(true);
    expect(validator(['asdf', 1])).toBe(false);
    expect(validator([1])).toBe(false);
  });
  it('has prop listOperators of type Array of Strings that validates input and is required', () => {
    const { listOperators } = Expression.props;
    expect(listOperators.type).toBe(Array);
    expect(listOperators.required).toBe(true);
    const { validator } = listOperators;
    expect(validator([])).toBe(true);
    expect(validator(['asdf'])).toBe(true);
    expect(validator(['asdf', 1])).toBe(false);
    expect(validator([1])).toBe(false);
  });
  it('calls coerceExpressionValue on mount', () => {
    const spy = jest.spyOn(Expression.methods, 'coerceExpressionValue');
    const wrapper = mount(Expression, {
      propsData: {
        expression: {
          value: '',
          opr: '',
          key: '',
        },
        operators: [],
        listOperators: [],
      },
    });
    expect(spy).toHaveBeenCalled();
  });
  it('calls coerceExpressionValue on expression change', async () => {
    const spy = jest.spyOn(Expression.methods, 'coerceExpressionValue');
    const wrapper = mount(Expression, {
      propsData: {
        expression: {
          value: '',
          opr: '',
          key: '',
        },
        operators: [],
        listOperators: [],
      },
    });
    wrapper.setProps({
      expression: {
        value: 'asdf',
        opr: '',
        key: '',
      },
    });
    expect(spy).toHaveBeenCalledTimes(2);
  });
  it('updates internalValue on expression change', async () => {
    const wrapper = mount(Expression, {
      propsData: {
        expression: {
          value: '',
          opr: '',
          key: '',
        },
        operators: [],
        listOperators: [],
      },
    });
    wrapper.setProps({
      expression: {
        value: 'asdf',
        opr: '',
        key: '',
      },
    });
    await wrapper.vm.$nextTick();
    expect(wrapper.vm.internalValue).toStrictEqual({
      value: 'asdf',
      opr: '',
      key: '',
    });
  });
  it('calls coerceExpressionValue on mount', () => {
    const spy = jest.spyOn(Expression.methods, 'validateState');
    mount(Expression, {
      propsData: {
        expression: {
          value: '',
          opr: '',
          key: '',
        },
        operators: [],
        listOperators: [],
      },
    });
    expect(spy).toHaveBeenCalledWith('', false);
  });
  it('coerces the expression value when the expression operator is a listoperator and value is empty', () => {
    const wrapper = mount(Expression, {
      propsData: {
        expression: {
          value: '',
          opr: 'a',
          key: '',
        },
        operators: [],
        listOperators: ['a'],
      },
    });
    expect(wrapper.vm.internalValue.value).toStrictEqual([]);
  });
  it('coerces the expression value when the expression operator is a listoperator and value is not empty', () => {
    const wrapper = mount(Expression, {
      propsData: {
        expression: {
          value: 'asdf',
          opr: 'a',
          key: '',
        },
        operators: [],
        listOperators: ['a'],
      },
    });
    expect(wrapper.vm.internalValue.value).toStrictEqual(['asdf']);
  });
  it('coerces the expression value when the expression operator is a listoperator and value is CSV', () => {
    const wrapper = mount(Expression, {
      propsData: {
        expression: {
          value: 'asdf,asdf1',
          opr: 'a',
          key: '',
        },
        operators: [],
        listOperators: ['a'],
      },
    });
    expect(wrapper.vm.internalValue.value).toStrictEqual(['asdf', 'asdf1']);
  });
  /* eslint-disable-next-line max-len */
  it('coerces the expression value when the expression operator is a listoperator and value is an array with empty values', () => {
    const wrapper = mount(Expression, {
      propsData: {
        expression: {
          value: ['asdf,asdf1', ''],
          opr: 'a',
          key: '',
        },
        operators: [],
        listOperators: ['a'],
      },
    });
    expect(wrapper.vm.internalValue.value).toStrictEqual(['asdf,asdf1']);
  });
  /* eslint-disable-next-line max-len */
  it('coerces the expression value when the expression operator is a not listoperator and value is an array', () => {
    const wrapper = mount(Expression, {
      propsData: {
        expression: {
          value: ['asdf,asdf1', 'asd', ''],
          opr: 'a',
          key: '',
        },
        operators: [],
        listOperators: [],
      },
    });
    expect(wrapper.vm.internalValue.value).toStrictEqual('asdf,asdf1,asd');
  });
  /* eslint-disable-next-line max-len */
  it('coerces the expression value when the expression operator is a not listoperator and value is an object', () => {
    const wrapper = mount(Expression, {
      propsData: {
        expression: {
          value: { a: 1 },
          opr: 'a',
          key: '',
        },
        operators: [],
        listOperators: [],
      },
    });
    expect(wrapper.vm.internalValue.value).toStrictEqual('{"a":1}');
  });

  it('calls validateState on handleKeyChange', () => {
    const wrapper = mount(Expression, {
      propsData: {
        expression: {
          value: 'a',
          opr: 'a',
          key: '',
        },
        operators: [],
        listOperators: [],
      },
    });
    wrapper.vm.validateState = jest.fn();
    wrapper.vm.handleKeyChange(1);
    expect(wrapper.vm.internalValue.key).toBe(1);
    expect(wrapper.vm.validateState).toHaveBeenCalledWith('a');
  });

  it('calls validateState on handleOperatorChange', async () => {
    const wrapper = mount(Expression, {
      propsData: {
        expression: {
          value: 'a',
          opr: 'a',
          key: '',
        },
        operators: [],
        listOperators: [],
      },
    });
    await wrapper.vm.$nextTick();
    wrapper.vm.validateState = jest.fn();
    wrapper.vm.handleOperatorChange({ target: { value: 1 } });
    expect(wrapper.vm.internalValue.opr).toBe(1);
    expect(wrapper.vm.validateState).toHaveBeenCalledWith('a');
  });

  it('coerces value on handleOperatorChange', async () => {
    const wrapper = mount(Expression, {
      propsData: {
        expression: {
          value: 'a',
          opr: 'a',
          key: '',
        },
        operators: [],
        listOperators: ['aa'],
      },
    });
    await wrapper.vm.$nextTick();
    wrapper.vm.handleOperatorChange({ target: { value: 'aa' } });
    expect(wrapper.vm.internalValue.opr).toBe('aa');
    expect(wrapper.vm.internalValue.value).toStrictEqual(['a']);
  });

  it('updates value on validateState', async () => {
    const wrapper = mount(Expression, {
      propsData: {
        expression: {
          value: 'a',
          opr: 'a',
          key: '',
        },
        operators: [],
        listOperators: ['aa'],
      },
    });
    wrapper.vm.validateState('asdf');
    expect(wrapper.vm.internalValue.value).toBe('asdf');
  });

  it('$emits validate on valid data', async () => {
    const wrapper = mount(Expression, {
      propsData: {
        expression: {
          value: 'a',
          opr: 'a',
          key: 'a',
        },
        operators: [],
        listOperators: ['aa'],
      },
    });
    wrapper.vm.$emit = jest.fn();
    wrapper.vm.validateState('asdf');
    expect(wrapper.vm.$emit).toHaveBeenNthCalledWith(1, 'validate', deepClone(wrapper.vm.internalValue));
  });

  it('$emits change on valid data if emit = true (by default)', async () => {
    const wrapper = mount(Expression, {
      propsData: {
        expression: {
          value: 'a',
          opr: 'a',
          key: 'a',
        },
        operators: [],
        listOperators: ['aa'],
      },
    });
    wrapper.vm.$emit = jest.fn();
    wrapper.vm.validateState('asdf');
    expect(wrapper.vm.$emit).toHaveBeenNthCalledWith(2, 'change', {
      handled: false,
      valid: true,
      value: deepClone(wrapper.vm.internalValue),
    });
  });

  it('does not $emits change on valid data if emit = false', async () => {
    const wrapper = mount(Expression, {
      propsData: {
        expression: {
          value: 'a',
          opr: 'a',
          key: 'a',
        },
        operators: [],
        listOperators: ['aa'],
      },
    });
    wrapper.vm.$emit = jest.fn();
    wrapper.vm.validateState('asdf', false);
    expect(wrapper.vm.$emit).toHaveBeenCalledTimes(1);
    expect(wrapper.vm.$emit).toHaveBeenCalledWith('validate', deepClone(wrapper.vm.internalValue));
  });

  it('validates value to true if value is a non empty array and operator is a list operator', async () => {
    const wrapper = mount(Expression, {
      propsData: {
        expression: {
          value: ['a'],
          opr: 'a',
          key: 'a',
        },
        operators: [],
        listOperators: ['a'],
      },
    });
    wrapper.vm.$emit = jest.fn();
    wrapper.vm.validateState(['a'], false);
    expect(wrapper.vm.$emit).toHaveBeenCalledTimes(1);
    expect(wrapper.vm.$emit).toHaveBeenCalledWith('validate', deepClone(wrapper.vm.internalValue));
  });

  it('validates value to false if value is an empty array and operator is a list operator', async () => {
    const wrapper = mount(Expression, {
      propsData: {
        expression: {
          value: 'a',
          opr: 'a',
          key: 'a',
        },
        operators: [],
        listOperators: ['a'],
      },
    });
    wrapper.vm.$emit = jest.fn();
    wrapper.vm.validateState([], false);
    expect(wrapper.vm.$emit).toHaveBeenCalledTimes(1);
    expect(wrapper.vm.$emit).toHaveBeenCalledWith('invalidate', deepClone(wrapper.vm.internalValue));
  });

  it('validates value to false if value is an array with empty vals and operator is a list operator', async () => {
    const wrapper = mount(Expression, {
      propsData: {
        expression: {
          value: [''],
          opr: 'a',
          key: 'a',
        },
        operators: [],
        listOperators: ['a'],
      },
    });
    wrapper.vm.$emit = jest.fn();
    wrapper.vm.validateState([''], false);
    expect(wrapper.vm.$emit).toHaveBeenCalledTimes(1);
    expect(wrapper.vm.$emit).toHaveBeenCalledWith('invalidate', deepClone(wrapper.vm.internalValue));
  });

  it('validates value to true if value is a non empty string and operator is not a list operator', async () => {
    const wrapper = mount(Expression, {
      propsData: {
        expression: {
          value: 'asdf',
          opr: 'aa',
          key: 'a',
        },
        operators: [],
        listOperators: ['a'],
      },
    });
    wrapper.vm.$emit = jest.fn();
    wrapper.vm.validateState('asdf', false);
    expect(wrapper.vm.$emit).toHaveBeenCalledTimes(1);
    expect(wrapper.vm.$emit).toHaveBeenCalledWith('validate', deepClone(wrapper.vm.internalValue));
  });

  it('validates value to false if value is an empty string and operator is not a list operator', async () => {
    const wrapper = mount(Expression, {
      propsData: {
        expression: {
          value: 'asdf',
          opr: 'aa',
          key: 'a',
        },
        operators: [],
        listOperators: ['a'],
      },
    });
    wrapper.vm.$emit = jest.fn();
    wrapper.vm.validateState('', false);
    expect(wrapper.vm.$emit).toHaveBeenCalledTimes(1);
    expect(wrapper.vm.$emit).toHaveBeenCalledWith('invalidate', deepClone(wrapper.vm.internalValue));
  });
  it('allows multi select if opr is a list operator', async () => {
    const wrapper = mount(Expression, {
      propsData: {
        expression: {
          value: 'asdf',
          opr: 'a',
          key: 'a',
        },
        operators: [],
        listOperators: ['a'],
      },
    });
    expect(wrapper.vm.allowMultiSelect).toBe(true);
  });
  it('disallows multi select if opr is not a list operator', async () => {
    const wrapper = mount(Expression, {
      propsData: {
        expression: {
          value: 'asdf',
          opr: 'aa',
          key: 'a',
        },
        operators: [],
        listOperators: ['a'],
      },
    });
    expect(wrapper.vm.allowMultiSelect).toBe(false);
  });
  it('binds computed class with error if expression is invalid', async () => {
    const wrapper = mount(Expression, {
      propsData: {
        expression: {
          value: '',
          opr: '',
          key: '',
        },
        operators: [],
        listOperators: ['a'],
      },
    });
    expect(wrapper.vm.computedClass[`${wrapper.vm.baseClass}--error`]).toBe(true);
    wrapper.setProps({ expression: { value: 'a', opr: '', key: '' } });
    await wrapper.vm.$nextTick();
    expect(wrapper.vm.computedClass[`${wrapper.vm.baseClass}--error`]).toBe(true);
    wrapper.setProps({ expression: { value: 'a', opr: 'b', key: '' } });
    await wrapper.vm.$nextTick();
    expect(wrapper.vm.computedClass[`${wrapper.vm.baseClass}--error`]).toBe(true);
    wrapper.setProps({ expression: { value: 'a', opr: 'b', key: 'c' } });
    await wrapper.vm.$nextTick();
    expect(wrapper.vm.computedClass[`${wrapper.vm.baseClass}--error`]).toBe(false);
    wrapper.setProps({ expression: { value: 'a', opr: 'a', key: 'c' } });
    await wrapper.vm.$nextTick();
    expect(wrapper.vm.computedClass[`${wrapper.vm.baseClass}--error`]).toBe(false); // false because it gets coerced
    wrapper.setProps({ expression: { value: ['a'], opr: 'a', key: 'c' } });
    await wrapper.vm.$nextTick();
    expect(wrapper.vm.computedClass[`${wrapper.vm.baseClass}--error`]).toBe(false);
    wrapper.setProps({ expression: { value: [], opr: 'a', key: 'c' } });
    await wrapper.vm.$nextTick();
    expect(wrapper.vm.computedClass[`${wrapper.vm.baseClass}--error`]).toBe(true);
  });
});
