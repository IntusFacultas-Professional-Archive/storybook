import { IFCMultiStageLoader } from '@Components/MultiStageLoader/IFCMultiStageLoader.vue';
import { IFCButton } from '@Components/Button/IFCButton.vue';
import { IFCThemeProvider } from '@Components/ThemeProvider/IFCThemeProvider.vue';
/**
 * Next line disabled because this is not production code. this is development code.
 * So importing from devDeps is fine
 */
/* eslint-disable-next-line import/no-extraneous-dependencies */
import { propGenerator } from '../../mixinPropGenerator.js';

export default {
  title: 'Presentational Components/Multi Stage Loader',
  component: IFCMultiStageLoader,
  parameters: {
    jest: ['IFCMultiStageLoader.spec.js'],
    docs: {
      description: {
        component: 'Multi Stage Loading Animation.',
      },
    },
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

const EXCLUDED_KEYS = ['dark'];

const CodeFactory = (args) => `
<IFCThemeProvider :dark="${args.dark ?? false}">
    <IFCMultiStageLoader 
    ${Object.entries(args).filter(
    ([key]) => !EXCLUDED_KEYS.includes(key),
  ).map(([key, value]) => `${`${typeof value !== 'string' ? ':' : ''}${key}`}=${
    Array.isArray(value) || typeof value === 'object' ? "'" : '"'
  }${
    Array.isArray(value) || typeof value === 'object' ? JSON.stringify(value) : value}${
    Array.isArray(value) || typeof value === 'object' ? "'" : '"'
  }\n`).join('   ')} />
  </IFCThemeProvider>
`;

const Template = (args, { argTypes }) => ({
  props: Object.keys(argTypes),
  components: { IFCMultiStageLoader, IFCThemeProvider, IFCButton },
  data() {
    return {
      internalStages: [],
      lastCompleted: -1,
    };
  },
  watch: {
    stages() {
      this.updateInternalStages();
    },
  },
  mounted() {
    this.updateInternalStages();
  },
  methods: {
    updateInternalStages() {
      this.internalStages = this.stages.slice();
    },
  },
  template: `
    <IFCThemeProvider>
      <IFCMultiStageLoader v-bind="$props" :stage="internalStages" />
      <IFCButton 
        v-for="(stage, index) in internalStages"
        :key="stage.title"
        @click="stage.complete = true; lastCompleted = index"
        variant="transparent"
        :disabled="stage.complete || lastCompleted < index - 1">
        Complete {{stage.title}}
      </IFCButton>
    </IFCThemeProvider>
  `,
});

export const OneStage = Template.bind({});
OneStage.args = {
  stages: [
    {
      color: '#0015ff',
      title: 'Stage',
      complete: false,
    },
  ],
};
OneStage.parameters = {
  docs: {
    source: {
      code: CodeFactory(OneStage.args),
    },
  },
};

export const LongTitle = Template.bind({});
LongTitle.args = {
  stages: [
    {
      color: '#0015ff',
      title: 'Stage With a Really Long Title Whatchu gonna do?',
      complete: false,
    },
  ],
};
LongTitle.parameters = {
  docs: {
    source: {
      code: CodeFactory(LongTitle.args),
    },
  },
};

export const MultipleStages = Template.bind({});
MultipleStages.args = {
  stages: [
    {
      color: '#0015ff',
      title: 'Stage',
      complete: false,
    },
    {
      color: '#0015ff',
      title: 'Stage 2',
      complete: false,
    },
  ],
};
MultipleStages.parameters = {
  docs: {
    source: {
      code: CodeFactory(MultipleStages.args),
    },
  },
};

export const ManyStages = Template.bind({});
ManyStages.args = {
  stages: [
    {
      color: '#0015ff',
      title: 'Stage',
      complete: false,
    },
    {
      color: '#0015ff',
      title: 'Stage 2',
      complete: false,
    },
    {
      color: '#00c96b',
      title: 'Stage 3',
      complete: false,
    },
    {
      color: '#fcba03',
      title: 'Stage 4',
      complete: false,
    },
  ],
};
ManyStages.parameters = {
  docs: {
    source: {
      code: CodeFactory(ManyStages.args),
    },
  },
};

export const DefaultColors = Template.bind({});
DefaultColors.args = {
  stages: [
    {
      title: 'Stage',
      complete: false,
    },
    {
      title: 'Stage 2',
      complete: false,
    },
    {
      title: 'Stage 3',
      complete: false,
    },
    {
      title: 'Stage 4',
      complete: false,
    },
    {
      title: 'Stage 5',
      complete: false,
    },
    {
      title: 'Stage 6',
      complete: false,
    },
    {
      title: 'Stage 7',
      complete: false,
    },
    {
      title: 'Stage 8',
      complete: false,
    },
  ],
};
DefaultColors.parameters = {
  docs: {
    source: {
      code: CodeFactory(DefaultColors.args),
    },
  },
};
