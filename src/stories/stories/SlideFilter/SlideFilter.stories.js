import { IFCSlideFilter } from '@Components/SlideFilter/IFCSlideFilter.vue';
import { IFCThemeProvider } from '@Components/ThemeProvider/IFCThemeProvider.vue';
/**
 * Next line disabled because this is not production code. this is development code.
 * So importing from devDeps is fine
 */
/* eslint-disable-next-line import/no-extraneous-dependencies */
import { action } from '@storybook/addon-actions';

export default {
  title: 'Container Components/Slide Filter',
  component: IFCSlideFilter,
  parameters: {
    jest: ['IFCSlider.spec.js'],
    docs: {
      description: `This component provides slider numeric filter capabilities. 
      This is considered a container component because it validates data to prevent slider cross over`,
    },
  },
  argTypes: {
    dark: {
      control: {
        type: 'boolean',
        default: false,
      },
    },
    label: {
      description: 'Slot for inserting HTML content into the label',
    },
    leftMicrocopy: {
      description: 'Slot for inserting HTML content into the left microcopy',
    },
    rightMicrocopy: {
      description: 'Slot for inserting HTML content into the right microcopy',
    },
  },
};

const EXCLUDED_KEYS = ['dark', 'label', 'leftMicrocopy', 'rightMicrocopy'];

const CodeFactory = (args) => `
<IFCThemeProvider :dark="${args.dark ?? false}">
  <IFCSlideFilter
   ${Object.entries(args)
    .filter(([key]) => !EXCLUDED_KEYS.includes(key))
    .map(
      ([key, value]) => `${`${typeof value !== 'string' ? ':' : ''}${key}`}="${value}"\n`,
    )
    .join('   ')}  >
    <template v-slot:label>
      ${args.label ?? '<!-- Content here -->'}
    </template>
    <template v-slot:leftMicrocopy>
      ${args.leftMicrocopy ?? '<!-- Content here -->'}
    </template>
    <template v-slot:rightMicrocopy>
      ${args.rightMicrocopy ?? '<!-- Content here -->'}
    </template>
  </IFCSlideFilter>
</IFCThemeProvider>
`;

const Template = (args, { argTypes }) => ({
  props: Object.keys(argTypes),
  components: { IFCSlideFilter, IFCThemeProvider },
  data() {
    return {
      left: 0,
      right: 0,
    };
  },
  mounted() {
    this.left = this.lowerValue;
    this.right = this.upperValue;
  },
  watch: {
    lowerValue(newVal) {
      this.left = newVal;
    },
    upperValue(newVal) {
      this.right = newVal;
    },
  },
  methods: {
    onInput: action('@input'),
    onChange: action('@change'),
    handleChange(data) {
      this.left = data.lowerValue;
      this.right = data.upperValue;
    },
  },
  template: `
    <IFCThemeProvider :dark="dark">
      <IFCSlideFilter 
        @input="handleChange($event); onInput($event)"
        @change="handleChange($event); onChange($event)"
        v-bind="$props" 
        :lowerValue='left'
        :upperValue='right'>
        <template v-slot:label>
          ${args.label ?? ''}
        </template>
        <template v-slot:leftMicrocopy>
          ${args.leftMicrocopy ?? '<!-- Content here -->'}
        </template>
        <template v-slot:rightMicrocopy>
          ${args.rightMicrocopy ?? '<!-- Content here -->'}
        </template>
      </IFCSlideFilter>
    </IFCThemeProvider>
  `,
});

export const DefaultValue = Template.bind({});
DefaultValue.args = {
  min: 1,
  max: 100,
  lowerValue: 1,
  upperValue: 99,
  label: 'Numeric Filter Label',
  name: 'NumericFilter',
};
DefaultValue.parameters = {
  docs: {
    source: {
      code: CodeFactory(DefaultValue.args),
    },
  },
};

export const DarkMode = Template.bind({});
DarkMode.args = {
  min: 1,
  max: 100,
  lowerValue: 1,
  upperValue: 99,
  dark: true,
  label: 'Numeric Filter Label',
  name: 'NumericFilter',
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
