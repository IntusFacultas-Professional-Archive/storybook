import { IFCH2 } from '@Components/Text/IFCH2.vue';
import { IFCThemeProvider } from '@Components/ThemeProvider/IFCThemeProvider.vue';

export default {
  title: 'Presentational Components/Typography/H2',
  component: IFCH2,
  parameters: {
    jest: ['IFCH2.spec.js'],
  },
  argTypes: {
  },
};

const EXCLUDED_KEYS = ['content'];

const CodeFactory = (args) => `
  <IFCH2
   ${Object.entries(args).filter(
    ([key]) => !EXCLUDED_KEYS.includes(key),
  ).map(([key, value]) => `${`${typeof value !== 'string' ? ':' : ''}${key}`}="${value}"\n`).join('   ')}  >
      ${args.content ?? '<!-- Content Here -->'}
  </IFCH2>
`;

const Template = (args, { argTypes }) => ({
  props: Object.keys(argTypes),
  components: { IFCH2, IFCThemeProvider },
  template: `
    <IFCThemeProvider :dark="dark">
      <IFCH2 v-bind="$props" >
        ${args.content ?? '<!-- Content Here -->'}
      </IFCH2>
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
