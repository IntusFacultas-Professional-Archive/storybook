<template>
  <div style="display: flex; flex-direction: column;">
    <TreeExpressionController
      :child="formattedQuery"
      :treeOperators="treeOperators"
      :listOperators="listOperators"
      :operators="operators"
      @delete="handleDelete($event)"
      @change="handleChange($event)"
      :key="formattedQuery.id"
    />
    <IFCButtonGroup class="IFCTreeQueryBuilder__ButtonGroup" block>
      <IFCButton variant="primary" v-if="value.type === undefined" @click="expressionFactory()">
        Expression
      </IFCButton>
      <IFCButton
        v-for="operator in treeOperators"
        variant="primary"
        :key="operator"
        @click="treeFactory(operator)">
        {{operator}}
      </IFCButton>
    </IFCButtonGroup>
  </div>
</template>

<script>
import { IFCButton } from '@Components/Button/IFCButton.vue';
import { IFCButtonGroup } from '@Components/Button/IFCButtonGroup.vue';
import { deepClone } from '@Components/utils.js';
import TreeExpressionController from './TreeExpressionController.vue';
import { EXPRESSION_TYPE, ExpressionIds, TreeIds } from './utils.js';

export const IFCTreeQueryBuilder = {
  components: {
    TreeExpressionController,
    IFCButton,
    IFCButtonGroup,
  },
  data() {
    return {
      expressionIds: null,
      treeIds: null,
    };
  },
  watch: {
    value: {
      handler() {
        this.$forceUpdate();
      },
      deep: true,
    },
  },
  props: {
    /**
     * The value object for the query, should be either a query in the form
     *
     * ```
     * {
     *  type: 'expression',
     *  key: String,
     *  opr: String,
     *  value: String or Array of Strings
     * }
     * ```
     *
     * or
     *
     * ```
     * {
     *  type: TreeOperator,
     *  children: [
     *    // tree or expression children, must be 2 to be valid
     *  ]
     * }
     * ```
     */
    value: {
      type: Object,
      required: true,
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
      default() {
        return [];
      },
    },
  },
  created() {
    this.expressionIds = ExpressionIds;
    this.treeIds = TreeIds;
  },
  methods: {
    /**
     * @function ensureId
     * @param {Object} queryPortion a portion of a query that we need to enforce an id for
     * @returns {Object} the query portion with an id
     */
    coerceId(queryPortion) {
      const clonedPortion = deepClone(queryPortion);
      clonedPortion.id = clonedPortion.id ?? (
        clonedPortion.type === EXPRESSION_TYPE
          ? this.expressionIds.next().value
          : this.treeIds.next().value);
      if (this.treeOperators.some((operator) => operator === clonedPortion.type)) {
        const oldChildren = (clonedPortion.children ?? []).slice();
        clonedPortion.children = [];
        oldChildren.forEach((child) => {
          clonedPortion.children.push(this.coerceId(child));
        });
      }
      return clonedPortion;
    },

    /**
     * @function expressionFactory
     * @emits change
     * @listens onclick of Expression button
     * Adds new expression to value
     */
    expressionFactory() {
      this.$emit('change', {
        id: this.expressionIds.next().value,
        type: EXPRESSION_TYPE,
        key: '',
        opr: this.operators?.[0] ?? 'NO OPERATORS PROVIDED',
        value: '',
      });
    },

    /**
     * @function treeFactory
     * @listens onclick of tree operator buttons
     * @emits change
     * Adds a tree to the outside most layer
     */
    treeFactory(operator) {
      const tree = {
        id: this.treeIds.next().value,
        type: operator,
        children: [
        ],
      };
      if (this.value.type !== undefined) {
        tree.children.push(this.value);
      }
      this.$emit('change', tree);
      this.$emit('valid', false);
    },

    /**
     * @function handleChange
     * @param {ChangeEvent} event the event from the subtree
     * @emits change
     * @listens onchange of subtree
     */
    handleChange(event) {
      if (!event.handled) {
        this.$emit('change', event.value);
        this.$emit('valid', event.valid);
      }
    },

    /**
     * @function handleDelete
     * @param {ChangeEvent} event the event from the subtree
     * @emits change
     * @listens ondelete of subtree
     */
    handleDelete(event) {
      if (!event.handled) {
        // if a deletion event got this far, the whole tree got deleted
        this.$emit('change', {});
      }
    },

  },
  computed: {
    formattedQuery() {
      return this.coerceId(this.value);
    },
  },
};
export default IFCTreeQueryBuilder;
</script>

<style lang="scss">
@import './tree.scss';
</style>
