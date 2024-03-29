import IFCCard from '@Components/Card/IFCCard.vue';
import { IFCThemeProvider } from '@Components/ThemeProvider/IFCThemeProvider.vue';
import { IFCButton } from '@Components/Button/IFCButton.vue';
import { IFCH3 } from '@Components/Text/IFCH3.vue';

export default {
  title: 'Presentational Components/Layout/Card',
  component: IFCCard,
  parameters: {
    jest: ['IFCCard.spec.js'],
    backgrounds: {},
    docs: {
      description: {
        component: 'A component for displaying content in a card',
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
    title: {
      /**
       * Disabled because the description needs to be one line
       */
      /* eslint-disable-next-line max-len */
      description: 'Slot for inserting HTML as the title of the card.',
    },
    image: {
      /**
       * Disabled because the description needs to be one line
       */
      /* eslint-disable-next-line max-len */
      description: 'Slot for inserting an img for the card.',
    },
    body: {
      /**
       * Disabled because the description needs to be one line
       */
      /* eslint-disable-next-line max-len */
      description: 'Slot for configuring what the body of the card contains.',
    },
    buttons: {
      /**
       * Disabled because the description needs to be one line
       */
      /* eslint-disable-next-line max-len */
      description: 'Slot for configuring what the buttons of the card are.',
    },
  },
};

const EXCLUDED_KEYS = ['dark', 'title'];

const CodeFactory = (args) => `
  <IFCThemeProvider :dark="${args.dark ?? false}">
    <IFCCard
    ${Object.entries(args)
    .filter(([key]) => !EXCLUDED_KEYS.includes(key))
    .map(
      ([key, value]) => `${`${typeof value !== 'string' ? ':' : ''}${key}`}="${value}"\n`,
    )
    .join('   ')}>
      <template v-slot:title>
        ${args.title ?? '<!-- Title Content Here -->'}
      </template>
      <template v-slot:image>
        ${args.image ?? '<!-- <img> goes here -->'}
      </template>
      <template v-slot:body>
        ${args.body ?? '<!-- Body Content Here -->'}
      </template>
      <template v-slot:buttons>
        ${args.buttons ?? '<!-- Buttons go here -->'}
      </template>
    </IFCCard>
  </IFCThemeProvider>
`;

const Template = (args, { argTypes }) => ({
  props: Object.keys(argTypes),
  components: {
    IFCCard,
    IFCThemeProvider,
    IFCH3,
    IFCButton,
  },
  template: `
    <IFCThemeProvider :dark="dark">
      <IFCCard

        v-bind="$props">
        <template #title>
          ${args.title ?? ''}
        </template>
        <template #image>
          ${args.image ?? ''}
        </template>
        <template #body>
          ${args.body ?? ''}
        </template>
        <template #buttons>
          ${args.buttons ?? ''}
        </template>
      </IFCCard>
    </IFCThemeProvider>
  `,
});

export const AutogeneratedContent = Template.bind({});
AutogeneratedContent.args = {
  system: {
    identifier: 'Some Identifier',
    snake_case_key: 'Some value',
    camelCaseKey: 'Some other value',
    'Title Case Key': 'Some third value',
  },
};
AutogeneratedContent.parameters = {
  docs: {
    source: {
      code: CodeFactory(AutogeneratedContent.args),
    },
  },
};

export const ContainsButtons = Template.bind({});
ContainsButtons.args = {
  body: '<IFCH3>Content!</IFCH3>',
  containsButtons: true,
  buttons: `
    <IFCButton variant="primary" block>Button Slot here</IFCButton>
  `,
};
ContainsButtons.parameters = {
  docs: {
    source: {
      code: CodeFactory(ContainsButtons.args),
    },
  },
};

export const DarkMode = Template.bind({});
DarkMode.args = {
  dark: true,
  body: '<IFCH3>Content!</IFCH3>',
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

export const CardWithImage = Template.bind({});
CardWithImage.args = {
  image: '<img src="https://picsum.photos/200" />',
  title: '<IFCH3 style="margin: 0; margin-bottom: .25em;">Card Title</IFCH3>',
};
CardWithImage.parameters = {
  docs: {
    source: {
      code: CodeFactory(CardWithImage.args),
    },
  },
};
