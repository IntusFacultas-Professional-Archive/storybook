import IFCTableCell from '@Components/Table/TableCell/IFCTableCell.vue';
import { IFCThemeProvider } from '@Components/ThemeProvider/IFCThemeProvider.vue';

/**
 * Next line disabled because this is not production code. this is development code.
 * So importing from devDeps is fine
 */
/* eslint-disable-next-line import/no-extraneous-dependencies */
import { action } from '@storybook/addon-actions';
import { propGenerator } from '../../mixinPropGenerator.js';

export default {
  title: 'Presentational Components/Table/Table Cell',
  component: IFCTableCell,
  parameters: {
    jest: ['TableCell.spec.js'],
    backgrounds: {
    },
    docs: {
      description: {
        component: 'Configurable Data Table TD cell',
      },
    },
  },
  argTypes: {
    ...propGenerator(IFCTableCell, {}),
    dark: {
      control: {
        type: 'boolean',
        default: false,
      },
    },
    variant: {
      control: {
        type: 'select',
        options: [
          'default',
          'success',
          'danger',
          'info',
        ],
      },
    },
    sizing: {
      control: {
        type: 'select',
        options: [
          'condensed',
          'regular',
          'relaxed',
        ],
      },
    },
    'external-content': {
      description: `Slot for inserting HTML outside the div wrapper (useful if you want content 
        that spills outside the cell)`,
    },
    default: {
      description: 'Slot for inserting HTML into the cell.',
    },
  },
};
const EXCLUDED_KEYS = ['dark', 'default'];

const CodeFactory = (args) => `
  <IFCThemeProvider :dark="${args.dark ?? false}">
    <IFCTableCell
    ${Object.entries(args).filter(
    ([key]) => !EXCLUDED_KEYS.includes(key),
  ).map(([key, value]) => `${`${typeof value !== 'string' ? ':' : ''}${key}`}="${value}"\n`).join('   ')}>
      ${args.default}
    </IFCTableCell>
  </IFCThemeProvider>
`;

const Template = (args, { argTypes }) => ({
  props: Object.keys(argTypes),
  components: { IFCTableCell, IFCThemeProvider },
  methods: {
    onHover: action('@hover'),
    onClick: action('@click'),
    onPin: action('@pin'),
  },
  template: `
    <IFCThemeProvider :dark="dark">
      <IFCTableCell
        @hover="onHover"
        @click="onClick"
        @pin="onPin"
        v-bind="$props">
        ${args.default}
      </IFCTableCell>
    </IFCThemeProvider>
  `,
});

export const CellDefaultState = Template.bind({});
CellDefaultState.args = {
  default: 'HTML content can go here.',
};
CellDefaultState.parameters = {
  docs: {
    source: {
      code: CodeFactory(CellDefaultState.args),
    },
  },
};

export const DarkMode = Template.bind({});
DarkMode.args = {
  default: 'HTML content can go here.',
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

export const CellSuccessVariant = Template.bind({});
CellSuccessVariant.args = {
  default: 'HTML content can go here.',
  variant: 'success',
};
CellSuccessVariant.parameters = {
  docs: {
    source: {
      code: CodeFactory(CellSuccessVariant.args),
    },
  },
};

export const CellDangerVariant = Template.bind({});
CellDangerVariant.args = {
  default: 'HTML content can go here.',
  variant: 'danger',
};
CellDangerVariant.parameters = {
  docs: {
    source: {
      code: CodeFactory(CellDangerVariant.args),
    },
  },
};

export const CellInfoVariant = Template.bind({});
CellInfoVariant.args = {
  default: 'HTML content can go here.',
  variant: 'info',
};
CellInfoVariant.parameters = {
  docs: {
    source: {
      code: CodeFactory(CellInfoVariant.args),
    },
  },
};

export const CellGridVariant = Template.bind({});
CellGridVariant.args = {
  default: 'HTML content can go here.',
  grid: true,
};
CellGridVariant.parameters = {
  docs: {
    source: {
      code: CodeFactory(CellGridVariant.args),
    },
  },
};

export const CellInteractive = Template.bind({});
CellInteractive.args = {
  default: 'HTML content can go here.',
  interactive: true,
};
CellInteractive.parameters = {
  docs: {
    source: {
      code: CodeFactory(CellInteractive.args),
    },
  },
};

export const CellResizeable = Template.bind({});
CellResizeable.args = {
  default: 'HTML content can go here.',
  resizeable: true,
};
CellResizeable.parameters = {
  docs: {
    source: {
      code: CodeFactory(CellResizeable.args),
    },
  },
};

export const CellPinnable = Template.bind({});
CellPinnable.args = {
  default: 'HTML content can go here.',
  pinnable: true,
};
CellPinnable.parameters = {
  docs: {
    source: {
      code: CodeFactory(CellPinnable.args),
    },
  },
};

const PinnedTemplate = (args, { argTypes }) => ({
  props: Object.keys(argTypes),
  components: { IFCTableCell, IFCThemeProvider },
  methods: {
    onHover: action('@hover'),
    onClick: action('@click'),
    onPin: action('@pin'),
  },
  template: `
    <IFCThemeProvider>
      <div style="max-width: 800px; overflow: auto">
        <IFCTableCell
          @hover="onHover"
          @click="onClick"
          @pin="onPin"
          v-bind="$props">
          ${args.default}
        </IFCTableCell>
        <IFCTableCell>
          Dummy Cell
        </IFCTableCell>
        <IFCTableCell>
          Dummy Cell
        </IFCTableCell>
        <IFCTableCell>
          Dummy Cell
        </IFCTableCell>
        <IFCTableCell>
          Dummy Cell
        </IFCTableCell>
        <IFCTableCell>
          Dummy Cell
        </IFCTableCell>
        <IFCTableCell>
          Dummy Cell
        </IFCTableCell>
        <IFCTableCell>
          Dummy Cell
        </IFCTableCell>
        <IFCTableCell>
          Dummy Cell
        </IFCTableCell>
        <IFCTableCell>
          Dummy Cell
        </IFCTableCell>
      </div>
    </IFCThemeProvider>
  `,
});

export const CellPinned = PinnedTemplate.bind({});
CellPinned.args = {
  default: 'HTML content can go here.',
  pinned: true,
  pinnable: true,
};
CellPinned.parameters = {
  docs: {
    source: {
      code: CodeFactory(CellPinned.args),
    },
  },
};
