import IFCRadio from '@Components/Radio/IFCRadio.vue';
import { IFCThemeProvider } from '@Components/ThemeProvider/IFCThemeProvider.vue';

/**
 * Next line disabled because this is not production code. this is development code.
 * So importing from devDeps is fine
 */
/* eslint-disable-next-line import/no-extraneous-dependencies */
import { action } from '@storybook/addon-actions';

import { propGenerator } from '../../mixinPropGenerator.js';

export default {
  title: 'Presentational Components/Form Components/Radio',
  component: IFCRadio,
  parameters: {
    jest: [],
  },
  argTypes: {
    ...propGenerator(IFCRadio, {
      dark: 'Whether dark mode is enabled',
    }),
    dark: {
      control: {
        type: 'boolean',
        default: false,
      },
    },
    default: {
      description: 'The slot for inserting content into the label',
    },
    // size: { control: { type: 'select', options: Object.keys(theme.button.sizing) } },
    variant: {
      control: {
        type: 'select',
        options: [
          'primary',
        ],
      },
    },
  },
};

const EXCLUDED_KEYS = ['dark', 'default'];

const CodeFactory = (args) => `
<IFCThemeProvider :dark="${args.dark ?? false}">
  <IFCRadio
   ${Object.entries(args).filter(
    ([key]) => !EXCLUDED_KEYS.includes(key),
  ).map(([key, value]) => `${`${typeof value !== 'string' ? ':' : ''}${key}`}="${value}"\n`).join('   ')}  >
      ${args.default ?? '<!-- Content Here -->'}
  </IFCRadio>
</IFCThemeProvider>
`;

const Template = (args, { argTypes }) => ({
  props: Object.keys(argTypes),
  components: { IFCRadio, IFCThemeProvider },
  methods: {
    onchange: action('@change'),
  },
  template: `
  <IFCThemeProvider :dark="dark">
    <IFCRadio @change="onchange" v-bind="$props" >
      ${args.default}
    </IFCRadio>
    <IFCRadio @change="onchange" v-bind="$props" >
      ${args.default}
    </IFCRadio>
    <IFCRadio @change="onchange" v-bind="$props" >
      ${args.default}
    </IFCRadio>
  </IFCThemeProvider>
  `,
});

export const Unchecked = Template.bind({});
Unchecked.args = {
  variant: 'primary',
  name: 'Apples!',
  value: 'Apples',
  default: 'Apples',
};
Unchecked.parameters = {
  docs: {
    source: {
      code: CodeFactory(Unchecked.args),
    },
  },
};

const SingleTemplate = (args, { argTypes }) => ({
  props: Object.keys(argTypes),
  components: { IFCRadio, IFCThemeProvider },
  methods: {
    onchange: action('@change'),
  },
  template: `
  <IFCThemeProvider :dark='dark'>
    <IFCRadio @change="onchange($event)" v-bind="$props" >
      ${args.default}
    </IFCRadio>
  </IFCThemeProvider>
  `,
});

export const Checked = SingleTemplate.bind({});
Checked.args = {
  variant: 'primary',
  name: 'Apples!',
  value: 'Apples',
  default: 'Apples',
  checked: true,
};
Checked.parameters = {
  docs: {
    source: {
      code: CodeFactory(Checked.args),
    },
  },
};

export const DarkMode = SingleTemplate.bind({});
DarkMode.args = {
  variant: 'primary',
  name: 'Apples!',
  value: 'Apples',
  default: 'Apples',
  checked: true,
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
