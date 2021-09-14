import IFCCap from '@Components/Cap/IFCCap.vue';
import IFCInput from '@Components/Input/IFCInput.vue';
import { IFCThemeProvider } from '@Components/ThemeProvider/IFCThemeProvider.vue';

export default {
  title: 'Presentational Components/Form Components/Endcap',
  component: IFCCap,
  argTypes: {
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
        component: `This endcap will allow you to add endcap labels to inputs. It will search for the input in
        its parents tree and inherit focus, disabled, dark, and state data from it, so make sure not to add it as
        the root element in the endcap slots.`,
      },
    },
    jest: ['IFCCap.spec.js'],
  },
};

const EXCLUDED_KEYS = ['dark', 'content'];

const CodeFactory = (args) => `
<IFCThemeProvider :dark="${args.dark ?? false}">
  <IFCCap
   ${Object.entries(args).filter(
    ([key]) => !EXCLUDED_KEYS.includes(key),
  ).map(([key, value]) => `${`${typeof value !== 'string' ? ':' : ''}${key}`}="${value}"\n`).join('   ')}  >
      ${args.content ?? '<!-- Content Here -->'}
  </IFCCap>
</IFCThemeProvider>
`;
const IntegratedCodeFactory = (args) => `
<IFCThemeProvider :dark="${args.dark ?? false}">
  <IFCInput
    type="text"
    name="ExampleInput"
    value=""
  >
    <template v-slot:label>
      Label
    </template>
    <template v-slot:front-endcap>
      ${args['front-endcap'] ?? '<!-- Content here -->'}
    </template>
    <template v-slot:endcap>
      ${args.endcap ?? '<!-- Content here -->'}
    </template>
  </IFCInput>
  <IFCCap
   ${Object.entries(args).filter(
    ([key]) => !EXCLUDED_KEYS.includes(key),
  ).map(([key, value]) => `${`${typeof value !== 'string' ? ':' : ''}${key}`}="${value}"\n`).join('   ')}  >
      ${args.content ?? '<!-- Content Here -->'}
  </IFCCap>
</IFCThemeProvider>
`;

const Template = (args, { argTypes }) => ({
  props: Object.keys(argTypes),
  components: { IFCCap, IFCThemeProvider },
  template: `
  <IFCThemeProvider>
    <IFCCap v-bind="$props" >
      {{content}}
    </IFCCap>
  </IFCThemeProvider>
  `,
});

export const FrontEndcap = Template.bind({});
FrontEndcap.args = {
  front: true,
  content: 'Front Endcap',
};
FrontEndcap.parameters = {
  docs: {
    source: {
      code: CodeFactory(FrontEndcap.args),
    },
  },
};

export const Endcap = Template.bind({});
Endcap.args = {
  content: 'Endcap',
};
Endcap.parameters = {
  docs: {
    source: {
      code: CodeFactory(Endcap.args),
    },
  },
};

const IntegratedTemplate = (args, { argTypes }) => ({
  props: Object.keys(argTypes),
  components: { IFCCap, IFCInput, IFCThemeProvider },
  template: `
  <IFCThemeProvider :dark="dark">
    <IFCInput
      type="text"
      name="ExampleInput"
      value=""
    >
      <template #front-endcap>
        ${args['front-endcap'] ?? ''}
      </template>
      <template #label>
        Label
      </template>
      <template #endcap>
        ${args.endcap ?? ''}
      </template>
    </IFCInput>
  </IFCThemeProvider>
  `,
});

export const IntegratedFrontEndcap = IntegratedTemplate.bind({});
IntegratedFrontEndcap.args = {
  'front-endcap': '<IFCCap :front="true">Front Endcap</IFCCap>',
};
IntegratedFrontEndcap.parameters = {
  docs: {
    source: {
      code: IntegratedCodeFactory(IntegratedFrontEndcap.args),
    },
  },
};

export const DarkMode = IntegratedTemplate.bind({});
DarkMode.args = {
  dark: true,
  'front-endcap': '<IFCCap :front="true">Front Endcap</IFCCap>',
};
DarkMode.parameters = {
  backgrounds: {
    default: 'Dark Mode',
  },
  docs: {
    source: {
      code: IntegratedCodeFactory(DarkMode.args),
    },
  },
};

export const IntegratedEndcap = IntegratedTemplate.bind({});
IntegratedEndcap.args = {
  endcap: '<IFCCap>Endcap</IFCCap>',
};
IntegratedEndcap.parameters = {
  docs: {
    source: {
      code: IntegratedCodeFactory(IntegratedEndcap.args),
    },
  },
};
