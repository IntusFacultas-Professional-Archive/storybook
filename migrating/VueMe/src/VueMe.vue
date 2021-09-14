<template>
  <div>
    <vue-me-dialog
      v-for="(alert, index) in alerts"
      :key="index"
      :flavor="alert.flavor"
      :id="alert.id"
      :parent="alert.parent"
      :zIndex="alert.zIndex"
      :closeTime="alert.closeTime"
      :autoCloseIndex="alert.autoCloseIndex"
      :autoClose="alert.autoClose"
      :title="alert.title"
      :icon="alert.icon"
      :width="alert.width"
      :content="alert.content"
      :fields="alert.fields"
      :backgroundDismiss="alert.backgroundDismiss"
      :buttons="alert.buttons"
    ></vue-me-dialog>
  </div>
</template>

<script>
// changing the file to try and force git to recognize the capitalization change
import styled from "vue-styled-components";
import { Theme } from "@IntusFacultas/design-system";
import { SubSectionTitle } from "@IntusFacultas/typography";
import { DialogButton } from "@IntusFacultas/button";
import { VueInput } from "@IntusFacultas/input";
import { FlexRow, FlexColumn } from "@IntusFacultas/layout";
const props = {
  zIndex: {
    type: Number,
    default: 0,
  },
  width: {
    type: Number,
    default: 360,
  },
  flavor: String,
  defaultTheme: {
    type: Object,
    default: function () {
      return Theme;
    },
  },
};
const VueMeDialogContainer = styled("div", props)`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100%;
  position: fixed;
  width: 100%;
  z-index: ${(props) => props.zIndex + 1999};
  top: 0px;
  bottom: 0px;
  left: 0px;
  right: 0px;
`;
const VueMeBackdrop = styled("div", props)`
  background-color: #444;
  opacity: 0;
  z-index: ${(props) => props.zIndex + 1999};
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  transition-duration: 0.4s;
  transition-timing-function: cubic-bezier(0.36, 0.55, 0.19, 1);
  transition-property: opacity;
  animation: vueme-fadein 0.4s;
`;
const VueMeTitleContainer = styled.div`
  display: flex;
`;
const VueMeDialogBox = styled("div", props)`
  z-index: ${(props) => props.zIndex + 2000};
  background-color: #fff;
  border: 1px solid rgba(0, 0, 0, 0.125);
  border-top: solid 7px
    ${(props) =>
      props.theme && props.theme[props.flavor]
        ? props.theme[props.flavor].border.color
        : props.defaultTheme[props.flavor]
        ? props.defaultTheme[props.flavor].border.color
        : "white"};
  border-radius: 0.25rem;
  min-width: ${(props) => props.width}px;
  display: flex;
  transition: all 0.4s;
  transform: scale(0);
  transition-timing-function: cubic-bezier(0.36, 0.55, 0.19, 1);
`;
const VueMeDialogContentContainer = styled.div`
  width: 100%;
  font-family: "Open Sans Regular", -apple-system, BlinkMacSystemFont,
    "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif, "Apple Color Emoji",
    "Segoe UI Emoji", "Segoe UI Symbol";
  padding: 10px;
  word-break: break-word;
`;
const VueMeDialogContent = styled.div``;
const VueMeDialogButtonContainer = styled.div`
  margin-top: 15px;
  display: flex;
  justify-content: flex-end;
`;
const VueMeDialog = {
  components: {
    VueMeDialogContainer,
    VueMeBackdrop,
    VueMeTitleContainer,
    VueMeDialogBox,
    VueMeDialogContentContainer,
    VueMeDialogContent,
    VueMeDialogButtonContainer,
    SubSectionTitle,
    DialogButton,
    VueInput,
    FlexRow,
    FlexColumn,
  },
  data() {
    return {
      show: false,
      intervalId: -1,
      shaking: false,
      enabled: false,
      fieldValues: [],
      internalCloseTime: 0,
    };
  },
  props: {
    flavor: {
      type: String,
      default: "",
    },
    id: {
      type: Number,
      required: true,
    },
    parent: {
      type: Object,
      required: true,
    },
    zIndex: {
      type: Number,
      default: 0,
    },
    closeTime: {
      type: Number,
      default: 0,
    },
    autoCloseIndex: {
      type: Number,
      default: -1,
    },
    autoClose: {
      type: Boolean,
      default: false,
    },
    title: {
      type: String,
      default: "Alert",
    },
    icon: {
      type: String,
      default: "",
    },
    width: {
      type: Number,
      default: 360,
    },
    content: {
      type: String,
      default: "You forgot to provide content",
    },
    fields: {
      type: Array,
      default() {
        return [];
      },
    },
    backgroundDismiss: {
      type: Boolean,
      default: true,
    },
    buttons: {
      type: Array,
      default() {
        return [
          {
            id: 1,
            flavor: "",
            text: "Close",
            action: function () {
              // empty
            },
          },
        ];
      },
    },
  },
  mounted() {
    let self = this;
    this.$nextTick(function () {
      self.open();
    });
  },
  methods: {
    open: function () {
      this.show = true;
      this.enabled = true;
      this.internalCloseTime = this.closeTime;
      if (this.autoClose) {
        this.beginAutoClose();
      }
      let self = this;
      setTimeout(function () {
        self.$refs.backdrop.$el.classList.add("vueme-dialog-backdrop-open");
        self.$refs.dialogBox.$el.classList.add("vueme-dialog-open");
      }, 50);
    },
    handleAutoClose: function () {
      if (this.internalCloseTime == 0) {
        clearInterval(this.intervalId);
        this.callFunction(this.buttons[this.autoCloseIndex]);
      } else {
        this.internalCloseTime--;
      }
    },
    beginAutoClose: function () {
      this.intervalId = setInterval(this.handleAutoClose, 1000);
    },
    callFunction: function (button) {
      if (this.enabled) {
        var close = button.action(this.fieldValues);
        if (close !== false) {
          this.close();
        }
      }
    },
    close: function () {
      if (this.enabled && !this.shaking) {
        this.enabled = false;
        if (this && this.$refs && this.$refs.dialogBox) {
          this.$refs.dialogBox.$el.classList.remove("vueme-dialog-open");
          this.$refs.dialogBox.$el.classList.add("vueme-dismiss-dialog");
        }
        if (this && this.$refs && this.$refs.backdrop)
          this.$refs.backdrop.$el.classList.remove(
            "vueme-dialog-backdrop-open"
          );
        let self = this;
        setTimeout(function () {
          self.show = false;
          self.show = false;
          // destroy the vue listeners, etc
          self.$destroy();

          // remove the element from the DOM
          self.$el.parentNode.removeChild(self.$el);
          self.parent.close(self.id);
        }, 420);
      }
    },
    closeDialog: function () {
      if (!this.enabled) {
        return;
      }
      if (this.backgroundDismiss) {
        this.close();
      } else {
        if (this && this.$refs && this.$refs.dialogBox)
          this.$refs.dialogBox.$el.classList.add("vueme-shake-dialog");
        let self = this;
        this.shaking = true;
        setTimeout(function () {
          self.shaking = false;
          if (self && self.$refs && self.$refs.dialogBox)
            self.$refs.dialogBox.$el.classList.remove("vueme-shake-dialog");
        }, 1000);
      }
    },
  },
  template: `
  <vue-me-dialog-container :z-index="zIndex">
    <vue-me-backdrop
      ref="backdrop"
      :class="{'vueme-dialog-backdrop-open' : show}"
      :z-index="zIndex"
      @click="closeDialog"
    ></vue-me-backdrop>
      <vue-me-dialog-box
        ref="dialogBox"
        :flavor="flavor"
        :width="width"
      >
        <vue-me-dialog-content-container>
          <vue-me-title-container>
            <span v-html="icon"></span>
            <sub-section-title class="vue-me-title">{{title}}</sub-section-title>
          </vue-me-title-container>
          <vue-me-dialog-content>
            <div v-html="content"></div>
            <form v-if="fields.length > 0">
              <vue-input
                v-for="field in fields"
                :key="'field' + field.id"
                :name="'vueMeField' + field.id"
                :input-type="field.type"
                :label="field.label"
                v-model="fieldValues[field.id]"
              ></vue-input>
            </form>
            <vue-me-dialog-button-container>
              <dialog-button
                v-for="(button, index) in buttons"
                :key="'button' + button.id"
                @click="callFunction(button)"
                :flavor="button.flavor"
                :small="true"
                :disabled="shaking"
              >
                {{button.text}}
                <span v-if="index == autoCloseIndex">({{internalCloseTime}})</span>
              </dialog-button>
            </vue-me-dialog-button-container>
          </vue-me-dialog-content>
        </vue-me-dialog-content-container>
      </vue-me-dialog-box>
  </vue-me-dialog-container>
  `,
};
export const VueMe = {
  components: { VueMeDialog },
  name: "vue-me",
  data() {
    return {
      alerts: [],
      availableId: 0,
      availalbeAlertId: 0,
      deletedAlerts: [],
    };
  },
  props: {
    parentInstance: {
      type: Object,
      default: "",
    },
  },
  mounted: function () {
    this.parentInstance.$alert = this.alert;
    if (typeof Object.assign !== "function") {
      // Must be writable: true, enumerable: false, configurable: true
      Object.defineProperty(Object, "assign", {
        value: function assign(target, varArgs) {
          // .length of function is 2
          "use strict";
          if (target === null || target === undefined) {
            throw new TypeError("Cannot convert undefined or null to object");
          }

          var to = Object(target);

          for (var index = 1; index < arguments.length; index++) {
            var nextSource = arguments[index];

            if (nextSource !== null && nextSource !== undefined) {
              for (var nextKey in nextSource) {
                // Avoid bugs when hasOwnProperty is shadowed
                if (Object.prototype.hasOwnProperty.call(nextSource, nextKey)) {
                  to[nextKey] = nextSource[nextKey];
                }
              }
            }
          }
          return to;
        },
        writable: true,
        configurable: true,
      });
    }
  },
  watch: {
    deletedAlerts(newVal, oldVal) {
      // we do this because if we change the alerts array while we still have alerts visible, it causes a re render but
      // not a re-mount so the alerts "disappear". So we wait to delete from array until all alerts are no longer visible
      if (
        this.deletedAlerts.length == this.alerts.length &&
        this.deletedAlerts.length != 0
      ) {
        this.alerts = [];
        this.deletedAlerts = [];
      }
    },
  },
  methods: {
    close: function close(id) {
      this.deletedAlerts.push(id);
    },
    formatField: function (field) {
      var label = "Label";
      if (field.label) {
        label = field.label;
      }
      var fieldType = "text";
      if (field.type) {
        fieldType = field.type;
      }
      var id = label + "-" + fieldType;
      if (field.id) {
        id = field.id;
      }
      return {
        id: id,
        label: label,
        type: fieldType,
      };
    },
    formatButton: function (button) {
      var text = "Button";
      if (button.text) {
        text = button.text;
      }
      var flavor = "Primary";
      if (button.flavor) {
        flavor = button.flavor;
      }
      var action = function () {};
      if (button.action) {
        action = button.action;
      }
      var id = this.availableId++;
      if (button.id) {
        id = button.id;
      }
      return {
        id: id,
        text: text,
        flavor: flavor,
        action: action,
      };
    },
    alert: function (options) {
      let dialogConfiguration = {
        id: this.availalbeAlertId++,
        parent: this,
      };
      let flavor = "";
      if (options.flavor) {
        flavor = options.flavor;
      }
      dialogConfiguration.flavor = flavor;
      let width = 360;
      if (options.width) {
        width = options.width;
      }
      dialogConfiguration.width = width;
      let title = "Alert";
      if (typeof options.title == "string") {
        title = options.title;
      }
      dialogConfiguration.title = title;
      let icon = "";
      if (options.icon) {
        icon = options.icon;
      }
      dialogConfiguration.icon = icon;
      let content = "This is an alert.";
      if (typeof options.content == "string") {
        content = options.content;
      }
      dialogConfiguration.content = content;
      let backgroundDismiss = false;
      if (options.backgroundDismiss) {
        backgroundDismiss = options.backgroundDismiss;
      }
      dialogConfiguration.backgroundDismiss = backgroundDismiss;
      let buttons = [this.formatButton({})];
      if (options.buttons && Array.isArray(options.buttons)) {
        buttons = [];
        for (let x = 0; x < options.buttons.length; x++) {
          buttons.push(this.formatButton(options.buttons[x]));
        }
      }
      dialogConfiguration.buttons = buttons;
      let fields = [];
      if (options.fields && Array.isArray(options.fields)) {
        fields = [];
        for (let field of options.fields) {
          fields.push(this.formatField(field));
        }
      }
      dialogConfiguration.fields = fields;
      let autoClose = options.autoClose;
      if (autoClose) {
        dialogConfiguration.autoClose = true;
        autoClose = autoClose.split("|");
        dialogConfiguration.closeTime = Math.ceil(
          parseInt(autoClose[1]) / 1000
        );
        for (let [index, button] of dialogConfiguration.buttons.entries()) {
          if (button.id == autoClose[0]) {
            dialogConfiguration.autoCloseIndex = index;
            break;
          }
        }
      }
      this.alerts.push(Object.assign({}, dialogConfiguration));
    },
  },
};
export default VueMe;
</script>

<style>
.vue-me-title {
  margin: 0px;
}
.vueme-dialog-backdrop-open {
  opacity: 0.2;
}
.vueme-dialog-open {
  transform: scale(1);
}
.vueme-dismiss-dialog {
  transition: all 0.4s;
  transition-timing-function: cubic-bezier(0.36, 0.55, 0.19, 1);
  transform: scale(0);
  display: block;
}
.vueme-shake-dialog {
  -webkit-animation: shake 0.82s cubic-bezier(0.36, 0.07, 0.19, 0.97) both;
  animation: shake 0.82s cubic-bezier(0.36, 0.07, 0.19, 0.97) both;
  -webkit-transform: translate3d(0, 0, 0);
  transform: translate3d(0, 0, 0);
}
@keyframes vueme-fadein {
  from {
    opacity: 0;
  }
  to {
    opacity: 0.2;
  }
}
@keyframes shake {
  10%,
  90% {
    -webkit-transform: translate3d(-2px, 0, 0);
    transform: translate3d(-2px, 0, 0);
  }
  20%,
  80% {
    -webkit-transform: translate3d(4px, 0, 0);
    transform: translate3d(4px, 0, 0);
  }
  30%,
  50%,
  70% {
    -webkit-transform: translate3d(-8px, 0, 0);
    transform: translate3d(-8px, 0, 0);
  }
  40%,
  60% {
    -webkit-transform: translate3d(8px, 0, 0);
    transform: translate3d(8px, 0, 0);
  }
}
@-ms-keyframes shake {
  10%,
  90% {
    -webkit-transform: translate3d(-2px, 0, 0);
    transform: translate3d(-2px, 0, 0);
  }
  20%,
  80% {
    -webkit-transform: translate3d(4px, 0, 0);
    transform: translate3d(4px, 0, 0);
  }
  30%,
  50%,
  70% {
    -webkit-transform: translate3d(-8px, 0, 0);
    transform: translate3d(-8px, 0, 0);
  }
  40%,
  60% {
    -webkit-transform: translate3d(8px, 0, 0);
    transform: translate3d(8px, 0, 0);
  }
}
</style>
