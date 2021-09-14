import { IFCNavbar } from '@Components/Navbar/IFCNavbar.vue';
import { IFCNavbarLink } from '@Components/Navbar/IFCNavbarLink.vue';
import { IFCThemeProvider } from '@Components/ThemeProvider/IFCThemeProvider.vue';
import { propGenerator } from '@App/stories/mixinPropGenerator';
import { IFCH1 } from '@Components/Text/IFCH1.vue';

export default {
  title: 'Presentational Components/Navbars/Navbar',
  component: IFCNavbar,
  parameters: {
    jest: ['IFCNavbar.spec.js'],
  },
  argTypes: {
    ...propGenerator(IFCNavbar, {
      breakpoint: 'The breakpoint in pixels when the element should change to a collapsed toggleable element',
    }),
    title: {
      description: 'A slot for inserting HTML content into the title',
    },
    left: {
      description: 'A slot for inserting HTML content adjacent to the title',
    },
    middle: {
      description: 'A slot for inserting HTML content between the left and right slots',
    },
    right: {
      description: 'A slot for inserting HTML content right aligned',
    },
  },
};

const EXCLUDED_KEYS = ['dark',
  'title',
  'left',
  'middle',
  'right',
];

const CodeFactory = (args) => `
  <IFCThemeProvider :dark="${args.dark ?? false}">
    <IFCNavbar
    ${Object.entries(args).filter(
    ([key]) => !EXCLUDED_KEYS.includes(key),
  ).map(([key, value]) => `${`${typeof value !== 'string' ? ':' : ''}${key}`}="${value}"\n`).join('   ')}  >
      <template v-slot:title>
        ${args.title ?? '<!-- Content Here -->'}
      </template>
      <template v-slot:left>
        ${args.left ?? '<!-- Content Here -->'}
      </template>
      <template v-slot:middle>
        ${args.middle ?? '<!-- Content Here -->'}
      </template>
      <template v-slot:right>
        ${args.right ?? '<!-- Content Here -->'}
      </template>
    </IFCNavbar>
  </IFCThemeProvider>
`;

const Template = (args, { argTypes }) => ({
  props: Object.keys(argTypes),
  components: {
    IFCNavbar, IFCThemeProvider, IFCNavbarLink, IFCH1,
  },
  template: `
  <IFCThemeProvider style="margin: -1em">
    <IFCNavbar v-bind="$props" >
      <template v-slot:title>
        ${args.title ?? '<!-- Content Here -->'}
      </template>
      <template v-slot:left>
        ${args.left ?? '<!-- Content Here -->'}
      </template>
      <template v-slot:middle>
        ${args.middle ?? '<!-- Content Here -->'}
      </template>
      <template v-slot:right>
        ${args.right ?? '<!-- Content Here -->'}
      </template>
    </IFCNavbar>
  </IFCThemeProvider>
  `,
});

export const Uncollapsed = Template.bind({});
Uncollapsed.args = {
  breakpoint: 0,
  background: '#065C7D',
  title: `
    <IFCH1 color="white" marginless>
      Some Header or another
    </IFCH1>
  `,
  left: `
    <IFCNavbarLink color="white" href="#">
      Left Link 1
    </IFCNavbarLink>
    <IFCNavbarLink color="white" href="#">
      Left Link 2
    </IFCNavbarLink>
  `,
  middle: `
    <IFCNavbarLink color="white" href="#">
      Middle Link 1
    </IFCNavbarLink>
    <IFCNavbarLink color="white" href="#">
      Middle Link 2
    </IFCNavbarLink>
  `,
  right: `
    <IFCNavbarLink color="white" href="#">
      Right Link 1
    </IFCNavbarLink>
    <IFCNavbarLink color="white" href="#">
      Right Link 2
    </IFCNavbarLink>
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
  breakpoint: 100000000000,
  background: '#065C7D',
  title: `
    <IFCH1 color="white" marginless>
      Some Header or another
    </IFCH1>
  `,
  left: `
    <IFCNavbarLink color="white" href="#">
      Left Link 1
    </IFCNavbarLink>
    <IFCNavbarLink color="white" href="#">
      Left Link 2
    </IFCNavbarLink>
  `,
  middle: `
    <IFCNavbarLink color="white" href="#">
      Middle Link 1
    </IFCNavbarLink>
    <IFCNavbarLink color="white" href="#">
      Middle Link 2
    </IFCNavbarLink>
  `,
  right: `
    <IFCNavbarLink color="white" href="#">
      Right Link 1
    </IFCNavbarLink>
    <IFCNavbarLink color="white" href="#">
      Right Link 2
    </IFCNavbarLink>
  `,
};
Collapsed.parameters = {
  docs: {
    source: {
      code: CodeFactory(Collapsed.args),
    },
  },
};

export const LotsOfLinks = Template.bind({});
LotsOfLinks.args = {
  breakpoint: 100000000000,
  background: '#065C7D',
  title: `
    <IFCH1 color="white" marginless>
      Some Header or another
    </IFCH1>
  `,
  left: `
    <IFCNavbarLink color="white" href="#">
      Left Link 1
    </IFCNavbarLink>
    <IFCNavbarLink color="white" href="#">
      Left Link 2
    </IFCNavbarLink>
    <IFCNavbarLink color="white" href="#">
      Left Link 1
    </IFCNavbarLink>
    <IFCNavbarLink color="white" href="#">
      Left Link 2
    </IFCNavbarLink>
    <IFCNavbarLink color="white" href="#">
      Left Link 1
    </IFCNavbarLink>
    <IFCNavbarLink color="white" href="#">
      Left Link 2
    </IFCNavbarLink>
    <IFCNavbarLink color="white" href="#">
      Left Link 1
    </IFCNavbarLink>
    <IFCNavbarLink color="white" href="#">
      Left Link 2
    </IFCNavbarLink>
    <IFCNavbarLink color="white" href="#">
      Left Link 1
    </IFCNavbarLink>
    <IFCNavbarLink color="white" href="#">
      Left Link 2
    </IFCNavbarLink>
    <IFCNavbarLink color="white" href="#">
      Left Link 1
    </IFCNavbarLink>
    <IFCNavbarLink color="white" href="#">
      Left Link 2
    </IFCNavbarLink>
    <IFCNavbarLink color="white" href="#">
      Left Link 1
    </IFCNavbarLink>
    <IFCNavbarLink color="white" href="#">
      Left Link 2
    </IFCNavbarLink>
    <IFCNavbarLink color="white" href="#">
      Left Link 1
    </IFCNavbarLink>
    <IFCNavbarLink color="white" href="#">
      Left Link 2
    </IFCNavbarLink>
    <IFCNavbarLink color="white" href="#">
      Left Link 1
    </IFCNavbarLink>
    <IFCNavbarLink color="white" href="#">
      Left Link 2
    </IFCNavbarLink>
    <IFCNavbarLink color="white" href="#">
      Left Link 1
    </IFCNavbarLink>
    <IFCNavbarLink color="white" href="#">
      Left Link 2
    </IFCNavbarLink>
    <IFCNavbarLink color="white" href="#">
      Left Link 1
    </IFCNavbarLink>
    <IFCNavbarLink color="white" href="#">
      Left Link 2
    </IFCNavbarLink>
    <IFCNavbarLink color="white" href="#">
      Left Link 1
    </IFCNavbarLink>
    <IFCNavbarLink color="white" href="#">
      Left Link 2
    </IFCNavbarLink>
    <IFCNavbarLink color="white" href="#">
      Left Link 1
    </IFCNavbarLink>
    <IFCNavbarLink color="white" href="#">
      Left Link 2
    </IFCNavbarLink>
    <IFCNavbarLink color="white" href="#">
      Left Link 1
    </IFCNavbarLink>
    <IFCNavbarLink color="white" href="#">
      Left Link 2
    </IFCNavbarLink>
  `,
  middle: `
    <IFCNavbarLink color="white" href="#">
      Middle Link 1
    </IFCNavbarLink>
    <IFCNavbarLink color="white" href="#">
      Middle Link 2
    </IFCNavbarLink>
  `,
  right: `
    <IFCNavbarLink color="white" href="#">
      Right Link 1
    </IFCNavbarLink>
    <IFCNavbarLink color="white" href="#">
      Right Link 2
    </IFCNavbarLink>
  `,
};
LotsOfLinks.parameters = {
  docs: {
    source: {
      code: CodeFactory(LotsOfLinks.args),
    },
  },
};
