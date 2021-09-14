import { withA11y } from "@storybook/addon-a11y";
import { ThemeProvider } from "vue-styled-components";
import {
  withKnobs,
  text,
  boolean,
  object,
  number,
} from "@storybook/addon-knobs";
import Theme from "Components/components/DesignSystem/theme.js";
import { NButton } from "Components/components/StyledHTML/Button/src/Button.vue";
import VueMe from "Components/components/VueMe/src/VueMe.vue";
import Vue from "vue";
import markdown from "Components/components/VueMe/vueMe.md";

import {
  TextContent,
  WebLink,
} from "Components/components/StyledHTML/Typography/src/Typography.vue";
import {
  List,
  ListItem,
} from "Components/components/StyledHTML/List/src/StyledList.vue";
let formattedTheme = [];
Object.keys(Theme).forEach((key) =>
  formattedTheme.push({ text: key, value: Theme[key].background.color })
);

import {
  specs,
  describe,
  it,
  beforeEach,
} from "storybook-addon-specifications";
import expect from "expect";
import { mount } from "@vue/test-utils";
import jest from "jest-mock";
window.jest = jest;

Vue.config.silent = true;
export default {
  title: "Composite Components/VueMe",
  decorators: [withA11y, withKnobs],
  parameters: {
    notes: {
      markdown,
    },
  },
  // Our exports that end in "Data" are not stories.
  excludeStories: /.*Data$/,
};

export const VueMeDialog = () => ({
  components: {
    VueMe,
    NButton,
    ThemeProvider,
    TextContent,
    List,
    ListItem,
    WebLink,
  },
  specs: specs(() =>
    describe("VueMe", () => {
      let vm;
      let wrapper;
      let parent = {};
      beforeEach(() => {
        wrapper = mount(VueMe, {
          propsData: {
            parentInstance: parent,
          },
        });
        vm = wrapper.vm;
      });
      it("binds the alert method", () => {
        expect(parent.$alert).toBeDefined();
      });
      it("closes the alerts", () => {
        vm.close(1);
        expect(vm.deletedAlerts).toContain(1);
      });
      it("formats fields", () => {
        let field = vm.formatField({});
        expect(field.label).toEqual("Label");
        expect(field.type).toEqual("text");
        expect(field.id).toEqual("Label-text");
      });
      it("formats buttons", () => {
        let button = vm.formatButton({});
        expect(button.flavor).toEqual("Primary");
        expect(button.action).toBeInstanceOf(Function);
        expect(button.id).toBeDefined();
        expect(button.text).toEqual("Button");
      });
      it("alerts default", () => {
        vm.alert({});
        expect(vm.alerts.length).toEqual(1);
        let alert = vm.alerts[0];
        expect(alert.flavor).toEqual("");
        expect(alert.width).toEqual(360);
        expect(alert.title).toEqual("Alert");
        expect(alert.icon).toEqual("");
        expect(alert.content).toEqual("This is an alert.");
        expect(alert.backgroundDismiss).toBeFalsy();
        expect(alert.buttons.length).toEqual(1);
        expect(alert.fields.length).toEqual(0);
      });
      it("alerts with custom values", () => {
        vm.alert({
          flavor: "Primary",
          width: 400,
          title: "Test",
          icon: "Reee",
        });
        expect(vm.alerts.length).toEqual(1);
        let alert = vm.alerts[0];
        expect(alert.flavor).toEqual("Primary");
        expect(alert.width).toEqual(400);
        expect(alert.title).toEqual("Test");
        expect(alert.icon).toEqual("Reee");
        expect(alert.content).toEqual("This is an alert.");
        expect(alert.backgroundDismiss).toBeFalsy();
        expect(alert.buttons.length).toEqual(1);
        expect(alert.fields.length).toEqual(0);
      });
    })
  ),
  props: {
    width: {
      default: number("Minimum Pixel Width of Dialog", 360),
    },
    flavor: {
      default: text("Flavor of Dialog", "default"),
    },
    title: {
      default: text("Title of Dialog", "Title"),
    },
    icon: {
      default: text("Icon HTML", ""),
    },
    content: {
      default: text("Dialog Content", "Content"),
    },
    backgroundDismiss: {
      default: boolean("Allow Background Dismissing", false),
    },
    buttons: {
      default: object("Buttons", [
        {
          text: "Close",
          flavor: "Primary",
          action: function(data) {
            console.log(data);
          },
          id: "CloseButton",
        },
      ]),
    },
    fields: {
      default: object("Fields", [
        {
          label: "Enter your name",
          type: "text-content",
          id: "name",
        },
      ]),
    },
    autoClose: {
      default: text("Autoclose", "CloseButton|10000"),
    },
  },
  data: function() {
    return {
      theme: Theme,
      formattedTheme,
    };
  },
  methods: {
    alert: function() {
      let self = this;
      self.$alert(
        {
          width: self.width,
          flavor: self.flavor,
          title: self.title,
          icon: self.icon,
          content: self.content,
          backgroundDismiss: self.backgroundDismiss,
          buttons: self.buttons,
          fields: self.fields,
          autoClose: self.autoClose,
        },
        self
      );
    },
  },
  template: `
        <div>
            <theme-provider :theme="theme">
                <vue-me :parent-instance="this"></vue-me>
                <n-button flavor="Primary" @click="alert">Show Dialog</n-button>
            </theme-provider>
            <text-content>This is a reimplementation of the delightful <web-link href="https://craftpip.github.io/jquery-confirm/" target="_blank">jQuery-Confirm</web-link> library, with a few minor changes for my own personal use, in the Vue ecosystem.</text-content>
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
