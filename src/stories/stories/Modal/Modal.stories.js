import { IFCModal } from '@Components/Modal/IFCModal.vue';
import { IFCButton } from '@Components/Button/IFCButton.vue';
import { IFCModalPlugin } from '@Components/Modal/IFCModalPlugin';
import { IFCThemeProvider } from '@Components/ThemeProvider/IFCThemeProvider.vue';
import { IFCParagraph } from '@Components/Text/IFCParagraph';
/**
 * Next line disabled because this is not production code. this is development code.
 * So importing from devDeps is fine
 */
/* eslint-disable-next-line import/no-extraneous-dependencies */
import { action } from '@storybook/addon-actions';
import Vue from 'vue';

Vue.use(IFCModalPlugin);
export default {
  title: 'Presentational Components/Layout/Modal',
  component: IFCModal,
  parameters: {
    jest: [],
  },
  argTypes: {
  },
};

const EXCLUDED_KEYS = ['dark', 'header', 'content', 'footer'];

const CodeFactory = (args) => `
  <IFCModal
   ${Object.entries(args).filter(
    ([key]) => !EXCLUDED_KEYS.includes(key),
  ).map(([key, value]) => `${`${typeof value !== 'string' ? ':' : ''}${key}`}="${value}"\n`).join('   ')}  >
    <template v-slot:header>
      ${args.header ?? '<!-- Content Here -->'}
    </template>
    ${args.content ?? '<!-- Content Here -->'}
    <template v-slot:footer>
      ${args.footer ?? '<!-- Content Here -->'}
    </template>
  </IFCModal>
`;

const Template = (args, { argTypes }) => ({
  props: Object.keys(argTypes),
  components: {
    IFCModal, IFCThemeProvider, IFCParagraph, IFCButton,
  },
  data() {
    return {
      modalVisible: false,
    };
  },
  mounted() {
    this.modalVisible = args.show;
  },
  watch: {
    show(newVal) {
      this.modalVisible = newVal;
    },
  },
  methods: {
    onToggle: action('@toggle'),
  },
  template: `
    <IFCThemeProvider :dark="dark ?? false">
      <img src="https://picsum.photos/200/300" role="none"/>
      <IFCButton variant="primary" @click="modalVisible = true">Trigger Modal</IFCButton>
      <IFCParagraph>
        Lorem ipsum dolor sit amet, consectetur adipiscing elit. 
        Quisque rutrum nunc et leo pellentesque, a tempus ex fringilla. 
        Fusce tempus sed mi a porta. Proin ut feugiat quam. Integer 
        ultricies lorem fermentum, accumsan mi in, elementum sem. Ut 
        vel consequat ex. Sed lobortis fermentum dolor, sed ullamcorper 
        turpis auctor eu. Sed quis leo quis augue feugiat sagittis vitae vitae 
        mauris. Fusce suscipit iaculis suscipit. Duis lacinia ornare semper. Sed sit 
        amet elit id lectus eleifend sodales. Pellentesque tortor augue, 
        maximus nec augue sit amet, dignissim tincidunt ex. Aenean sit amet 
        tortor et nisl tempus blandit. Aliquam mollis, magna at finibus congue, 
        purus purus tincidunt ex, ac hendrerit purus neque eu leo. Donec 
        rhoncus, nunc at lobortis pulvinar, mauris nisl venenatis nulla, 
        quis bibendum justo arcu sed massa.
      </IFCParagraph>
      <IFCModal @toggle="modalVisible = !modalVisible; onToggle($event)" v-bind="$props" :show="modalVisible" >
        <template v-slot:header>
          ${args.header ?? ''}
        </template>
        ${args.content ?? '<!-- Content Here -->'}
        <template v-slot:footer>
          ${args.footer ?? ''}
        </template>
      </IFCModal>
    </IFCThemeProvider>
  `,
});

const PluginTemplate = (args, { argTypes }) => ({
  props: Object.keys(argTypes),
  components: { IFCModal, IFCThemeProvider, IFCButton },
  template: `
    <IFCThemeProvider>
      <img src="https://picsum.photos/200/300" role="none"/>
      <IFCButton variant="primary" @click="$IFCModal(id, true)">Trigger Modal</IFCButton>
      <IFCParagraph>
        Lorem ipsum dolor sit amet, consectetur adipiscing elit. 
        Quisque rutrum nunc et leo pellentesque, a tempus ex fringilla. 
        Fusce tempus sed mi a porta. Proin ut feugiat quam. Integer 
        ultricies lorem fermentum, accumsan mi in, elementum sem. Ut 
        vel consequat ex. Sed lobortis fermentum dolor, sed ullamcorper 
        turpis auctor eu. Sed quis leo quis augue feugiat sagittis vitae vitae 
        mauris. Fusce suscipit iaculis suscipit. Duis lacinia ornare semper. Sed sit 
        amet elit id lectus eleifend sodales. Pellentesque tortor augue, 
        maximus nec augue sit amet, dignissim tincidunt ex. Aenean sit amet 
        tortor et nisl tempus blandit. Aliquam mollis, magna at finibus congue, 
        purus purus tincidunt ex, ac hendrerit purus neque eu leo. Donec 
        rhoncus, nunc at lobortis pulvinar, mauris nisl venenatis nulla, 
        quis bibendum justo arcu sed massa.
      </IFCParagraph>
      <IFCModal v-bind="$props" >
        <template v-slot:header>
          ${args.header ?? ''}
        </template>
        ${args.content ?? '<!-- Content Here -->'}
        <template v-slot:footer>
          ${args.footer ?? ''}
        </template>
      </IFCModal>
    </IFCThemeProvider>
  `,
});

export const FullModal = Template.bind({});
FullModal.args = {
  id: 'modal',
  title: 'Modal Title',
  footer: '<IFCParagraph marginless>Modal Footer</IFCParagraph>',
  content: '<IFCParagraph marginless>Modal Content</IFCParagraph>',
  modalDescription: 'This is a sample modal',
};
FullModal.parameters = {
  docs: {
    source: {
      code: CodeFactory(FullModal.args),
    },
  },
};

export const DarkMode = Template.bind({});
DarkMode.args = {
  id: 'modal',
  dark: true,
  title: 'Modal Title',
  footer: '<IFCParagraph marginless>Modal Footer</IFCParagraph>',
  content: '<IFCParagraph marginless>Modal Content</IFCParagraph>',
  modalDescription: 'This is a sample modal',
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

export const NoHeader = Template.bind({});
NoHeader.args = {
  id: 'modal',
  footer: '<IFCParagraph marginless>Modal Footer</IFCParagraph>',
  hideHeader: true,
  content: '<IFCParagraph marginless>Modal Content</IFCParagraph>',
  modalDescription: 'This is a sample modal',
};
NoHeader.parameters = {
  docs: {
    source: {
      code: CodeFactory(NoHeader.args),
    },
  },
};

export const OverridenHeader = Template.bind({});
OverridenHeader.args = {
  id: 'modal',
  footer: '<IFCParagraph marginless>Modal Footer</IFCParagraph>',
  header: '<IFCParagraph marginless>Custom content in my header!</IFCParagraph>',
  content: '<IFCParagraph marginless>Modal Content</IFCParagraph>',
  modalDescription: 'This is a sample modal',
};
OverridenHeader.parameters = {
  docs: {
    source: {
      code: CodeFactory(OverridenHeader.args),
    },
  },
};

export const NoFooter = Template.bind({});
NoFooter.args = {
  id: 'modal',
  title: 'Modal Title',
  hideFooter: true,
  content: '<IFCParagraph marginless>Modal Content</IFCParagraph>',
  modalDescription: 'This is a sample modal',
};
NoFooter.parameters = {
  docs: {
    source: {
      code: CodeFactory(NoFooter.args),
    },
  },
};

export const TriggeredWithPlugin = PluginTemplate.bind({});
TriggeredWithPlugin.args = {
  id: 'modal',
  title: 'Modal Title',
  content: '<IFCParagraph marginless>Modal Content</IFCParagraph>',
  modalDescription: 'This is a sample modal',
};
TriggeredWithPlugin.parameters = {
  docs: {
    source: {
      code: CodeFactory(TriggeredWithPlugin.args),
    },
  },
};

export const LargeContent = Template.bind({});
LargeContent.args = {
  id: 'modal',
  title: 'Modal Title',
  footer: '<IFCParagraph marginless>Modal Footer</IFCParagraph>',
  content: `
  <IFCParagraph>
  Lorem ipsum dolor sit amet, consectetur adipiscing elit. 
  Quisque rutrum nunc et leo pellentesque, a tempus ex fringilla. 
  Fusce tempus sed mi a porta. Proin ut feugiat quam. Integer 
  ultricies lorem fermentum, accumsan mi in, elementum sem. Ut 
  vel consequat ex. Sed lobortis fermentum dolor, sed ullamcorper 
  turpis auctor eu. Sed quis leo quis augue feugiat sagittis vitae vitae 
  mauris. Fusce suscipit iaculis suscipit. Duis lacinia ornare semper. Sed sit 
  amet elit id lectus eleifend sodales. Pellentesque tortor augue, 
  maximus nec augue sit amet, dignissim tincidunt ex. Aenean sit amet 
  tortor et nisl tempus blandit. Aliquam mollis, magna at finibus congue, 
  purus purus tincidunt ex, ac hendrerit purus neque eu leo. Donec 
  rhoncus, nunc at lobortis pulvinar, mauris nisl venenatis nulla, 
  quis bibendum justo arcu sed massa.
</IFCParagraph>
<IFCParagraph>
        Lorem ipsum dolor sit amet, consectetur adipiscing elit. 
        Quisque rutrum nunc et leo pellentesque, a tempus ex fringilla. 
        Fusce tempus sed mi a porta. Proin ut feugiat quam. Integer 
        ultricies lorem fermentum, accumsan mi in, elementum sem. Ut 
        vel consequat ex. Sed lobortis fermentum dolor, sed ullamcorper 
        turpis auctor eu. Sed quis leo quis augue feugiat sagittis vitae vitae 
        mauris. Fusce suscipit iaculis suscipit. Duis lacinia ornare semper. Sed sit 
        amet elit id lectus eleifend sodales. Pellentesque tortor augue, 
        maximus nec augue sit amet, dignissim tincidunt ex. Aenean sit amet 
        tortor et nisl tempus blandit. Aliquam mollis, magna at finibus congue, 
        purus purus tincidunt ex, ac hendrerit purus neque eu leo. Donec 
        rhoncus, nunc at lobortis pulvinar, mauris nisl venenatis nulla, 
        quis bibendum justo arcu sed massa.
      </IFCParagraph>
      <IFCParagraph>
        Lorem ipsum dolor sit amet, consectetur adipiscing elit. 
        Quisque rutrum nunc et leo pellentesque, a tempus ex fringilla. 
        Fusce tempus sed mi a porta. Proin ut feugiat quam. Integer 
        ultricies lorem fermentum, accumsan mi in, elementum sem. Ut 
        vel consequat ex. Sed lobortis fermentum dolor, sed ullamcorper 
        turpis auctor eu. Sed quis leo quis augue feugiat sagittis vitae vitae 
        mauris. Fusce suscipit iaculis suscipit. Duis lacinia ornare semper. Sed sit 
        amet elit id lectus eleifend sodales. Pellentesque tortor augue, 
        maximus nec augue sit amet, dignissim tincidunt ex. Aenean sit amet 
        tortor et nisl tempus blandit. Aliquam mollis, magna at finibus congue, 
        purus purus tincidunt ex, ac hendrerit purus neque eu leo. Donec 
        rhoncus, nunc at lobortis pulvinar, mauris nisl venenatis nulla, 
        quis bibendum justo arcu sed massa.
      </IFCParagraph>
      <IFCParagraph>
        Lorem ipsum dolor sit amet, consectetur adipiscing elit. 
        Quisque rutrum nunc et leo pellentesque, a tempus ex fringilla. 
        Fusce tempus sed mi a porta. Proin ut feugiat quam. Integer 
        ultricies lorem fermentum, accumsan mi in, elementum sem. Ut 
        vel consequat ex. Sed lobortis fermentum dolor, sed ullamcorper 
        turpis auctor eu. Sed quis leo quis augue feugiat sagittis vitae vitae 
        mauris. Fusce suscipit iaculis suscipit. Duis lacinia ornare semper. Sed sit 
        amet elit id lectus eleifend sodales. Pellentesque tortor augue, 
        maximus nec augue sit amet, dignissim tincidunt ex. Aenean sit amet 
        tortor et nisl tempus blandit. Aliquam mollis, magna at finibus congue, 
        purus purus tincidunt ex, ac hendrerit purus neque eu leo. Donec 
        rhoncus, nunc at lobortis pulvinar, mauris nisl venenatis nulla, 
        quis bibendum justo arcu sed massa.
      </IFCParagraph>

  `,
  modalDescription: 'This is a sample modal',
};
LargeContent.parameters = {
  docs: {
    source: {
      code: CodeFactory(LargeContent.args),
    },
  },
};
