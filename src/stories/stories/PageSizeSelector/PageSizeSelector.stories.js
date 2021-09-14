import { IFCPageSizeSelector } from '@Components/Pagination/IFCPageSizeSelector/IFCPageSizeSelector.vue';
import { IFCThemeProvider } from '@Components/ThemeProvider/IFCThemeProvider.vue';
/**
 * Next line disabled because this is not production code. this is development code.
 * So importing from devDeps is fine
 */
/* eslint-disable-next-line import/no-extraneous-dependencies */
import { action } from '@storybook/addon-actions';
import { propGenerator } from '../../mixinPropGenerator.js';

export default {
  title: 'Presentational Components/Pagination/Page Size Selector',
  component: IFCPageSizeSelector,
  argTypes: {
    ...propGenerator(IFCPageSizeSelector, {
      dark: 'Whether dark mode is enabled',
    }),
    dark: {
      control: {
        type: 'boolean',
        default: false,
      },
    },
  },
  parameters: {
    docs: {
      description: {
        component: `This component will allow a user to change how many items per page there are in a paginated 
        display.`,
      },
    },
    jest: ['IFCPageSizeSelector.spec.js'],
  },
};

const EXCLUDED_KEYS = ['dark'];
const CodeFactory = (args) => `
<IFCThemeProvider :dark="${args.dark ?? false}">
    <IFCPageSizeSelector 
    ${Object.entries(args).filter(
    ([key]) => !EXCLUDED_KEYS.includes(key),
  ).map(([key, value]) => `${`${typeof value !== 'string' ? ':' : ''}${key}`}="${value}"\n`).join('   ')} >
    </IFCPageSizeSelector>
  </IFCThemeProvider>
`;

const Template = (args, { argTypes }) => ({
  props: Object.keys(argTypes),
  components: { IFCPageSizeSelector, IFCThemeProvider },
  methods: {
    onChange: action('@change'),
  },
  template: `
  <IFCThemeProvider :dark="dark">
    <IFCPageSizeSelector @change="onChange" v-bind="$props" >
      <template #label>
        {{label}}
      </template>
      <template #option="{option}">
        {{option.text}}
      </template>
      <template #selected="{option}">
        {{option.text}}
      </template>
    </IFCPageSizeSelector>
  </IFCThemeProvider>
  `,
});
export const Default = Template.bind({});
Default.args = {
  value: 25,
  pageSizes: [25, 50, 100],
};
Default.parameters = {
  docs: {
    source: {
      code: CodeFactory(Default.args),
    },
  },
};

export const DarkMode = Template.bind({});
DarkMode.args = {
  value: 25,
  pageSizes: [25, 50, 100],
  dark: true,
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
