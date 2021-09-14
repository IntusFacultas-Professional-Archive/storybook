import { IFCLabel } from '@Components/Text/IFCLabel.vue';
import { IFCThemeProvider } from '@Components/ThemeProvider/IFCThemeProvider.vue';
/**
 * Next line disabled because this is not production code. this is development code.
 * So importing from devDeps is fine
 */
/* eslint-disable-next-line import/no-extraneous-dependencies */
import { action } from '@storybook/addon-actions';

export default {
  title: 'Presentational Components/Typography/Label',
  component: IFCLabel,
  parameters: {
    jest: ['IFCLabel.spec.js'],
  },
  argTypes: {
  },
};

const EXCLUDED_KEYS = ['content'];

const CodeFactory = (args) => `
  <IFCLabel
   ${Object.entries(args).filter(
    ([key]) => !EXCLUDED_KEYS.includes(key),
  ).map(([key, value]) => `${`${typeof value !== 'string' ? ':' : ''}${key}`}="${value}"\n`).join('   ')}  >
      ${args.content ?? '<!-- Content Here -->'}
  </IFCLabel>
`;

const Template = (args, { argTypes }) => ({
  props: Object.keys(argTypes),
  components: { IFCLabel, IFCThemeProvider },
  template: `
    <IFCThemeProvider :dark="dark">
      <IFCLabel v-bind="$props" >
        ${args.content ?? '<!-- Content Here -->'}
      </IFCLabel>
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
