import { IFCScreenReaderText } from '@Components/Text/IFCScreenReaderText.vue';
import { IFCParagraph } from '@Components/Text/IFCParagraph.vue';
import { IFCThemeProvider } from '@Components/ThemeProvider/IFCThemeProvider.vue';
/**
 * Next line disabled because this is not production code. this is development code.
 * So importing from devDeps is fine
 */
/* eslint-disable-next-line import/no-extraneous-dependencies */
import { action } from '@storybook/addon-actions';

export default {
  title: 'Presentational Components/Typography/Screen Reader Text',
  component: IFCScreenReaderText,
  parameters: {
    jest: ['IFCScreenReaderText.spec.js'],
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
  <IFCScreenReaderText
   ${Object.entries(args).filter(
    ([key]) => !EXCLUDED_KEYS.includes(key),
  ).map(([key, value]) => `${`${typeof value !== 'string' ? ':' : ''}${key}`}="${value}"\n`).join('   ')}  >
      ${args.content ?? '<!-- Content Here -->'}
  </IFCScreenReaderText>
`;

const Template = (args, { argTypes }) => ({
  props: Object.keys(argTypes),
  components: { IFCScreenReaderText, IFCParagraph, IFCThemeProvider },
  template: `
    <IFCThemeProvider :dark="dark">
      <IFCParagraph>Directly below me is a screen reader only text with tabindex 1 so you can tab to it.
      Try using a screen reader!</IFCParagraph>
      <IFCScreenReaderText v-bind="$props" tabindex="1" >
        ${args.content ?? '<!-- Content Here -->'}
      </IFCScreenReaderText>
    </IFCThemeProvider>
  `,
});

export const HiddenText = Template.bind({});
HiddenText.args = {
  content: 'I can\'t be seen by sighted users.',
};
HiddenText.parameters = {
  docs: {
    source: {
      code: CodeFactory(HiddenText.args),
    },
  },
};

export const VisibleText = Template.bind({});
VisibleText.args = {
  content: 'I normally am hidden but I was set to be visible again.',
  show: true,
};
VisibleText.parameters = {
  docs: {
    source: {
      code: CodeFactory(VisibleText.args),
    },
  },
};
