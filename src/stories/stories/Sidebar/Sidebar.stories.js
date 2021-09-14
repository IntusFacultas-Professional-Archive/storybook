import { IFCSidebar } from '@Components/Sidebar/IFCSidebar.vue';
import { IFCThemeProvider } from '@Components/ThemeProvider/IFCThemeProvider.vue';
import { IFCButton } from '@Components/Button/IFCButton.vue';
import { IFCH1 } from '@Components/Text/IFCH1.vue';
import { propGenerator } from '../../mixinPropGenerator.js';

export default {
  title: 'Presentational Components/Layout/Sidebar',
  component: IFCSidebar,
  parameters: {
    jest: ['IFCSidebar.spec.js'],
  },
  argTypes: {
    ...propGenerator(IFCSidebar, {
      breakpoint: 'The breakpoint in pixels when the element should change to a collapsed toggleable element',
      collapseOverride: 'Whether to force the element to always be collapsed regardless of breakpoint state.',
    }),
    sidebar: {
      description: 'A slot for inserting HTML content in the sidebar',
    },
    main: {
      description: 'A slot for inserting HTML content in the main content next to the sidebar',
    },
  },
};

const EXCLUDED_KEYS = ['dark',
  'sidebar',
  'main',
];

const CodeFactory = (args) => `
  <IFCThemeProvider :dark="${args.dark ?? false}">
    <IFCSidebar
    ${Object.entries(args).filter(
    ([key]) => !EXCLUDED_KEYS.includes(key),
  ).map(([key, value]) => `${`${typeof value !== 'string' ? ':' : ''}${key}`}="${value}"\n`).join('   ')}  >
      <template v-slot:sidebar>
        ${args.sidebar ?? '<!-- Content Here -->'}
      </template>
      ${args.main ?? '<!-- Content Here -->'}
    </IFCSidebar>
  </IFCThemeProvider>
`;

const Template = (args, { argTypes }) => ({
  props: Object.keys(argTypes),
  components: {
    IFCSidebar, IFCThemeProvider, IFCButton, IFCH1,
  },
  template: `
  <IFCThemeProvider style="margin: -1em">
    <IFCSidebar v-bind="$props" >
      <template v-slot:sidebar>
        ${args.sidebar ?? '<!-- Content Here -->'}
      </template>
      ${args.main ?? '<!-- Content Here -->'}
    </IFCSidebar>
  </IFCThemeProvider>
  `,
});

export const Uncollapsed = Template.bind({});
Uncollapsed.args = {
  breakpoint: 0,
  width: 200,
  background: '#065C7D',
  sidebar: `
    <IFCH1 color="white">Sidebar Content goes here</IFCH1>
  `,
  main: `
    <IFCH1>Main Content goes here</IFCH1>
  `,
};
Uncollapsed.parameters = {
  docs: {
    source: {
      code: CodeFactory(Uncollapsed.args),
    },
  },
};

export const Collapsed = Template.bind({});
Collapsed.args = {
  breakpoint: 0,
  collapseOverride: true,
  width: 200,
  background: '#065C7D',
  sidebar: `
    <IFCH1 color="white">Sidebar Content goes here</IFCH1>
  `,
  main: `
    <IFCH1>Main Content goes here</IFCH1>
    <IFCButton variant="primary">This is not focusable on expand</IFCButton>
  `,
};
Collapsed.parameters = {
  docs: {
    source: {
      code: CodeFactory(Collapsed.args),
    },
  },
};
export const CollapsedWithFocusableContent = Template.bind({});
CollapsedWithFocusableContent.args = {
  breakpoint: 0,
  collapseOverride: true,
  width: 200,
  background: '#065C7D',
  sidebar: `
    <IFCH1 color="white">Sidebar Content goes here</IFCH1>
    <IFCButton variant="transparent" style="color: white">This should focus on expand</IFCButton>
  `,
  main: `
    <IFCH1>Main Content goes here</IFCH1>
    <IFCButton variant="primary">This should not focus on expand</IFCButton>
  `,
};
CollapsedWithFocusableContent.parameters = {
  docs: {
    source: {
      code: CodeFactory(CollapsedWithFocusableContent.args),
    },
  },
};
export const LotsOfContentInMain = Template.bind({});
LotsOfContentInMain.args = {
  breakpoint: 0,
  collapseOverride: true,
  width: 200,
  background: '#065C7D',
  sidebar: `
    <IFCH1 color="white">Sidebar Content goes here</IFCH1>
  `,
  main: `
    <IFCH1 style="height: 200vh">This element is **really** tall</IFCH1>
  `,
};
LotsOfContentInMain.parameters = {
  docs: {
    source: {
      code: CodeFactory(LotsOfContentInMain.args),
    },
  },
};
