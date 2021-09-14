<template>
  <div class="IFCTreeQueryBuilderTreeContainer">
    <Expression
      v-if="child.type === EXPRESSION_TYPE"
      :expression="child"
      :operators="operators"
      :listOperators="listOperators"
      @delete="handleDeletion($event)"
      @change="handleUpdate($event)"
      @validate="handleValidation($event)"
      @invalidate="handleInvalidation($event)"
    />
    <div
      class="IFCTreeQueryBuilderTree"
      :class="computedClass"
      v-else-if="childIsTree"
    >
      <IFCSpan bold>{{ child.type.toUpperCase() }}</IFCSpan>
      <div class="IFCTreeQueryBuilderTree__brackets"></div>
      <div class="IFCTreeQueryBuilderTree__ExpressionContainer">
        <div class="IFCTreeQueryBuilderTree__Children">
          <div class="IFCTreeQueryBuilderTree__NestedExpressions">
            <TreeExpressionController
              v-for="grandchild in child.children"
              :child="grandchild"
              :alternated="!alternated"
              :operators="operators"
              :treeOperators="treeOperators"
              :listOperators="listOperators"
              @change="handleUpdate($event)"
              @delete="handleDeletion($event)"
              :key="grandchild.id"
            />
          </div>
        </div>
        <div class="IFCTreeQueryBuilderTree__ConstructorButtons">
          <IFCButtonGroup
            v-for="(n, index) in 2 - child.children.length"
            class="IFCTreeQueryBuilderTree__ButtonGroup"
            :key="`button-${index}`"
            block
          >
            <IFCButton @click="expressionFactory()" variant="primary" block>Expression</IFCButton>
            <IFCButton
              v-for="operator in treeOperators"
              @click="treeFactory(operator)"
              variant="primary"
              :key="operator"
              block>
              {{operator}}
            </IFCButton>
          </IFCButtonGroup>
        </div>
      </div>
      <div class="defaultexpressions" v-if="child.children.length == 0"></div>
      <div class="IFCTreeQueryBuilderTree__brackets IFCTreeQueryBuilderTree__brackets--right"></div>
      <IFCButton
        variant="transparent"
        size="sm"
        @click="$emit('delete', { handled: false, value: {id: child.id} })"
      >
        <IFCScreenReaderText>
          Delete Expression Tree
        </IFCScreenReaderText>
        <XImage class="IFCTreeQueryBuilderTree__x"/>
      </IFCButton>
    </div>
  </div>
</template>

<script>
import { IFCSpan } from '@Components/Text/IFCSpan.vue';
import { IFCScreenReaderText } from '@Components/Text/IFCScreenReaderText.vue';
import { IFCButton } from '@Components/Button/IFCButton.vue';
import { IFCButtonGroup } from '@Components/Button/IFCButtonGroup.vue';
import { Expression } from './Expression.vue';
import {
  EXPRESSION_TYPE, ExpressionIds, TreeIds, eventFactory, validateExpressionState,
} from './utils.js';
import XImage from './icons/X.vue';

export const TreeExpressionController = {
  name: 'TreeExpressionController',
  components: {
    Expression,
    IFCSpan,
    IFCButton,
    IFCButtonGroup,
    XImage,
    IFCScreenReaderText,
  },
  data() {
    return {
      EXPRESSION_TYPE,
      invalidTrees: [],
      invalidExpressions: [],
      expressionIds: null,
      treeIds: null,
    };
  },
  props: {
    child: {
      type: Object,
      required: true,
    },

    /**
     * Whether this element should be slightly darkened to distinguish from parent
     */
    alternated: {
      type: Boolean,
      default: false,
    },

    /**
     * Operators that result in a branched tree
     */
    treeOperators: {
      type: Array,
      validator(value) {
        return !value.some((el) => typeof el !== 'string');
      },
      default() {
        return ['AND', 'OR'];
      },
    },

    /**
     * Operators that can be used inside an expression
     */
    operators: {
      type: Array,
      validator(value) {
        return !value.some((el) => typeof el !== 'string');
      },
      required: true,
    },

    /**
     * Operators that can be used inside an expression and allow a list of values as input
     * (Should be subset of operators)
     */
    listOperators: {
      type: Array,
      validator(value) {
        return !value.some((el) => typeof el !== 'string');
      },
      required: true,
    },
  },
  mounted() {
    this.validateState();
    this.expressionIds = ExpressionIds;
    this.treeIds = TreeIds;
    if (this.treeOperators.some((operator) => operator === this.child.type) && this.child.children.length !== 2) {
      this.handleTreeInvalidation(this.child.id);
    } else if (this.child.type === EXPRESSION_TYPE && !validateExpressionState(
      this.listOperators, this.child.opr, this.child.value, this.child.key,
    )) {
      this.handleInvalidation(this.child);
    }
  },
  methods: {
    /**
     * @function handleValidation
     * @param {Object} expression the expression that was validated
     * @listens onvalidate of expression
     * Removes the expression from the list of invalid expressions
     */
    handleValidation(expression) {
      // this will be caught either by IFCTreeQueryBuilder or the parent TreeExpressionController
      this.$set(this, 'invalidExpressions', this.invalidExpressions.filter(
        (expressionId) => expressionId !== expression.id,
      ));
    },

    /**
     * @function handleInvalidation
     * @param {String} expression the expression that was invalidated
     * @listens oninvalidate of expression
     * Adds the expression to the list of invalid expressions
     */
    handleInvalidation(expression) {
      // this will be caught either by IFCTreeQueryBuilder or the parent TreeExpressionController
      if (!this.invalidExpressions.includes(expression.id)) {
        this.invalidExpressions.push(expression.id);
      }
    },

    /**
     * @function handleTreeValidation
     * @param {String} id the id of the tree that was validated
     * @listens onvalidate of tree
     * Adds the tree to thelist of valid trees
     */
    handleTreeValidation(id) {
      this.$set(this, 'invalidTrees', this.invalidTrees.filter((treeId) => treeId !== id));
    },

    /**
     * @function handleTreeInvalidation
     * @param {String} id the id of the tree that was validated
     * @listens onvalidate of tree
     * Adds the tree to thelist of valid trees
     */
    handleTreeInvalidation(id) {
      if (!this.invalidTrees.includes(id)) {
        this.invalidTrees.push(id);
      }
    },

    /**
     * @function expressionFactory
     * @see handleInvalidation
     * @listens onclick of Expression button
     * Adds new expression to children
     */
    expressionFactory() {
      const newChild = {
        id: this.expressionIds.next().value,
        type: EXPRESSION_TYPE,
        key: '',
        opr: this.operators?.[0] ?? 'NO OPERATORS PROVIDED',
        value: '',
      };
      this.child.children.push(newChild);
      // when we instantiate a child, its initially invalid
      this.handleInvalidation(newChild);
      this.$emit('change', eventFactory(this.child, false));
    },

    /**
     * @function treeFactory
     * @see handleTreeInvalidation
     * @listens onclick of expression add button
     * Adds another expression to the children of this tree
     */
    treeFactory(operator) {
      const newChild = {
        id: this.treeIds.next().value,
        type: operator,
        children: [],
      };
      this.child.children.push(newChild);
      // when we instantiate a child, its initially invalid
      this.handleTreeInvalidation(newChild.id);
      this.$emit('change', eventFactory(this.child, false));
    },

    /**
     * @function validateState
     * @see handleInvalidation
     * @see handleTreeInvalidation
     * @see handleTreeValidation
     * @emits change
     * @param {Object|null} event the event that called this. Null if called by mount
     * Validates the state of the tree and emits change if valid.
     */
    validateState(event) {
      if (this.child.type === EXPRESSION_TYPE) {
        // handled by Expression.vue;
        return 0;
      } if (this.treeOperators.some((operator) => operator === this.child.type)) {
        if (this.child.children.length < 2) {
          this.handleTreeInvalidation(this.child.id);
          if (event) {
            this.$emit('change', eventFactory(this.child, false));
          }
          return -1;
        }
        /**
         * Disabled because we need for-of to be able to shortcircuit logic and return. Can't do that with forEach
         */
        /* eslint-disable-next-line no-restricted-syntax */
        for (const child of this.child.children) {
          if (this.invalidExpressions.includes(child.id) || this.invalidTrees.includes(child.id)) {
            // one of our children are invalid.
            this.handleTreeInvalidation(this.child.id);
            if (event) {
              this.$emit('change', eventFactory(
                this.child,
                this.invalidTrees.length === 0 && this.invalidExpressions.length === 0,
              ));
            }
            return 1;
          }
        }

        this.handleTreeValidation(this.child.id);
        if (event) {
          this.$emit('change', eventFactory(
            this.child,
            this.invalidTrees.length === 0 && this.invalidExpressions.length === 0,
          ));
        }
      }
      // we don't emit change here so that we don't have a change event on mount
      return 2;
    },

    /**
     * @function handleUpdate
     * @listens onchange of Expression or subtree
     * @param {ChangeEvent} event the change event
     * @emits change
     * @see validateState
     */
    handleUpdate(event) {
      if (event.handled) {
        // already consumed by a child
        return -1;
      }
      if (this.child.type === EXPRESSION_TYPE) {
        // tree expression controllers in charge of expressions have no additional work to do.
        this.$emit('change', event);
        return 0;
      }
      const index = this.child.children.findIndex(
        (el) => el.id === event.value.id,
      );
      this.$set(this.child.children, index, event.value);
      if (!event.valid) {
        // sub child's change invalidates themselves which invalidates us
        if (event.value.type === EXPRESSION_TYPE) {
          this.handleInvalidation(event.value);
        } else if (this.treeOperators.some((operator) => operator === event.value.type)) {
          this.handleTreeInvalidation(event.value.id);
        }
      } else if (event.value.type === EXPRESSION_TYPE) {
        this.handleValidation(event.value);
      } else if (this.treeOperators.some((operator) => operator === event.value.type)) {
        this.handleTreeValidation(event.value.id);
      }
      this.validateState(event);
      return 1;
    },

    /**
     * @function handleDeletion
     * @param {DeletionEvent} event the deleted id and whether the event was handled or not
     * @emits delete
     * @see handleTreeValidation
     * @see handleValidation
     */
    handleDeletion(event) {
      if (event.handled) {
        // already consumed by a child
        return -1;
      }
      if (this.child.type === EXPRESSION_TYPE) {
        // if this is an expression, we bubble it up so the parent tree or rule can handle it.
        this.$emit('delete', event);
        return 0;
      }
      // At this point this is a tree catching a deletion event bubbled up
      if (this.child.children.length === 0) {
        // tree completely empty, so we now delete ourselves
        this.$emit('delete', { handled: false, value: { id: this.child.id } });
        return 1;
      }
      // we delete the child that got bubbled up
      const index = this.child.children.findIndex((el) => el.id === event.value.id);
      const deletedChild = this.child.children.splice(index, 1)[0];
      // we need to remove the child from invalid expressions in case its there
      if (deletedChild.type === EXPRESSION_TYPE) {
        this.handleValidation(deletedChild);
      } else {
        // the child is a deleted tree, we remove from invalid trees in case its there
        this.handleTreeValidation(deletedChild.id);
      }
      if (this.child.children.length < 2) {
        // we are now an incomplete tree. Invalidate ourselves
        this.handleTreeInvalidation(this.child.id);
      }

      /**
       * We need to alert upstream parents that the event was handled.
       */
      /* eslint-disable-next-line no-param-reassign */
      event.handled = true;

      // emit the changed structure so that the next tree expression controller or IFC tree query builder updates
      this.$emit('change', eventFactory(
        this.child,
        this.invalidTrees.length === 0 && this.invalidExpressions.length === 0 && this.child.children === 2,
      ));
      return 2;
    },
  },
  computed: {
    baseClass() {
      return 'IFCTreeQueryBuilderTree';
    },
    computedClass() {
      return {
        [`${this.baseClass}--error`]: this.invalidTrees.length !== 0 || this.invalidExpressions.length !== 0,
      };
    },
    childIsTree() {
      return this.treeOperators.some((operator) => operator === this.child.type);
    },
  },
};
export default TreeExpressionController;
</script>
