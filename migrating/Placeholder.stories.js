import { withA11y } from "@storybook/addon-a11y";
import {
  withKnobs,
  text,
  object,
  number,
  boolean,
} from "@storybook/addon-knobs";
import {
  Placeholder,
  PlaceholderPicture,
} from "Components/components/Placeholder/src/Placeholder.vue";
import markdown from "Components/components/Placeholder/USAGE.md";

export default {
  title: "Placeholder", // Folder/ is unnecessary but you can group stories by a folder by doing so
  decorators: [withA11y, withKnobs],
  parameters: {
    notes: {
      markdown,
    },
  },
  excludeStories: /.*Data$/,
};

export const ConfigurablePlaceholder = () => ({
  components: { Placeholder },
  props: {
    height: {
      default: text("Height", "100px"),
    },
    paragraphs: {
      default: boolean("Include Paragraphs", true),
    },
  },
  template: `
        <div style="width: 100%;">
            <placeholder :height="height" :paragraphs="paragraphs"></placeholder>
        </div>
    `,
});

export const ConfigurablePlaceholderPicture = () => ({
  components: { PlaceholderPicture },
  props: {
    height: {
      default: text("Height", "300px"),
    },
    width: {
      default: text("Width", "200px"),
    },
  },
  template: `
        <div style="width: 100%;">
            <placeholder-picture :height="height" :width="width"></placeholder-picture>
        </div>
    `,
});
