import { IFCH5 } from '@Components/Text/IFCH5.vue';
import { IFCThemeProvider } from '@Components/ThemeProvider/IFCThemeProvider.vue';

export default {
  title: 'Presentational Components/Typography/H5',
  component: IFCH5,
  parameters: {
    jest: ['IFCH5.spec.js'],
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

const EXCLUDED_KEYS = ['content'];

const CodeFactory = (args) => `
  <IFCH5
   ${Object.entries(args).filter(
    ([key]) => !EXCLUDED_KEYS.includes(key),
  ).map(([key, value]) => `${`${typeof value !== 'string' ? ':' : ''}${key}`}="${value}"\n`).join('   ')}  >
      ${args.content ?? '<!-- Content Here -->'}
  </IFCH5>
`;

const Template = (args, { argTypes }) => ({
  props: Object.keys(argTypes),
  components: { IFCH5, IFCThemeProvider },
  template: `
    <IFCThemeProvider :dark="dark">
      <IFCH5 v-bind="$props" >
        ${args.content ?? '<!-- Content Here -->'}
      </IFCH5>
    </IFCThemeProvider>
  `,
});

export const LightTheme = Template.bind({});
LightTheme.args = {
  content: 'HTML Slot here',
};
LightTheme.parameters = {
  docs: {
    source: {
      code: CodeFactory(LightTheme.args),
    },
  },
};

export const Bold = Template.bind({});
Bold.args = {
  content: 'HTML Slot here',
  bold: true,
};
Bold.parameters = {
  docs: {
    source: {
      code: CodeFactory(Bold.args),
    },
  },
};

export const FontSizeOverriden = Template.bind({});
FontSizeOverriden.args = {
  content: 'HTML Slot here',
  size: 28,
};
FontSizeOverriden.parameters = {
  docs: {
    source: {
      code: CodeFactory(FontSizeOverriden.args),
    },
  },
};

export const ColorOverriden = Template.bind({});
ColorOverriden.args = {
  content: 'HTML Slot here',
  color: '#d9534f',
};
ColorOverriden.parameters = {
  docs: {
    source: {
      code: CodeFactory(ColorOverriden.args),
    },
  },
};

export const DarkTheme = Template.bind({});
DarkTheme.args = {
  content: 'HTML Slot here',
  dark: true,
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
