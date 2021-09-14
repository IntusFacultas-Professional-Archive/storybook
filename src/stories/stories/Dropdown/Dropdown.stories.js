import IFCDropdown from '@Components/Dropdown/IFCDropdown.vue';
import { IFCThemeProvider } from '@Components/ThemeProvider/IFCThemeProvider.vue';
import IFCInput from '@Components/Input/IFCInput.vue';
import { IFCForm } from '@Components/Form/IFCForm.vue';
/**
 * Next line disabled because this is not production code. this is development code.
 * So importing from devDeps is fine
 */
/* eslint-disable-next-line import/no-extraneous-dependencies */
import { action } from '@storybook/addon-actions';
import { STATE_MAP, VALID_STATES } from '@Components/Input/config';

export default {
  title: 'Presentational Components/Form Components/Dropdown',
  component: IFCDropdown,
  parameters: {
    jest: ['IFCDropdown.spec.js'],
    docs: {
      description: {
        component: `Searchable dropdown.
        <br/>
        **Note:** The floating label determines whether it needs to float based on focus and also the \`value\` prop.
        If you're experiencing weird issues where the label overlaps with the inputted content, you're probably
        forgetting to pass to this component what the value is. Remember, it's a presentational component, it does
        not do logic itself. If you give it no value, it will display as if there was no value.`,
      },
    },
  },
  argTypes: {
    dark: { control: { type: 'boolean', default: false } },
    state: { control: { type: 'select', options: VALID_STATES } },
    label: {
      description: 'Slot for inserting HTML content into the label',
    },
    option: {
      /**
       * Disabled because the description needs to be one line
       */
      /* eslint-disable-next-line max-len */
      description: 'Slot for configuring what options in the dropdown show. slotProps have `option` provided with the object',
    },
    selected: {
      description: 'Slot for configuring what selected options show. slotProps have `option` provided with the object',
    },
    // size: { control: { type: 'select', options: Object.keys(theme.button.sizing) } },
    // variant: { control: { type: 'select', options: Object.keys(theme.button.variants) } },
  },
};

const EXCLUDED_KEYS = ['dark', 'label', 'option'];

const CodeFactory = (args) => `
<IFCThemeProvider :dark="${args.dark}">
    <IFCDropdown 
    ${Object.entries(args).filter(
    ([key]) => !EXCLUDED_KEYS.includes(key),
  ).map(([key, value]) => `${`${typeof value !== 'string' ? ':' : ''}${key}`}=${
    Array.isArray(value) || typeof value === 'object' ? "'" : '"'
  }${
    Array.isArray(value) || typeof value === 'object' ? JSON.stringify(value) : value}${
    Array.isArray(value) || typeof value === 'object' ? "'" : '"'
  }\n`).join('   ')} >
      <template v-slot:label>
        ${args.label ?? '<!-- Content Here -->'}
      </template>
      <template v-slot:selected="{option}">
        ${args.selected ?? '<!-- Content Here -->'}
      </template>
      <template v-slot:option="{option}">
        ${args.option ?? '<!-- Content Here -->'}
      </template>
    </IFCDropdown>
  </IFCThemeProvider>
`;

const Template = (args, { argTypes }) => ({
  props: Object.keys(argTypes),
  components: { IFCDropdown, IFCThemeProvider },
  methods: {
    onInput: action('@input'),
  },
  template: `
  <IFCThemeProvider :dark="dark">
    <IFCDropdown @input="onInput" v-bind="$props" >
      <template #label>
        {{label}}
      </template>
      <template #option="{option}">
        {{option.text}}
      </template>
      <template #selected="{option}">
        {{option.text}}
      </template>
    </IFCDropdown>
  </IFCThemeProvider>
  `,
});

export const EmptyValueArray = Template.bind({});
EmptyValueArray.args = {
  value: [],
  label: 'Dropdown with options',
  option: '{{option.text}}',
  searchFn: (text, value) => value.text.toUpperCase().includes(text.toUpperCase()),
  optionSelectedFn: (obj, value) => value.map((v) => v.value).includes(obj.value),
  options: [
    {
      text: 'Value 1',
      value: 'value1',
    },
    {
      text: 'Value 2',
      value: 'value2',
    },
    {
      text: 'Value 3',
      value: 'value3',
    },
    {
      text: 'Value 4',
      value: 'value4',
    },
    {
      text: 'Value 5',
      value: 'value5',
    },
  ],
  name: 'SearchableDropdown',
  disabled: false,
  dark: false,
  autofocus: false,
  state: STATE_MAP.default,
};
EmptyValueArray.parameters = {
  docs: {
    source: {
      code: CodeFactory(EmptyValueArray.args),
    },
  },
};

export const ErrorState = Template.bind({});
ErrorState.args = {
  value: [],
  label: 'Dropdown with options',
  option: '{{option.text}}',
  searchFn: (text, value) => value.text.toUpperCase().includes(text.toUpperCase()),
  optionSelectedFn: (obj, value) => value.map((v) => v.value).includes(obj.value),
  options: [
    {
      text: 'Value 1',
      value: 'value1',
    },
    {
      text: 'Value 2',
      value: 'value2',
    },
    {
      text: 'Value 3',
      value: 'value3',
    },
    {
      text: 'Value 4',
      value: 'value4',
    },
    {
      text: 'Value 5',
      value: 'value5',
    },
  ],
  name: 'SearchableDropdown',
  disabled: false,
  dark: false,
  autofocus: false,
  state: STATE_MAP.error,
};
ErrorState.parameters = {
  docs: {
    source: {
      code: CodeFactory(ErrorState.args),
    },
  },
};

export const SuccessState = Template.bind({});
SuccessState.args = {
  value: [],
  label: 'Dropdown with options',
  option: '{{option.text}}',
  searchFn: (text, value) => value.text.toUpperCase().includes(text.toUpperCase()),
  optionSelectedFn: (obj, value) => value.map((v) => v.value).includes(obj.value),
  options: [
    {
      text: 'Value 1',
      value: 'value1',
    },
    {
      text: 'Value 2',
      value: 'value2',
    },
    {
      text: 'Value 3',
      value: 'value3',
    },
    {
      text: 'Value 4',
      value: 'value4',
    },
    {
      text: 'Value 5',
      value: 'value5',
    },
  ],
  name: 'SearchableDropdown',
  disabled: false,
  dark: false,
  autofocus: false,
  state: STATE_MAP.success,
};
SuccessState.parameters = {
  docs: {
    source: {
      code: CodeFactory(SuccessState.args),
    },
  },
};

export const EmptyOptionsArray = Template.bind({});
EmptyOptionsArray.args = {
  value: [],
  label: 'Dropdown with options',
  option: '{{option.text}}',
  searchFn: (text, value) => value.text.toUpperCase().includes(text.toUpperCase()),
  optionSelectedFn: (obj, value) => value.map((v) => v.value).includes(obj.value),
  options: [
  ],
  name: 'SearchableDropdown',
  disabled: false,
  dark: false,
  autofocus: false,
  state: STATE_MAP.default,
};
EmptyOptionsArray.parameters = {
  docs: {
    source: {
      code: CodeFactory(EmptyOptionsArray.args),
    },
  },
};

export const NonEmptyValueArray = Template.bind({});
NonEmptyValueArray.args = {
  value: [
    {
      text: 'Value 1',
      value: 'value1',
    },
  ],
  label: 'Dropdown with options',
  option: '{{option.text}}',
  searchFn: (text, value) => value.text.toUpperCase().includes(text.toUpperCase()),
  optionSelectedFn: (obj, value) => value.map((v) => v.value).includes(obj.value),
  options: [
    {
      text: 'Value 1',
      value: 'value1',
    },
    {
      text: 'Value 2',
      value: 'value2',
    },
    {
      text: 'Value 3',
      value: 'value3',
    },
    {
      text: 'Value 4',
      value: 'value4',
    },
    {
      text: 'Value 5',
      value: 'value5',
    },
  ],
  name: 'SearchableDropdown',
  disabled: false,
  dark: false,
  autofocus: false,
  state: STATE_MAP.default,
};
NonEmptyValueArray.parameters = {
  docs: {
    source: {
      code: CodeFactory(NonEmptyValueArray.args),
    },
  },
};

export const DarkMode = Template.bind({});
DarkMode.args = {
  value: [
    {
      text: 'Value 1',
      value: 'value1',
    },
  ],
  label: 'Dropdown with options',
  option: '{{option.text}}',
  searchFn: (text, value) => value.text.toUpperCase().includes(text.toUpperCase()),
  optionSelectedFn: (obj, value) => value.map((v) => v.value).includes(obj.value),
  options: [
    {
      text: 'Value 1',
      value: 'value1',
    },
    {
      text: 'Value 2',
      value: 'value2',
    },
    {
      text: 'Value 3',
      value: 'value3',
    },
    {
      text: 'Value 4',
      value: 'value4',
    },
    {
      text: 'Value 5',
      value: 'value5',
    },
  ],
  name: 'SearchableDropdown',
  disabled: false,
  dark: true,
  autofocus: false,
  state: STATE_MAP.default,
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

export const DisabledOptions = Template.bind({});
DisabledOptions.args = {
  value: [
    {
      text: 'Value 1',
      value: 'value1',
    },
  ],
  label: 'Dropdown with options',
  option: '{{option.text}}',
  searchFn: (text, value) => value.text.toUpperCase().includes(text.toUpperCase()),
  optionSelectedFn: (obj, value) => value.map((v) => v.value).includes(obj.value),
  optionDisabledFn: (obj) => obj.value === 'value2',
  options: [
    {
      text: 'Value 1',
      value: 'value1',
    },
    {
      text: 'Value 2',
      value: 'value2',
    },
    {
      text: 'Value 3',
      value: 'value3',
    },
    {
      text: 'Value 4',
      value: 'value4',
    },
    {
      text: 'Value 5',
      value: 'value5',
    },
  ],
  name: 'SearchableDropdown',
  disabled: false,
  dark: false,
  autofocus: false,
  state: STATE_MAP.default,
};
DisabledOptions.parameters = {
  docs: {
    source: {
      code: CodeFactory(DisabledOptions.args),
    },
  },
};

export const DisabledValues = Template.bind({});
DisabledValues.args = {
  value: [
    {
      text: 'Value 1',
      value: 'value1',
    },
    {
      text: 'Value 2',
      value: 'value2',
    },
    {
      text: 'Value 3',
      value: 'value3',
    },
  ],
  label: 'Dropdown with options',
  option: '{{option.text}}',
  searchFn: (text, value) => value.text.toUpperCase().includes(text.toUpperCase()),
  optionSelectedFn: (obj, value) => value.map((v) => v.value).includes(obj.value),
  valueDisabledFn: (obj) => obj.value === 'value2',
  options: [
    {
      text: 'Value 1',
      value: 'value1',
    },
    {
      text: 'Value 2',
      value: 'value2',
    },
    {
      text: 'Value 3',
      value: 'value3',
    },
    {
      text: 'Value 4',
      value: 'value4',
    },
    {
      text: 'Value 5',
      value: 'value5',
    },
  ],
  name: 'SearchableDropdown',
  disabled: false,
  dark: false,
  autofocus: false,
  state: STATE_MAP.default,
};
DisabledValues.parameters = {
  docs: {
    source: {
      code: CodeFactory(DisabledValues.args),
    },
  },
};

export const LargeValueArray = Template.bind({});
LargeValueArray.args = {
  value: [
    {
      text: 'Value 1',
      value: 'value1',
    },
    {
      text: 'Value 2',
      value: 'value2',
    },
    {
      text: 'Value 3',
      value: 'value3',
    },
    {
      text: 'Value 4',
      value: 'value4',
    },
    {
      text: 'Value 5',
      value: 'value5',
    },
    {
      text: 'Value 6',
      value: 'value6',
    },
    {
      text: 'Value 7',
      value: 'value7',
    },
    {
      text: 'Value 8',
      value: 'value8',
    },
    {
      text: 'Value 9',
      value: 'value9',
    },
    {
      text: 'Value 10',
      value: 'value10',
    },
  ],
  label: 'Dropdown with options',
  option: '{{option.text}}',
  searchFn: (text, value) => value.text.toUpperCase().includes(text.toUpperCase()),
  optionSelectedFn: (obj, value) => value.map((v) => v.value).includes(obj.value),
  options: [
    {
      text: 'Value 1',
      value: 'value1',
    },
    {
      text: 'Value 2',
      value: 'value2',
    },
    {
      text: 'Value 3',
      value: 'value3',
    },
    {
      text: 'Value 4',
      value: 'value4',
    },
    {
      text: 'Value 5',
      value: 'value5',
    },
    {
      text: 'Value 6',
      value: 'value6',
    },
    {
      text: 'Value 7',
      value: 'value7',
    },
    {
      text: 'Value 8',
      value: 'value8',
    },
    {
      text: 'Value 9',
      value: 'value9',
    },
    {
      text: 'Value 10',
      value: 'value10',
    },
    {
      text: 'Value 11',
      value: 'value11',
    },
    {
      text: 'Value 12',
      value: 'value12',
    },
    {
      text: 'Value 13',
      value: 'value13',
    },
    {
      text: 'Value 14',
      value: 'value14',
    },
    {
      text: 'Value 15',
      value: 'value15',
    },
  ],
  name: 'SearchableDropdown',
  disabled: false,
  dark: false,
  autofocus: false,
  state: STATE_MAP.default,
};
LargeValueArray.parameters = {
  docs: {
    source: {
      code: CodeFactory(LargeValueArray.args),
    },
  },
};

const EndOfPageTemplate = (args, { argTypes }) => ({
  props: Object.keys(argTypes),
  components: { IFCDropdown, IFCThemeProvider },
  methods: {
    onInput: action('@input'),
  },
  template: `
  <IFCThemeProvider>
    <div style="display: flex; flex-direction: column; justify-content: space-between; flex: 1; height: 100vh; ">
      <div></div>
      <IFCDropdown @input="onInput" v-bind="$props" >
        <template #label>
          {{label}}
        </template>
        <template #option="{option}">
          {{option.text}}
        </template>
        <template #selected="{option}">
          {{option.text}}
        </template>
      </IFCDropdown>
    </div>
  </IFCThemeProvider>
  `,
});

export const EndOfPage = EndOfPageTemplate.bind({});
EndOfPage.args = {
  value: [],
  label: 'Dropdown with options',
  option: '{{option.text}}',
  searchFn: (text, value) => value.text.toUpperCase().includes(text.toUpperCase()),
  optionSelectedFn: (obj, value) => value.map((v) => v.value).includes(obj.value),
  options: [
    {
      text: 'Value 1',
      value: 'value1',
    },
    {
      text: 'Value 2',
      value: 'value2',
    },
    {
      text: 'Value 3',
      value: 'value3',
    },
    {
      text: 'Value 4',
      value: 'value4',
    },
    {
      text: 'Value 5',
      value: 'value5',
    },
  ],
  name: 'SearchableDropdown',
  disabled: false,
  dark: false,
  autofocus: false,
  state: STATE_MAP.default,
};
EndOfPage.parameters = {
  docs: {
    source: {
      code: CodeFactory(EndOfPage.args),
    },
  },
};

const FormTemplate = (args, { argTypes }) => ({
  props: Object.keys(argTypes),
  components: {
    IFCDropdown, IFCThemeProvider, IFCInput, IFCForm,
  },
  methods: {
    onInput: action('@input'),
  },
  template: `
  <IFCThemeProvider>
    <IFCForm>
      <IFCInput
          type="text"
          name="textInput"
          state="default"
          value=""
        >
        <template v-slot:label>
          Text Input
        </template>
        <template v-slot:microcopy>
          <!-- Microcopy Content Here -->
        </template>
        <template v-slot:endcap>
            <!-- Endcap Content Here -->
        </template>
        <template v-slot:front-endcap>
            <!-- Front Endcap Content Here -->
        </template>
      </IFCInput>
      <IFCDropdown @input="onInput" v-bind="$props" >
        <template #label>
          {{label}}
        </template>
        <template #option="{option}">
          {{option.text}}
        </template>
        <template #selected="{option}">
          {{option.text}}
        </template>
      </IFCDropdown>
      <IFCDropdown @input="onInput" v-bind="$props" >
        <template #label>
          {{label}}
        </template>
        <template #option="{option}">
          {{option.text}}
        </template>
        <template #selected="{option}">
          {{option.text}}
        </template>
      </IFCDropdown>
        <IFCInput
          type="text"
          name="textInput"
          state="default"
          value=""
        >
        <template v-slot:label>
          Text Input
        </template>
        <template v-slot:microcopy>
          <!-- Microcopy Content Here -->
        </template>
        <template v-slot:endcap>
            <!-- Endcap Content Here -->
        </template>
        <template v-slot:front-endcap>
            <!-- Front Endcap Content Here -->
        </template>
      </IFCInput>
      <IFCDropdown @input="onInput" v-bind="$props" >
        <template #label>
          {{label}}
        </template>
        <template #option="{option}">
          {{option.text}}
        </template>
        <template #selected="{option}">
          {{option.text}}
        </template>
      </IFCDropdown>
        <IFCInput
          type="text"
          name="textInput"
          state="default"
          value=""
        >
        <template v-slot:label>
          Text Input
        </template>
        <template v-slot:microcopy>
          <!-- Microcopy Content Here -->
        </template>
        <template v-slot:endcap>
            <!-- Endcap Content Here -->
        </template>
        <template v-slot:front-endcap>
            <!-- Front Endcap Content Here -->
        </template>
      </IFCInput>
    </IFCForm>
  </IFCThemeProvider>
  `,
});

export const IntermixedInForm = FormTemplate.bind({});
IntermixedInForm.args = {
  value: [
    {
      text: 'Value 1',
      value: 'value1',
    },
  ],
  label: 'Dropdown with options',
  option: '{{option.text}}',
  searchFn: (text, value) => value.text.toUpperCase().includes(text.toUpperCase()),
  optionSelectedFn: (obj, value) => value.map((v) => v.value).includes(obj.value),
  options: [
    {
      text: 'Value 1',
      value: 'value1',
    },
    {
      text: 'Value 2',
      value: 'value2',
    },
    {
      text: 'Value 3',
      value: 'value3',
    },
    {
      text: 'Value 4',
      value: 'value4',
    },
    {
      text: 'Value 5',
      value: 'value5',
    },
  ],
  name: 'SearchableDropdown',
  disabled: false,
  dark: false,
  autofocus: false,
  state: STATE_MAP.default,
};
IntermixedInForm.parameters = {
  docs: {
    source: {
      code: CodeFactory(IntermixedInForm.args),
    },
  },
};
