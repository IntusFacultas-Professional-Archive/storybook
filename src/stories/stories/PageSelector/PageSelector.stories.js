import { IFCPageSelector } from '@Components/Pagination/IFCPageSelector/IFCPageSelector.vue';
import { IFCThemeProvider } from '@Components/ThemeProvider/IFCThemeProvider.vue';
/**
 * Next line disabled because this is not production code. this is development code.
 * So importing from devDeps is fine
 */
/* eslint-disable-next-line import/no-extraneous-dependencies */
import { action } from '@storybook/addon-actions';
import { propGenerator } from '../../mixinPropGenerator.js';

export default {
  title: 'Presentational Components/Pagination/Page Selector',
  component: IFCPageSelector,
  argTypes: {
    ...propGenerator(IFCPageSelector, {
      dark: 'Whether dark mode is enabled',
    }),
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
        component: `This component will allow a user to change how many items per page there are in a paginated 
        display.`,
      },
    },
    jest: ['IFCPageSelector.spec.js'],
  },
};

const EXCLUDED_KEYS = ['dark'];
const CodeFactory = (args) => `
<IFCThemeProvider :dark="${args.dark ?? false}">
    <IFCPageSelector 
    ${Object.entries(args).filter(
    ([key]) => !EXCLUDED_KEYS.includes(key),
  ).map(([key, value]) => `${`${typeof value !== 'string' ? ':' : ''}${key}`}="${value}"\n`).join('   ')} >
    </IFCPageSelector>
  </IFCThemeProvider>
`;

const Template = (args, { argTypes }) => ({
  props: Object.keys(argTypes),
  components: { IFCPageSelector, IFCThemeProvider },
  data() {
    return {
      internalValue: 0,
    };
  },
  mounted() {
    this.internalValue = this.value;
  },
  watch: {
    value(newVal) {
      this.internalValue = newVal;
    },
  },
  methods: {
    onChange: action('@change'),
    onInput: action('@input'),
  },
  template: `
  <IFCThemeProvider :dark="dark">
    <IFCPageSelector @change="onChange" @input="onInput" v-model="internalValue" v-bind="$props" >
      <template #label>
        {{label}}
      </template>
      <template #option="{option}">
        {{option.text}}
      </template>
      <template #selected="{option}">
        {{option.text}}
      </template>
    </IFCPageSelector>
  </IFCThemeProvider>
  `,
});
export const ArrayOfPages = Template.bind({});
ArrayOfPages.args = {
  value: 1,
  pages: [1, 2, 3, 5],
};
ArrayOfPages.parameters = {
  docs: {
    source: {
      code: CodeFactory(ArrayOfPages.args),
    },
  },
};

export const DarkMode = Template.bind({});
DarkMode.args = {
  value: 1,
  pages: [1, 2, 3, 5],
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

export const MaxPages = Template.bind({});
MaxPages.args = {
  value: 1,
  pages: 5,
};
MaxPages.parameters = {
  docs: {
    source: {
      code: CodeFactory(MaxPages.args),
    },
  },
};

export const ManyPages = Template.bind({});
ManyPages.args = {
  value: 1,
  pages: 100,
};
ManyPages.parameters = {
  docs: {
    source: {
      code: CodeFactory(ManyPages.args),
    },
  },
};

export const Dark = Template.bind({});
Dark.args = {
  value: 1,
  pages: [1, 2, 3, 4, 5],
  dark: true,
};
Dark.parameters = {
  backgrounds: {
    default: 'Dark Mode',
  },
  docs: {
    source: {
      code: CodeFactory(Dark.args),
    },
  },
};

const BottomTemplate = (args, { argTypes }) => ({
  props: Object.keys(argTypes),
  components: { IFCPageSelector, IFCThemeProvider },
  methods: {
    onChange: action('@change'),
  },
  template: `
  <IFCThemeProvider>
    <div style="height: 100vh; display: flex; flex-direction: column; justify-content: flex-end">
      <IFCPageSelector @change="onChange" v-bind="$props" >
        <template #label>
          {{label}}
        </template>
        <template #option="{option}">
          {{option.text}}
        </template>
        <template #selected="{option}">
          {{option.text}}
        </template>
      </IFCPageSelector>
    </div>
  </IFCThemeProvider>
  `,
});

export const ManyPagesAtBottomOfPage = BottomTemplate.bind({});
ManyPagesAtBottomOfPage.args = {
  value: 1,
  pages: 100,
};
ManyPagesAtBottomOfPage.parameters = {
  docs: {
    source: {
      code: CodeFactory(ManyPagesAtBottomOfPage.args),
    },
  },
};

export const FewPagesAtBottomOfPage = BottomTemplate.bind({});
FewPagesAtBottomOfPage.args = {
  value: 1,
  pages: 2,
};
FewPagesAtBottomOfPage.parameters = {
  docs: {
    source: {
      code: CodeFactory(FewPagesAtBottomOfPage.args),
    },
  },
};
