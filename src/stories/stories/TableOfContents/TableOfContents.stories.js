import IFCTableOfContents from '@Components/TableOfContents/IFCTableOfContents.vue';
import { IFCThemeProvider } from '@Components/ThemeProvider/IFCThemeProvider.vue';

/**
 * Next line disabled because this is not production code. this is development code.
 * So importing from devDeps is fine
 */
/* eslint-disable-next-line import/no-extraneous-dependencies */
import { action } from '@storybook/addon-actions';
import { LoremIpsum1, LoremIpsum1Modified, LoremIpsum2 } from '@App/stories/TableOfContentsElements';
import { IFCTableOfContentsPlugin } from '@Components/TableOfContents/IFCTableOfContentsPlugin';
import { IFCParagraph } from '@Components/Text/IFCParagraph.vue';
import { IFCH1 } from '@Components/Text/IFCH1.vue';
import { IFCH2 } from '@Components/Text/IFCH2.vue';
import { IFCH3 } from '@Components/Text/IFCH3.vue';
import { IFCH4 } from '@Components/Text/IFCH4.vue';
import { IFCH5 } from '@Components/Text/IFCH5.vue';
import { IFCH6 } from '@Components/Text/IFCH6.vue';
import Vue from 'vue';

export default {
  title: 'Container Components/Table of Contents',
  component: IFCTableOfContents,
  parameters: {
    jest: ['IFCTableOfContents.spec.js'],
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

Vue.use(IFCTableOfContentsPlugin);
const EXCLUDED_KEYS = ['dark', 'default'];

const CodeFactory = (args) => `
<IFCThemeProvider :dark="${args.dark ?? false}">
  <IFCTableOfContents
   ${Object.entries(args).filter(
    ([key]) => !EXCLUDED_KEYS.includes(key),
  ).map(([key, value]) => `${`${typeof value !== 'string' ? ':' : ''}${key}`}="${value}"\n`).join('   ')}  />
</IFCThemeProvider>
`;

const Template = (args, { argTypes }) => ({
  props: Object.keys(argTypes),
  components: {
    IFCTableOfContents,
    IFCThemeProvider,
    IFCParagraph,
    IFCH1,
    IFCH2,
    IFCH3,
    IFCH4,
    IFCH5,
    IFCH6,
  },
  methods: {
    onchange: action('@change'),
  },
  template: `
  <IFCThemeProvider :dark="dark">
    <div style="display: flex">
      <div style='flex: 1; max-width:200px; position: relative;'>
        <div style="position: sticky; top: 0; margin-top: 100px;">
          <IFCTableOfContents v-bind="$props" />
        </div>
      </div>
      <div style="flex: 1;">
        ${LoremIpsum1}
      </div>
    </div>
  </IFCThemeProvider>
  `,
});

const OverridenTemplate = (args, { argTypes }) => ({
  props: Object.keys(argTypes),
  components: {
    IFCTableOfContents,
    IFCThemeProvider,
    IFCParagraph,
    IFCH1,
    IFCH2,
    IFCH3,
    IFCH4,
    IFCH5,
    IFCH6,
  },
  methods: {
    onchange: action('@change'),
  },
  template: `
  <IFCThemeProvider :dark="dark">
    <div style="display: flex">
      <div style='flex: 1; max-width:200px; position: relative;'>
        <div style="position: sticky; top: 0; margin-top: 100px;">
          <IFCTableOfContents v-bind="$props" />
        </div>
      </div>
      <div style="flex: 1;">
        ${LoremIpsum2}
      </div>
    </div>
  </IFCThemeProvider>
  `,
});

export const DefaultState = Template.bind({});
DefaultState.args = {
};
DefaultState.parameters = {
  docs: {
    source: {
      code: CodeFactory(DefaultState.args),
    },
  },
};

export const DarkMode = Template.bind({});
DarkMode.args = {
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

export const OverridenQuery = OverridenTemplate.bind({});
OverridenQuery.args = {
  queryOverride: 'span.title',
};
OverridenQuery.parameters = {
  docs: {
    source: {
      code: CodeFactory(OverridenQuery.args),
    },
  },
};

const PluginTemplate = (args, { argTypes }) => ({
  props: Object.keys(argTypes),
  components: {
    IFCTableOfContents,
    IFCThemeProvider,
    IFCParagraph,
    IFCH1,
    IFCH2,
    IFCH3,
    IFCH4,
    IFCH5,
    IFCH6,
  },
  data() {
    return {
      shown: true,
    };
  },
  template: `
    <IFCThemeProvider :dark="dark">
    <div style="display: flex">
      <div style='flex: 1; max-width:200px; position: relative;'>
        <div style="position: sticky; top: 0; margin-top: 100px;">
          <IFCTableOfContents v-bind="$props" />
        </div>
      </div>
      <div style="flex: 1;">
        <div style="width: 100%">
          <button @click="shown = !shown">Change Content</button>
          <button @click="$IFCTOCRefresh()">Update TOC using $IFCTOCRefresh</button>
        </div>
        <div v-if="shown">
          ${LoremIpsum1}
        </div>
        <div v-if="!shown">
          ${LoremIpsum1Modified}
        </div>
      </div>
    </div>
  </IFCThemeProvider>
  `,
});

export const UpdatedWithPlugin = PluginTemplate.bind({});
UpdatedWithPlugin.args = {

};
UpdatedWithPlugin.parameters = {
  docs: {
    source: {
      code: CodeFactory(UpdatedWithPlugin.args),
    },
  },
};
