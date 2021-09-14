import { withA11y } from "@storybook/addon-a11y";
import { withKnobs, text, boolean } from "@storybook/addon-knobs";
import { Tooltip } from "Components/components/Tooltip/src/Tooltip.vue";
import markdown from "Components/components/Alert/Usage.md";
import { VueInput } from "Components/components/StyledHTML/Input/src/Input.vue";
import { TextContent } from "Components/components/StyledHTML/Typography/src/Typography.vue";
import {
  List,
  ListItem,
} from "Components/components/StyledHTML/List/src/StyledList.vue";
import Theme from "Components/components/DesignSystem/theme.js";
let formattedTheme = [];
Object.keys(Theme).forEach((key) =>
  formattedTheme.push({ text: key, value: Theme[key].background.color })
);

export default {
  title: "Tooltip", // Folder/ is unnecessary but you can group stories by a folder by doing so
  decorators: [withA11y, withKnobs],
  parameters: {
    notes: {
      markdown,
    },
  },
  excludeStories: /.*Data$/,
};

export const Alert = () => ({
  components: { Tooltip, VueInput, TextContent, List, ListItem },
  data() {
    return {
      formattedTheme,
    };
  },
  props: {
    flavor: {
      default: text("Flavor", "Primary"),
    },
    activeFlavor: {
      default: text("Active Flavor", "Success"),
    },
  },
  template: `
        <div>
          <div style="display: flex">
            <vue-input style="width:50%" label="Sample Input" type="text"></vue-input>
            <tooltip style="margin-top:14px" :flavor="flavor" :active-flavor="activeFlavor">
              <template>
                <div style="width: 250px">
                  <h1>Hey!</h1>
                  <p>This is a tooltip that pops up when you hover over the info button. All of this is actual html piped through a slot.</p>
                </div>
              </template>
            </tooltip>
          </div>
          <tooltip style="margin-top:14px" :flavor="flavor" :active-flavor="activeFlavor">
              <template>
                <div style="width: 250px">
                  <h1>Hey!</h1>
                  <p>This tooltip detected its too close to the left border so it shifted over so you can see!</p>
                </div>
              </template>
            </tooltip>
          <hr>
          <text-content :size="16">Design system information can be found <a href="/?path=/story/design-system--colors">here</a></text-content><br>
          <text-content :size="16">Available Flavors</text-content>
          <list>
            <list-item v-for="themeFlavor in formattedTheme" :key="themeFlavor.text" :flavor="themeFlavor.text" :style="{color: themeFlavor.value}">
              {{themeFlavor.text}}
            </list-item>
          </list>
        </div>
    `,
});
