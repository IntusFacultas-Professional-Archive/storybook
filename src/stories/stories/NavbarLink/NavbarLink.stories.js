import { IFCNavbarLink } from '@Components/Navbar/IFCNavbarLink.vue';
import { IFCThemeProvider } from '@Components/ThemeProvider/IFCThemeProvider.vue';

export default {
  title: 'Presentational Components/Navbars/Navbar Link',
  component: IFCNavbarLink,
  parameters: {
    jest: [],
  },
  argTypes: {
    href: {
      control: {
        type: 'text',
        value: '#',
      },
    },
  },
};

const EXCLUDED_KEYS = ['dark',
  'content',
];

const CodeFactory = (args) => `
  <IFCThemeProvider :dark="${args.dark ?? false}">
    <IFCNavbarLink
    ${Object.entries(args).filter(
    ([key]) => !EXCLUDED_KEYS.includes(key),
  ).map(([key, value]) => `${`${typeof value !== 'string' ? ':' : ''}${key}`}="${value}"\n`).join('   ')}  >
        ${args.content ?? '<!-- Content Here -->'}
    </IFCNavbarLink>
  </IFCThemeProvider>
`;

const Template = (args, { argTypes }) => ({
  props: Object.keys(argTypes),
  components: { IFCNavbarLink, IFCThemeProvider },
  template: `
    <IFCThemeProvider>
      <IFCNavbarLink v-bind="$props" >
        <template v-slot:title>
          ${args.title ?? ''}
        </template>
        ${args.content ?? '<!-- Content Here -->'}
      </IFCNavbarLink>
    </IFCThemeProvider>
  `,
});

export const NavbarLink = Template.bind({});
NavbarLink.args = {
  color: 'black',
  content: 'Some Text Here',
};
NavbarLink.parameters = {
  docs: {
    source: {
      code: CodeFactory(NavbarLink.args),
    },
  },
};
