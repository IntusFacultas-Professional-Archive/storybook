import IFCActionsDropdown from '@Components/Table/ActionsDropdown/IFCActionsDropdown.vue';
import { IFCThemeProvider } from '@Components/ThemeProvider/IFCThemeProvider.vue';
/**
 * Next line disabled because this is not production code. this is development code.
 * So importing from devDeps is fine
 */
/* eslint-disable-next-line import/no-extraneous-dependencies */
import { action } from '@storybook/addon-actions';
import { propGenerator } from '../../mixinPropGenerator.js';

export default {
  title: 'Presentational Components/Table/Actions Dropdown',
  component: IFCActionsDropdown,
  parameters: {
    jest: ['ActionDropdown.spec.js'],
    backgrounds: {
    },
    docs: {
      description: {
        component: 'Table action selector',
      },
    },
  },
  argTypes: {
    dark: {
      control: {
        type: 'boolean',
        default: false,
      },
    },
    ...propGenerator(IFCActionsDropdown, {
      dark: 'Whether dark mode is enabled',
    }),
  },
};

const EXCLUDED_KEYS = ['dark'];

const CodeFactory = (args) => `
  <IFCThemeProvider :dark="${args.dark ?? false}">
    <IFCActionsDropdown
    ${Object.entries(args).filter(
    ([key]) => !EXCLUDED_KEYS.includes(key),
  ).map(([key, value]) => `${`${typeof value !== 'string' ? ':' : ''}${key}`}="${value}"\n`).join('   ')}>
      ${args.default}
    </IFCActionsDropdown>
  </IFCThemeProvider>
`;

const Template = (args, { argTypes }) => ({
  props: Object.keys(argTypes),
  components: { IFCActionsDropdown, IFCThemeProvider },
  methods: {
    onAction: action('@action'),
  },
  template: `
    <IFCThemeProvider :dark="dark">
      <IFCActionsDropdown
        @action="onAction"
        v-bind="$props">
        ${args.default}
      </IFCActionsDropdown>
    </IFCThemeProvider>
  `,
});

export const SingleAction = Template.bind({});
SingleAction.args = {
  actions: [
    'Select',
  ],
};
SingleAction.parameters = {
  docs: {
    source: {
      code: CodeFactory(SingleAction.args),
    },
  },
};

export const MultipleActions = Template.bind({});
MultipleActions.args = {
  actions: [
    'View System Page',
    'View Gallery',
    'View Information',
  ],
};
MultipleActions.parameters = {
  docs: {
    source: {
      code: CodeFactory(MultipleActions.args),
    },
  },
};

export const DarkMode = Template.bind({});
DarkMode.args = {
  dark: true,
  actions: [
    'View System Page',
    'View Gallery',
    'View Information',
  ],
};
DarkMode.parameters = {
  backgrounds: {
    default: 'Dark Mode',
  },
  docs: {
    source: {
      code: CodeFactory(DarkMode.args),
    },
  },
};
