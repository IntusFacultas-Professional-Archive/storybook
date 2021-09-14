<template>
  <div class="IFCTreeQueryBuilderExpression" :class="computedClass">
    <IFCSpan>USER</IFCSpan>
    <IFCInput
      type="text"
      :name="`expression-key-${_uid}`"
      :state="internalValue.key ? 'default' : 'error'"
      v-model="internalValue.key"
      @change="handleKeyChange"
      @input="handleKeyChange"
    >
      <template v-slot:label>
        Key
      </template>
    </IFCInput>
    <select
      v-model="internalValue.opr"
      aria-label="Operator"
      :name="`expression-key-${_uid}`"
      @change="handleOperatorChange"
    >
      <option v-for="operator in operators" :key="operator">
        {{operator}}
      </option>
    </select>
    <IFCInput
      v-if="!allowMultiSelect"
      type="text"
      :state="internalValue.value ? 'default' : 'error'"
      :name="`internalValue-value-${_uid}`"
      @change="validateState"
      @input="validateState"
      v-model="expression.value"
    >
      <template v-slot:label>
        Value
      </template>
    </IFCInput>

    <IFCTagEditor
      v-else
      :name="`expression-value-${_uid}`"
      @change="validateState"
      v-model="internalValue.value">
      <template #label>
        Value
      </template>
    </IFCTagEditor>
    <IFCButton
      variant="transparent"
      @click="$emit('delete', { handled: false, value: { ...internalValue } })"
    >
      <IFCScreenReaderText>Delete Expression</IFCScreenReaderText>
      <XImage class="IFCTreeQueryBuilderExpression__x"/>
    </IFCButton>
  </div>
</template>

<script>
import { IFCSpan } from '@Components/Text/IFCSpan.vue';
import { IFCScreenReaderText } from '@Components/Text/IFCScreenReaderText.vue';
import { IFCInput } from '@Components/Input/IFCInput.vue';
import { IFCTagEditor } from '@Components/TagEditor/IFCTagEditor.vue';
import { IFCButton } from '@Components/Button/IFCButton.vue';
import { deepClone } from '@Components/utils.js';
import XImage from './icons/X.vue';
import { eventFactory, validateExpressionState } from './utils.js';

export const Expression = {
  components: {
    IFCButton,
    IFCSpan,
    IFCInput,
    IFCScreenReaderText,
    IFCTagEditor,
    XImage,
  },
  data() {
    return {
      internalValue: {},
    };
  },
  props: {
    /**
     * The expression this component should display
     */
    expression: {
      type: Object,
      validator(value) {
        const hasValue = value.value !== undefined;
        const hasOperator = value.opr !== undefined;
        const hasKey = value.key !== undefined;
        return hasValue && hasOperator && hasKey;
      },
      required: true,
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
    this.$set(this, 'internalValue', deepClone(this.expression));
    this.coerceExpressionValue();
    this.validateState(this.internalValue.value, false);
  },
  watch: {
    expression: {
      handler(val) {
        this.$set(this, 'internalValue', deepClone(val));
        this.coerceExpressionValue();
      },
      deep: true,
    },
  },
  methods: {

    /**
     * @function coerceExpressionValue
     * Coerces the expression value.
     */
    coerceExpressionValue() {
      if (this.listOperators.some((opr) => opr === this.internalValue.opr)) {
        // should be a list.
        if (Array.isArray(this.internalValue.value)) {
          this.$set(
            this.internalValue,
            'value',
            this.internalValue.value.map((el) => String(el)).filter((el) => el.length > 0),
          );
        } else {
          this.$set(
            this.internalValue,
            'value',
            this.internalValue.value.split(',').filter((el) => el.length > 0),
          );
        }
      } else if (Array.isArray(this.internalValue.value)) {
        this.$set(
          this.internalValue,
          'value',
          this.internalValue.value.filter((el) => el.length > 0).join(','),
        );
      } else if (typeof this.internalValue.value === 'object') {
        this.$set(
          this.internalValue,
          'value',
          JSON.stringify(this.internalValue.value),
        );
      } else {
        this.$set(
          this.internalValue,
          'value',
          String(this.internalValue.value),
        );
      }
    },

    /**
     * @function handleKeyChange
     * @listens onchange of key input
     * @see validateState
     * @param {String} value the value of the input key
     * Updates the key change
     */
    handleKeyChange(value) {
      this.$set(this.internalValue, 'key', value);
      this.validateState(this.internalValue.value);
    },

    /**
     * @function handleOperatorChange
     * @listens onchange of operator select
     * @param {String} value the value of the operator
     * Updates the operator
     */
    handleOperatorChange(event) {
      this.$set(this.internalValue, 'opr', event.target.value);
      this.coerceExpressionValue();
      this.validateState(this.internalValue.value);
    },

    /**
     * @function validateState
     * @param {String} value the value of expression
     * @param {Boolean} emit whether to emit a change event (default true)
     * Validates the expression state and emits a change and invalidation or validation event.
     */
    validateState(value, emit = true) {
      this.$set(this.internalValue, 'value', value);
      if (validateExpressionState(
        this.listOperators,
        this.internalValue.opr,
        this.internalValue.value,
        this.internalValue.key,
      )) {
        this.$emit('validate', deepClone(this.internalValue));
        if (emit) {
          this.$emit('change', eventFactory(deepClone(this.internalValue)));
        }
      } else {
        this.$emit('invalidate', deepClone(this.internalValue));
        if (emit) {
          this.$emit('change', eventFactory(deepClone(this.internalValue), false));
        }
      }
    },
  },

  computed: {
    baseClass() {
      return 'IFCTreeQueryBuilderExpression';
    },
    computedClass() {
      return {
        [`${this.baseClass}--error`]: !validateExpressionState(
          this.listOperators,
          this.internalValue.opr,
          this.internalValue.value,
          this.internalValue.key,
        ),

      };
    },
    allowMultiSelect() {
      return this.listOperators.some((operator) => operator === this.internalValue.opr);
    },
  },
};
export default Expression;
</script>
