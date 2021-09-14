import { withA11y } from "@storybook/addon-a11y";
import { withKnobs, text, boolean } from "@storybook/addon-knobs";
import { DatePicker } from "Components/components/DatePicker/src/DatePicker.vue";
import markdown from "Components/components/DatePicker/USAGE.md";
import { action } from "@storybook/addon-actions";
export default {
  title: "Composite Components/Datepicker", // Folder/ is unnecessary but you can group stories by a folder by doing so
  decorators: [withA11y, withKnobs],
  parameters: {
    notes: {
      markdown,
    },
  },
  excludeStories: /.*Data$/,
};

const actionsData = {
  onInput: action("@input"),
};
export const ConfigurableDatePicker = () => ({
  components: { DatePicker },
  data() {
    return {
      startDate: "",
      endDate: "",
    };
  },
  methods: actionsData,
  props: {
    label: {
      default: text("Label", "Select a date"),
    },
    debug: {
      default: boolean("Debug", false),
    },
    textFlavor: {
      default: text("Text Flavor", "Normal"),
    },
    name: {
      default: text("Name", "datepicker"),
    },
    clear: {
      default: boolean("Show Clear", true),
    },
  },
  template: `
    <div>
        <date-picker
        :label="label"
        :debug="debug"
        :text-flavor="textFlavor"
        :name="name"
        @input="onInput"
        :show-clear="clear"
        :start="startDate"
        :end="endDate"></date-picker>
        <h2>Other content</h2>
        <date-picker @input="onInput" :end='endDate' :default-now="false" label="Pick a start date" name="startDate" v-model="startDate"></date-picker>
        <date-picker @input="onInput" :start='startDate' :default-now="false" label="Pick an end date" name="endDate" v-model="endDate"></date-picker>
    </div>
    `,
});
