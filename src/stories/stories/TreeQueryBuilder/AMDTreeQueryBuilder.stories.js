import { IFCTreeQueryBuilder } from '@Components/TreeQueryBuilder/IFCTreeQueryBuilder.vue';
import { IFCThemeProvider } from '@Components/ThemeProvider/IFCThemeProvider.vue';
/**
 * Next line disabled because this is not production code. this is development code.
 * So importing from devDeps is fine
 */
/* eslint-disable-next-line import/no-extraneous-dependencies */
import { action } from '@storybook/addon-actions';
import { deepClone } from '@Components/utils.js';

export default {
  title: 'Container Components/Tree Query Builder',
  component: IFCTreeQueryBuilder,
  parameters: {
    jest: ['TreeQueryBuilder.spec.js'],
  },
  argTypes: {
    dark: { control: { type: 'boolean', default: false } },
    valid: {
      description: 'Whether or not the issued query is valid from a structural perspective',
    },
    change: {
      description: 'The updated query',
    },
  },
};

const EXCLUDED_KEYS = ['content'];

const CodeFactory = (args) => `
  <IFCTreeQueryBuilder
   ${Object.entries(args).filter(
    ([key]) => !EXCLUDED_KEYS.includes(key),
  ).map(([key, value]) => `${`${typeof value !== 'string' ? ':' : ''}${key}`}="${value}"\n`).join('   ')}  >
      ${args.content ?? '<!-- Content Here -->'}
  </IFCTreeQueryBuilder>
`;

const Template = (args, { argTypes }) => ({
  props: Object.keys(argTypes),
  components: { IFCTreeQueryBuilder, IFCThemeProvider },
  data() {
    return {
      internalValue: {},
    };
  },
  created() {
    this.internalValue = deepClone(this.value);
  },
  watch: {
    value: {
      handler(value) {
        this.internalValue = deepClone(value);
      },
      deep: true,
    },
  },
  methods: {
    onValid: action('@valid'),
    onChange: action('@change'),
    handleChange(event) {
      this.onChange(event);
      this.internalValue = event;
    },
  },
  template: `
    <IFCThemeProvider :dark="dark">
      <IFCTreeQueryBuilder @change="handleChange" @valid="onValid" v-bind="$props" :value="internalValue" />
    </IFCThemeProvider>
  `,
});

export const EmptyValue = Template.bind({});
EmptyValue.args = {
  value: {

  },
  operators: ['EQUALS', 'IN'],
  treeOperators: ['OR', 'AND'],
  listOperators: ['IN'],
};
EmptyValue.parameters = {
  docs: {
    source: {
      code: CodeFactory(EmptyValue.args),
    },
  },
};

export const Expression = Template.bind({});
Expression.args = {
  value: {
    type: 'expression',
    key: 'KEY',
    opr: 'EQUALS',
    value: 'value',
  },
  operators: ['EQUALS', 'IN'],
  treeOperators: ['OR', 'AND'],
  listOperators: ['IN'],
};
Expression.parameters = {
  docs: {
    source: {
      code: CodeFactory(Expression.args),
    },
  },
};

export const SimpleTree = Template.bind({});
SimpleTree.args = {
  value: {
    type: 'AND',
    children: [
      {
        type: 'expression',
        key: 'key1',
        opr: 'EQUALS',
        value: 'value1',
      },
      {
        type: 'expression',
        key: 'key2',
        opr: 'EQUALS',
        value: 'value2',
      },
    ],
  },
  operators: ['EQUALS', 'IN'],
  treeOperators: ['OR', 'AND'],
  listOperators: ['IN'],
};
SimpleTree.parameters = {
  docs: {
    source: {
      code: CodeFactory(SimpleTree.args),
    },
  },
};

export const IncompleteSimpleTree = Template.bind({});
IncompleteSimpleTree.args = {
  value: {
    type: 'AND',
    children: [
      {
        type: 'expression',
        key: 'key1',
        opr: 'EQUALS',
        value: 'value1',
      },
    ],
  },
  operators: ['EQUALS', 'IN'],
  treeOperators: ['OR', 'AND'],
  listOperators: ['IN'],
};
IncompleteSimpleTree.parameters = {
  docs: {
    source: {
      code: CodeFactory(IncompleteSimpleTree.args),
    },
  },
};

export const ComplexTree = Template.bind({});
ComplexTree.args = {
  value: {
    type: 'OR',
    children: [
      {
        type: 'AND',
        children: [
          {
            type: 'expression',
            key: 'key1',
            opr: 'EQUALS',
            value: 'value1',
          },
          {
            type: 'expression',
            key: 'key2',
            opr: 'EQUALS',
            value: 'value2',
          },
        ],
      },
      {
        type: 'expression',
        key: 'key3',
        opr: 'EQUALS',
        value: 'value3',
      },
    ],
  },
  operators: ['EQUALS', 'IN'],
  treeOperators: ['OR', 'AND'],
  listOperators: ['IN'],
};
ComplexTree.parameters = {
  docs: {
    source: {
      code: CodeFactory(ComplexTree.args),
    },
  },
};

export const DarkTheme = Template.bind({});
DarkTheme.args = {
  dark: true,
  value: {
    type: 'OR',
    children: [
      {
        type: 'AND',
        children: [
          {
            type: 'expression',
            key: 'key1',
            opr: 'EQUALS',
            value: 'value1',
          },
          {
            type: 'expression',
            key: 'key2',
            opr: 'EQUALS',
            value: 'value2',
          },
        ],
      },
      {
        type: 'expression',
        key: 'key3',
        opr: 'EQUALS',
        value: 'value3',
      },
    ],
  },
  operators: ['EQUALS', 'IN'],
  treeOperators: ['OR', 'AND'],
  listOperators: ['IN'],
};
DarkTheme.parameters = {
  backgrounds: {
    default: 'Dark Mode',
  },
  docs: {
    source: {
      code: CodeFactory(DarkTheme.args),
    },
  },
};
