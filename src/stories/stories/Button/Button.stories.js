import { IFCButton } from '@Components/Button/IFCButton.vue';
import { IFCButtonGroup } from '@Components/Button/IFCButtonGroup.vue';
import { IFCParagraph } from '@Components/Text/IFCParagraph.vue';
import { IFCThemeProvider } from '@Components/ThemeProvider/IFCThemeProvider.vue';
/**
 * Next line disabled because this is not production code. this is development code.
 * So importing from devDeps is fine
 */
/* eslint-disable-next-line import/no-extraneous-dependencies */
import { action } from '@storybook/addon-actions';

const EXCLUDED_VARIANTS = ['circle', 'default', 'endcap'];
export default {
  title: 'Presentational Components/Form Components/Button',
  component: IFCButton,
  parameters: {
    jest: ['IFCButton.spec.js'],
  },
  argTypes: {
    dark: {
      control: {
        type: 'boolean',
        default: false,
      },
    },
    size: {
      control: {
        type: 'select',
        options: [
          'sm',
          'md',
          'lg',
        ],
      },
    },
    variant: {
      control: {
        type: 'select',
        options: [
          'transparent',
          'info',
          'primary',
          'success',
          'danger',
          'warning',
        ],
      },
    },
  },
};

const EXCLUDED_KEYS = ['dark', 'content'];

const CodeFactory = (args) => `
  <IFCThemeProvider :dark="${args.dark ?? false}">
    <IFCButton
    ${Object.entries(args).filter(
    ([key]) => !EXCLUDED_KEYS.includes(key),
  ).map(([key, value]) => `${`${typeof value !== 'string' ? ':' : ''}${key}`}="${value}"\n`).join('   ')}  >
        ${args.content ?? '<!-- Content Here -->'}
    </IFCButton>
  </IFCThemeProvider>
`;

const Template = (args, { argTypes }) => ({
  props: Object.keys(argTypes),
  components: { IFCButton, IFCThemeProvider },
  methods: {
    onClick: action('@click'),
  },
  template: `
  <IFCThemeProvider :dark="dark">
    <IFCButton @click="onClick" v-bind="$props" >
      {{content}}
    </IFCButton>
  </IFCThemeProvider>
  `,
});

export const Primary = Template.bind({});
Primary.args = {
  variant: 'primary',
  content: 'Primary',
};
Primary.parameters = {
  docs: {
    source: {
      code: CodeFactory(Primary.args),
    },
  },
};

export const DarkMode = Template.bind({});
DarkMode.args = {
  variant: 'primary',
  content: 'Primary',
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

export const Danger = Template.bind({});
Danger.args = {
  variant: 'danger',
  content: 'Error',
};
Danger.parameters = {
  docs: {
    source: {
      code: CodeFactory(Danger.args),
    },
  },
};

export const Warning = Template.bind({});
Warning.args = {
  variant: 'warning',
  content: 'Warning',
};
Warning.parameters = {
  docs: {
    source: {
      code: CodeFactory(Warning.args),
    },
  },
};
export const Info = Template.bind({});
Info.args = {
  variant: 'info',
  content: 'Info',
};
Info.parameters = {
  docs: {
    source: {
      code: CodeFactory(Info.args),
    },
  },
};

export const Small = Template.bind({});
Small.args = {
  size: 'sm',
  variant: 'primary',
  content: 'Button',
};
Small.parameters = {
  docs: {
    source: {
      code: CodeFactory(Small.args),
    },
  },
};

export const Medium = Template.bind({});
Medium.args = {
  size: 'md',
  variant: 'primary',
  content: 'Button',
};
Medium.parameters = {
  docs: {
    source: {
      code: CodeFactory(Medium.args),
    },
  },
};

export const Large = Template.bind({});
Large.args = {
  size: 'lg',
  variant: 'primary',
  content: 'Button',
};
Large.parameters = {
  docs: {
    source: {
      code: CodeFactory(Large.args),
    },
  },
};

export const Block = Template.bind({});
Block.args = {
  block: true,
  variant: 'primary',
  content: 'Button',
};
Block.parameters = {
  docs: {
    source: {
      code: CodeFactory(Block.args),
    },
  },
};

export const Endcap = Template.bind({});
Endcap.args = {
  endcap: true,
  variant: 'primary',
  content: 'Button',
};
Endcap.parameters = {
  docs: {
    source: {
      code: CodeFactory(Endcap.args),
    },
  },
};

export const CircularButton = Template.bind({});
CircularButton.args = {
  circle: true,
  variant: 'primary',
  content: 'i',
};
CircularButton.parameters = {
  docs: {
    source: {
      code: CodeFactory(CircularButton.args),
    },
  },
};

const IFCButtonGroupTemplate = (args, { argTypes }) => ({
  components: {
    IFCButton, IFCButtonGroup, IFCThemeProvider, IFCParagraph,
  },
  methods: {
    onClick: action('@click'),
  },
  template: `
  <IFCThemeProvider>
    <IFCButtonGroup v-bind="$props">
      <IFCButton @click="onClick" variant="primary" >
        Primary Button
      </IFCButton>
      <IFCButton @click="onClick" variant="danger">
        Danger Button
      </IFCButton>
    </IFCButtonGroup>
    <IFCParagraph>
      The following button group has the block prop set to true
    </IFCParagraph>
    <IFCButtonGroup block>
      <IFCButton @click="onClick" variant="primary" :block="block">
        Primary Button
      </IFCButton>
      <IFCButton @click="onClick" variant="danger" :block="block">
        Danger Button
      </IFCButton>
    </IFCButtonGroup>

  </IFCThemeProvider>
  `,
});
export const GroupedButtons = IFCButtonGroupTemplate.bind({});
GroupedButtons.args = {
};
