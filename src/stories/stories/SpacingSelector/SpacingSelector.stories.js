import IFCSpacingSelector from '@Components/Table/SpacingSelector/IFCSpacingSelector.vue';
import { IFCThemeProvider } from '@Components/ThemeProvider/IFCThemeProvider.vue';

/**
 * Next line disabled because this is not production code. this is development code.
 * So importing from devDeps is fine
 */
/* eslint-disable-next-line import/no-extraneous-dependencies */
import { action } from '@storybook/addon-actions';

export default {
  title: 'Presentational Components/Table/Sizing Selector',
  component: IFCSpacingSelector,
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
  },
};

const EXCLUDED_KEYS = ['dark'];

const CodeFactory = (args) => `
  <IFCThemeProvider :dark="${args.dark ?? false}">
    <IFCSpacingSelector
    ${Object.entries(args).filter(
    ([key]) => !EXCLUDED_KEYS.includes(key),
  ).map(([key, value]) => `${`${typeof value !== 'string' ? ':' : ''}${key}`}="${value}"\n`).join('   ')} />
  </IFCThemeProvider>
`;

const Template = (args, { argTypes }) => ({
  props: Object.keys(argTypes),
  components: { IFCSpacingSelector, IFCThemeProvider },
  methods: {
    onSizing: action('@sizing'),
  },
  template: `
    <IFCThemeProvider :dark='dark'>
      <IFCSpacingSelector style="margin-left: 10em"
        @sizing="onSizing"
        v-bind="$props">
        ${args.default}
      </IFCSpacingSelector>
    </IFCThemeProvider>
  `,
});

export const Dropdown = Template.bind({});
Dropdown.args = {
  sizes: [
    'condensed',
    'regular',
    'relaxed',
  ],
  value: 'condensed',
};
Dropdown.parameters = {
  docs: {
    source: {
      code: CodeFactory(Dropdown.args),
    },
  },
};

export const DarkMode = Template.bind({});
DarkMode.args = {
  dark: true,
  sizes: [
    'condensed',
    'regular',
    'relaxed',
  ],
  value: 'condensed',
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
