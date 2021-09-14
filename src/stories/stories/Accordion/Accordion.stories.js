import { IFCAccordion } from '@Components/Accordion/IFCAccordion.vue';
import { IFCButton } from '@Components/Button/IFCButton.vue';
import { IFCThemeProvider } from '@Components/ThemeProvider/IFCThemeProvider.vue';
/**
 * Next line disabled because this is not production code. this is development code.
 * So importing from devDeps is fine
 */
/* eslint-disable-next-line import/no-extraneous-dependencies */
import { action } from '@storybook/addon-actions';
import { IFCParagraph } from '@Components/Text/IFCParagraph.vue';
import { IFCH4 } from '@Components/Text/IFCH4.vue';

export default {
  title: 'Presentational Components/Layout/Accordion',
  component: IFCAccordion,
  parameters: {
    jest: ['IFCAccordion.spec.js'],
  },
  argTypes: {
  },
};

const EXCLUDED_KEYS = ['title', 'content'];

const CodeFactory = (args) => `
  <IFCAccordion
   ${Object.entries(args).filter(
    ([key]) => !EXCLUDED_KEYS.includes(key),
  ).map(([key, value]) => `${`${typeof value !== 'string' ? ':' : ''}${key}`}="${value}"\n`).join('   ')}  >
    <template v-slot:title>
      ${args.title ?? '<!-- Content Here -->'}
    </template>
      ${args.content ?? '<!-- Content Here -->'}
  </IFCAccordion>
`;

const Template = (args, { argTypes }) => ({
  props: Object.keys(argTypes),
  components: {
    IFCAccordion, IFCThemeProvider, IFCParagraph, IFCH4, IFCButton,
  },
  methods: {
    onToggle: action('@toggle'),
  },
  template: `
    <IFCThemeProvider>
      <IFCAccordion @toggle="onToggle" v-bind="$props" >
        <template v-slot:title>
          ${args.title ?? ''}
        </template>
        ${args.content ?? '<!-- Content Here -->'}
      </IFCAccordion>
    </IFCThemeProvider>
  `,
});

export const DefaultOpen = Template.bind({});
DefaultOpen.args = {
  openState: true,
  title: '<IFCH4>Title content can go here!</IFCH4>',
  content: `<div>
    <IFCParagraph>Content can go here. You control the collapse or open state using the openState prop in the 
      container component</IFCParagraph>
    <div style="color: white; background-color: black;">
      <IFCParagraph>This colored section has been added to show off the smooth closing animation.</IFCParagraph>
    </div>
  
  </div>`,
};
DefaultOpen.parameters = {
  docs: {
    source: {
      code: CodeFactory(DefaultOpen.args),
    },
  },
};

export const DefaultClose = Template.bind({});
DefaultClose.args = {
  openState: false,
  title: '<IFCH4>Title content can go here!</IFCH4>',
  content: `
    <IFCParagraph>Content can go here. You control the collapse or open state using the openState prop in the 
      container component</IFCParagraph>
    <div style="color: white; background-color: black;">
      <IFCParagraph>This colored section has been added to show off the smooth closing animation.</IFCParagraph>
    </div>
  `,
};
DefaultClose.parameters = {
  docs: {
    source: {
      code: CodeFactory(DefaultClose.args),
    },
  },
};

export const Underlined = Template.bind({});
Underlined.args = {
  openState: false,
  underlined: true,
  title: '<IFCH4>Title content can go here!</IFCH4>',
  content: `
    <IFCParagraph>Content can go here. You control the collapse or open state using the openState prop in the 
      container component</IFCParagraph>
    <div style="color: white; background-color: black;">
      <IFCParagraph>This colored section has been added to show off the smooth closing animation.</IFCParagraph>
    </div>
  `,
};
Underlined.parameters = {
  docs: {
    source: {
      code: CodeFactory(Underlined.args),
    },
  },
};

const ContainerTemplate = (args, { argTypes }) => ({
  props: Object.keys(argTypes),
  components: {
    IFCAccordion, IFCThemeProvider, IFCParagraph, IFCH4, IFCButton,
  },
  data() {
    return {
      manualState: true,
    };
  },
  methods: {
    onToggle: action('@toggle'),
  },
  template: `
    <IFCThemeProvider>
      <IFCAccordion @toggle="manualState = $event; onToggle($event)" :openState="manualState" >
        <template v-slot:title>
          ${args.title ?? ''}
        </template>
        ${args.content ?? '<!-- Content Here -->'}
      </IFCAccordion>
    </IFCThemeProvider>
  `,
});

export const ControlledByContainerComponent = ContainerTemplate.bind({});
ControlledByContainerComponent.args = {
  openState: false,
  title: '<IFCButton variant="primary" @click="manualState = !manualState">I trigger it to open and close</IFCButton>',
  content: `
    <IFCParagraph>Content can go here. You control the collapse or open state using the openState prop in the 
      container component</IFCParagraph>
    <div style="color: white; background-color: black;">
      <IFCParagraph>This colored section has been added to show off the smooth closing animation.</IFCParagraph>
    </div>
  `,
};
ControlledByContainerComponent.parameters = {
  docs: {
    source: {
      code: CodeFactory(ControlledByContainerComponent.args),
    },
  },
};
