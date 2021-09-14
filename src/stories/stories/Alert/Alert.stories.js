import { IFCButton } from '@Components/Button/IFCButton.vue';
import { IFCAlert } from '@Components/Alert/IFCAlert.vue';
import { IFCAlertPlugin } from '@Components/Alert/IFCAlertPlugin.js';
import Vue from 'vue';
import { IFCThemeProvider } from '@Components/ThemeProvider/IFCThemeProvider.vue';
/**
 * Next line disabled because this is not production code. this is development code.
 * So importing from devDeps is fine
 */
/* eslint-disable-next-line import/no-extraneous-dependencies */
import { action } from '@storybook/addon-actions';

Vue.use(IFCAlertPlugin);
export default {
  title: 'Presentational Components/Alert',
  component: IFCAlert,
  parameters: {
    jest: ['IFCAlert.spec.js'],
  },
  argTypes: {
  },
};
const EXCLUDED_KEYS = ['alertTemplate', 'dark'];
const CodeFactory = (args) => `
  <IFCThemeProvider :dark="${args.dark ?? false}">
    <IFCAlert
    ${Object.entries(args).filter(
    ([key]) => !EXCLUDED_KEYS.includes(key),
  ).map(([key, value]) => `${`${typeof value !== 'string' ? ':' : ''}${key}`}="${value}"\n`).join('   ')}  />
  </IFCThemeProvider>
`;

const Template = (args, { argTypes }) => ({
  props: Object.keys(argTypes),
  components: { IFCButton, IFCThemeProvider, IFCAlert },
  methods: {
    onClick: action('@click'),
    createAlert() {
      this.$IFCAlert(this.alertTemplate);
    },
  },
  template: `
  <IFCThemeProvider :dark="dark ?? false">
    <IFCButton @click="createAlert" variant="primary">Trigger Alert</IFCButton>
    <IFCAlert v-bind="$props" />
  </IFCThemeProvider>
  `,
});

export const BasicAlert = Template.bind({});
BasicAlert.args = {
  dark: false,
  alertTemplate: {
    title: 'Alert Title',
    content: 'Alert content',
  },
};
BasicAlert.parameters = {
  docs: {
    source: {
      code: CodeFactory(BasicAlert.args),
    },
  },
};

export const Success = Template.bind({});
Success.args = {
  dark: false,
  alertTemplate: {
    title: 'Alert Title',
    content: 'Alert content',
    variant: 'success',
  },
};
Success.parameters = {
  docs: {
    source: {
      code: CodeFactory(Success.args),
    },
  },
};

export const Danger = Template.bind({});
Danger.args = {
  dark: false,
  alertTemplate: {
    title: 'Alert Title',
    content: 'Alert content',
    variant: 'danger',
  },
};
Danger.parameters = {
  docs: {
    source: {
      code: CodeFactory(Danger.args),
    },
  },
};

export const Info = Template.bind({});
Info.args = {
  dark: false,
  alertTemplate: {
    title: 'Alert Title',
    content: 'Alert content',
    variant: 'info',
  },
};
Info.parameters = {
  docs: {
    source: {
      code: CodeFactory(Info.args),
    },
  },
};

export const Warning = Template.bind({});
Warning.args = {
  dark: false,
  alertTemplate: {
    title: 'Alert Title',
    content: 'Alert content',
    variant: 'warning',
  },
};
Warning.parameters = {
  docs: {
    source: {
      code: CodeFactory(Warning.args),
    },
  },
};

export const Autoclose = Template.bind({});
Autoclose.args = {
  dark: false,
  alertTemplate: {
    title: 'Alert Title',
    content: 'Alert content',
    autoclose: 15000,
  },
};
Autoclose.parameters = {
  docs: {
    source: {
      code: CodeFactory(Autoclose.args),
    },
  },
};

export const HTMLPassedIn = Template.bind({});
HTMLPassedIn.args = {
  dark: false,
  alertTemplate: {
    title: 'Alert Title',
    html: '<div style="height: 100px; width: 100px; background-color: red"></div>',
  },
};
HTMLPassedIn.parameters = {
  docs: {
    source: {
      code: CodeFactory(HTMLPassedIn.args),
    },
  },
};

export const DarkMode = Template.bind({});
DarkMode.args = {
  dark: true,
  alertTemplate: {
    title: 'Alert Title',
    content: 'Alert content',
  },
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

export const NotBackgroundDismissable = Template.bind({});
NotBackgroundDismissable.args = {
  dark: false,
  alertTemplate: {
    title: 'Alert Title',
    backgroundDismiss: false,
    content: 'Alert content',
  },
};
NotBackgroundDismissable.parameters = {
  docs: {
    source: {
      code: CodeFactory(NotBackgroundDismissable.args),
    },
  },
};

const NestedTemplate = (args, { argTypes }) => ({
  props: Object.keys(argTypes),
  components: { IFCButton, IFCThemeProvider, IFCAlert },
  methods: {
    onClick: action('@click'),
    createAlert() {
      this.$IFCAlert({
        id: 'firstId',
        title: 'Canceled by $IFCAlertCancel',
        backgroundDismiss: false,
        content: 'The next alert will cancel me',
        buttons: [
          {
            variant: 'primary',
            content: 'Make Next Alert',
            action: () => {
              this.$IFCAlert({
                title: 'Cancels the last one too',
                backgroundDismiss: false,
                content: 'I call $IFCAlertCancel on Close All',
                buttons: [
                  {
                    variant: 'primary',
                    content: 'Close All',
                    action: () => {
                      this.$IFCAlertCancel('firstId');
                    },
                  },
                ],
              });
              return 1;
            },
          },
        ],
      });
    },
  },
  template: `
  <IFCThemeProvider :dark="dark ?? false">
    <IFCButton @click="createAlert" variant="primary">Trigger Alert</IFCButton>
    <IFCAlert v-bind="$props" />
  </IFCThemeProvider>
  `,
});

export const DismissedByFollowingAlert = NestedTemplate.bind({});
DismissedByFollowingAlert.args = {
  dark: false,
};
DismissedByFollowingAlert.parameters = {
  docs: {
    source: {
      code: CodeFactory(DismissedByFollowingAlert.args),
    },
  },
};

export const CustomButton = Template.bind({});
CustomButton.args = {
  dark: false,
  alertTemplate: {
    title: 'Alert Title',
    backgroundDismiss: false,
    content: 'Alert content',
    buttons: [
      {
        variant: 'primary',
        content: 'HTML Content',
        action() {
          /**
           * Disabled because we just want a low effort way to demonstrate callback.
           */
          /* eslint-disable-next-line no-alert */
          alert('Callback!');
        },
      },
    ],
  },
};
CustomButton.parameters = {
  docs: {
    source: {
      code: CodeFactory(CustomButton.args),
    },
  },
};

export const FormElements = Template.bind({});
FormElements.args = {
  dark: false,
  alertTemplate: {
    title: 'Alert Title',
    backgroundDismiss: false,
    content: 'Alert content',
    fields: [
      {
        type: 'text',
        label: 'Text Input',
        value: 'Initial Value',
        name: 'textValue',
      },
      {
        type: 'number',
        label: 'Number Input',
        value: 1,
        name: 'numberValue',
      },
    ],
    buttons: [
      {
        variant: 'primary',
        content: 'HTML Content',
        action(data) {
          /**
           * Disabled because we just want a low effort way to demonstrate callback.
           */
          /* eslint-disable-next-line no-alert */
          alert(JSON.stringify(data, null, 2));
        },
      },
    ],
  },
};
FormElements.parameters = {
  docs: {
    source: {
      code: CodeFactory(FormElements.args),
    },
  },
};

const RegressionTemplate = (args, { argTypes }) => ({
  props: Object.keys(argTypes),
  components: { IFCButton, IFCThemeProvider, IFCAlert },
  methods: {
    onClick: action('@click'),
    createAlert() {
      this.$IFCAlert({
        id: 'firstId',
        title: 'I should focus first field',
        backgroundDismiss: false,
        content: 'Next alert should then capture focus and return focus when done',
        fields: [
          {
            type: 'text',
            label: 'Text Input',
            value: 'Initial Value',
            name: 'textValue',
          },
          {
            type: 'number',
            label: 'Number Input',
            value: 1,
            name: 'numberValue',
          },
        ],
        buttons: [
          {
            variant: 'primary',
            content: 'Make Next Alert',
            action: () => {
              this.$IFCAlert({
                title: 'I should now have focus capture',
                content: 'Underlying alert should now be unreachable',
                fields: [
                  {
                    type: 'text',
                    label: 'Text Input',
                    value: 'Initial Value',
                    name: 'textValue',
                  },
                  {
                    type: 'number',
                    label: 'Number Input',
                    value: 1,
                    name: 'numberValue',
                  },
                ],
                backgroundDismiss: false,
                buttons: [
                  {
                    variant: 'primary',
                    content: 'Close',
                    action: () => {
                    },
                  },
                ],
              });
              return 1;
            },
          },
          {
            variant: 'danger',
            content: 'Close Me',
          },
        ],
      });
    },
  },
  template: `
  <IFCThemeProvider :dark="dark ?? false">
    <IFCButton @click="createAlert" variant="primary">Trigger Alert</IFCButton>
    <IFCAlert v-bind="$props" />
  </IFCThemeProvider>
  `,
});

export const NestedAlertFocusCaptureRegressionTest = RegressionTemplate.bind({});
NestedAlertFocusCaptureRegressionTest.args = {
  dark: false,
};
NestedAlertFocusCaptureRegressionTest.parameters = {
  docs: {
    source: {
      code: CodeFactory(NestedAlertFocusCaptureRegressionTest.args),
    },
  },
};
