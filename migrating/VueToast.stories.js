import { VueToast } from "Components/components/VueToast/src/VueToast.vue";
import { withA11y } from "@storybook/addon-a11y";
import NButton from "Components/components/StyledHTML/Button/src/Button.vue";
import { withKnobs, number, text } from "@storybook/addon-knobs";
import markdown from "Components/components/VueToast/Usage.md";

import { TextContent } from "Components/components/StyledHTML/Typography/src/Typography.vue";
import {
  List,
  ListItem,
} from "Components/components/StyledHTML/List/src/StyledList.vue";
import { AlertTheme as Theme } from "Components/components/DesignSystem/theme.js";
let formattedTheme = [];
Object.keys(Theme).forEach((key) =>
  formattedTheme.push({ text: key, value: Theme[key].background.color })
);

export default {
  title: "VueToast",
  decorators: [withA11y, withKnobs],
  parameters: {
    notes: {
      markdown,
    },
  },
  excludeStories: /.*Data$/,
};

export const ToastrAlerts = () => ({
  components: { VueToast, NButton, TextContent, List, ListItem },
  data() {
    return {
      formattedTheme,
    };
  },
  props: {
    maxWidth: {
      default: number("Max Width", 300),
    },
    delay: {
      default: number("Delay", 5000),
    },
    alertType: {
      default: text("Alert Type", "Success"),
    },
    alerttext: {
      default: text("Alert Text", "This is a toast alert"),
    },
  },
  methods: {
    fireToast() {
      this.$toast({
        type: this.alertType,
        text: this.alerttext,
      });
    },
  },
  template: `
        <div>
            <n-button @click="fireToast">Toast</n-button>
             <vue-toast :max-width="maxWidth" :delay="delay" :parent-instance="this"></vue-toast>
             <hr>
            <text-content :size="16">Design system information can be found <a href="/?path=/story/design-system--colors">here</a></text-content><br>
            <text-content :size="16">Available Flavors</text-content>
            <list>
            <list-item v-for="themeFlavor in formattedTheme" :key="themeFlavor.text" :style="{color: themeFlavor.value}">
                {{themeFlavor.text}}
            </list-item>
            </list>
        </div>
    `,
});
