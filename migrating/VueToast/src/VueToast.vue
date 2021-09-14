<template>
  <alert-container :width="maxWidth">
    <alert
      v-for="alert in alerts"
      :key="alert.id"
      :class="{ 'vue-toast-dying': alert.dying }"
      :flavor="alert.type"
      @click="removeToast(alert.id)"
      aria-live="polite"
      role="alert"
    >
      <icon-container>
        <span v-if="alert.type == 'Warning'">
          <svg
            class="svg-icon"
            viewBox="0 0 20 20"
            :fill="theme[alert.type] ? theme[alert.type].color.color : '#222'"
            height="20"
            width="20"
          >
            <path
              :fill="theme[alert.type] ? theme[alert.type].color.color : '#222'"
              d="M19.471,8.934L18.883,8.34c-2.096-2.14-4.707-4.804-8.903-4.804c-4.171,0-6.959,2.83-8.996,4.897L0.488,8.934c-0.307,0.307-0.307,0.803,0,1.109l0.401,0.403c2.052,2.072,4.862,4.909,9.091,4.909c4.25,0,6.88-2.666,8.988-4.807l0.503-0.506C19.778,9.737,19.778,9.241,19.471,8.934z M9.98,13.787c-3.493,0-5.804-2.254-7.833-4.3C4.182,7.424,6.493,5.105,9.98,5.105c3.536,0,5.792,2.301,7.784,4.332l0.049,0.051C15.818,11.511,13.551,13.787,9.98,13.787z"
            />
            <circle
              :fill="theme[alert.type] ? theme[alert.type].color.color : '#222'"
              :stroke="
                theme[alert.type] ? theme[alert.type].color.color : '#222'
              "
              cx="9.98"
              cy="9.446"
              r="1.629"
            />
          </svg>
        </span>
        <span v-else-if="alert.type == 'Success'">
          <svg
            class="svg-icon"
            viewBox="0 0 20 20"
            height="20"
            width="20"
            :stroke="theme[alert.type] ? theme[alert.type].color.color : '#222'"
            :fill="theme[alert.type] ? theme[alert.type].color.color : '#222'"
          >
            <path
              d="M10.219,1.688c-4.471,0-8.094,3.623-8.094,8.094s3.623,8.094,8.094,8.094s8.094-3.623,8.094-8.094S14.689,1.688,10.219,1.688 M10.219,17.022c-3.994,0-7.242-3.247-7.242-7.241c0-3.994,3.248-7.242,7.242-7.242c3.994,0,7.241,3.248,7.241,7.242C17.46,13.775,14.213,17.022,10.219,17.022 M15.099,7.03c-0.167-0.167-0.438-0.167-0.604,0.002L9.062,12.48l-2.269-2.277c-0.166-0.167-0.437-0.167-0.603,0c-0.166,0.166-0.168,0.437-0.002,0.603l2.573,2.578c0.079,0.08,0.188,0.125,0.3,0.125s0.222-0.045,0.303-0.125l5.736-5.751C15.268,7.466,15.265,7.196,15.099,7.03"
            />
          </svg>
        </span>
        <span v-else-if="alert.type == 'Info'">
          <svg
            class="svg-icon"
            viewBox="0 0 20 20"
            height="22"
            width="20"
            :stroke="theme[alert.type] ? theme[alert.type].color.color : '#222'"
            :fill="theme[alert.type] ? theme[alert.type].color.color : '#222'"
          >
            <path
              :fill="theme[alert.type] ? theme[alert.type].color.color : '#222'"
              d="M12.323,2.398c-0.741-0.312-1.523-0.472-2.319-0.472c-2.394,0-4.544,1.423-5.476,3.625C3.907,7.013,3.896,8.629,4.49,10.102c0.528,1.304,1.494,2.333,2.72,2.99L5.467,17.33c-0.113,0.273,0.018,0.59,0.292,0.703c0.068,0.027,0.137,0.041,0.206,0.041c0.211,0,0.412-0.127,0.498-0.334l1.74-4.23c0.583,0.186,1.18,0.309,1.795,0.309c2.394,0,4.544-1.424,5.478-3.629C16.755,7.173,15.342,3.68,12.323,2.398z M14.488,9.77c-0.769,1.807-2.529,2.975-4.49,2.975c-0.651,0-1.291-0.131-1.897-0.387c-0.002-0.004-0.002-0.004-0.002-0.004c-0.003,0-0.003,0-0.003,0s0,0,0,0c-1.195-0.508-2.121-1.452-2.607-2.656c-0.489-1.205-0.477-2.53,0.03-3.727c0.764-1.805,2.525-2.969,4.487-2.969c0.651,0,1.292,0.129,1.898,0.386C14.374,4.438,15.533,7.3,14.488,9.77z"
            />
          </svg>
        </span>
        <div v-else-if="alert.type == 'Danger'">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            xmlns:xlink="http://www.w3.org/1999/xlink"
            version="1.1"
            id="Capa_1"
            xml:space="preserve"
            viewBox="0 0 55 55"
            :fill="theme[alert.type] ? theme[alert.type].color.color : '#222'"
            :stroke="theme[alert.type] ? theme[alert.type].color.color : '#222'"
            height="18"
            width="18"
          >
            <g>
              <path
                d="M44.373,7.603c-10.137-10.137-26.632-10.138-36.77,0c-10.138,10.138-10.137,26.632,0,36.77s26.632,10.138,36.77,0   C54.51,34.235,54.51,17.74,44.373,7.603z M36.241,36.241c-0.781,0.781-2.047,0.781-2.828,0l-7.425-7.425l-7.778,7.778   c-0.781,0.781-2.047,0.781-2.828,0c-0.781-0.781-0.781-2.047,0-2.828l7.778-7.778l-7.425-7.425c-0.781-0.781-0.781-2.048,0-2.828   c0.781-0.781,2.047-0.781,2.828,0l7.425,7.425l7.071-7.071c0.781-0.781,2.047-0.781,2.828,0c0.781,0.781,0.781,2.047,0,2.828   l-7.071,7.071l7.425,7.425C37.022,34.194,37.022,35.46,36.241,36.241z"
              />
            </g>
          </svg>
        </div>
      </icon-container>
      <alert-content v-html="alert.content"></alert-content>
      <close-container>
        <svg
          class="svg-icon"
          viewBox="0 0 20 20"
          height="10"
          width="10"
          :stroke="theme[alert.type] ? theme[alert.type].color.color : '#222'"
        >
          <path
            :fill="theme[alert.type] ? theme[alert.type].color.color : '#222'"
            d="M11.469,10l7.08-7.08c0.406-0.406,0.406-1.064,0-1.469c-0.406-0.406-1.063-0.406-1.469,0L10,8.53l-7.081-7.08
							c-0.406-0.406-1.064-0.406-1.469,0c-0.406,0.406-0.406,1.063,0,1.469L8.531,10L1.45,17.081c-0.406,0.406-0.406,1.064,0,1.469
							c0.203,0.203,0.469,0.304,0.735,0.304c0.266,0,0.531-0.101,0.735-0.304L10,11.469l7.08,7.081c0.203,0.203,0.469,0.304,0.735,0.304
							c0.267,0,0.532-0.101,0.735-0.304c0.406-0.406,0.406-1.064,0-1.469L11.469,10z"
          />
        </svg>
      </close-container>
    </alert>
  </alert-container>
</template>

<script>
import styled from "vue-styled-components";
import { AlertTheme } from "@IntusFacultas/design-system";
const props = {
  flavor: String,
  width: Number,
  defaultTheme: {
    type: Object,
    default: function() {
      return AlertTheme;
    },
  },
};
const CloseContainer = styled.div`
  margin-left: 20px;
`;

const AlertContainer = styled("div", props)`
  max-width: ${(props) => props.width}px;
  position: fixed;
  right: 15px;
  top: 30px;
  bottom: 0px;
  display: flex;
  pointer-events: none;
  flex-direction: column;
`;
const IconContainer = styled("div", props)`
  padding-right: 0.25rem;
  & span {
    line-height: 1rem;
  }
`;
const AlertContent = styled.div``;
const Alert = styled("div", props)`
  border-radius: 2px;
  padding: 1rem 0.5rem;
  margin-bottom: 5px;
  display: flex;
  pointer-events: all;
  justify-content: space-between;
  -webkit-animation: fadein 0.5s; /* Safari, Chrome and Opera > 12.1 */
  -moz-animation: fadein 0.5s; /* Firefox < 16 */
  -ms-animation: fadein 0.5s; /* Internet Explorer */
  -o-animation: fadein 0.5s; /* Opera < 12.1 */
  animation: fadein 0.5s;

  opacity: 1;
  & * {
    opacity: 1;
  }
  transition: 1s all;
  cursor: pointer;
  border: 2px solid
    ${(props) =>
      props.theme && props.theme[props.flavor]
        ? props.theme[props.flavor].border.color
        : props.defaultTheme[props.flavor]
        ? props.defaultTheme[props.flavor].border.color
        : "#f2f2f2"};
  background-color: ${(props) =>
    props.theme && props.theme[props.flavor]
      ? props.theme[props.flavor].background.color
      : props.defaultTheme[props.flavor]
      ? props.defaultTheme[props.flavor].background.color
      : "#f2f2f2"};
  font-family: "Open Sans Regular", -apple-system, BlinkMacSystemFont,
    "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif, "Apple Color Emoji",
    "Segoe UI Emoji", "Segoe UI Symbol";
  font-size: 16px;
  font-weight: bold;
  & * {
    background-color: ${(props) =>
      props.theme && props.theme[props.flavor]
        ? props.theme[props.flavor].background.color
        : props.defaultTheme[props.flavor]
        ? props.defaultTheme[props.flavor].background.color
        : "#f2f2f2"};
    line-height: 1rem;
    color: ${(props) =>
      props.theme && props.theme[props.flavor]
        ? props.theme[props.flavor].color.color
        : props.defaultTheme[props.flavor]
        ? props.defaultTheme[props.flavor].color.color
        : "#222"};
  }
`;
export const VueToast = {
  components: {
    AlertContainer,
    IconContainer,
    AlertContent,
    Alert,
    CloseContainer,
  },
  data() {
    return {
      availableId: 0,
      alerts: [],
      theme: AlertTheme,
      validTypes: ["WARNING", "INFO", "DANGER", "SUCCESS"],
    };
  },
  props: {
    parentInstance: {
      type: Object,
      required: true,
    },
    maxWidth: {
      type: Number,
      default: 300,
    },
    delay: {
      type: Number,
      default: 5000,
    },
  },
  mounted() {
    this.parentInstance.$toast = this.toast;
  },
  computed: {},
  methods: {
    toast(options) {
      let self = this;
      let alertType = "info";
      if (
        options.type &&
        this.validTypes.indexOf(options.type.toUpperCase()) > -1
      ) {
        alertType = options.type;
      }
      let text = "This is an info toast";
      if (options.text) {
        text = options.text;
      }
      let id = this.availableId++;
      let timeAdded = Math.round(new Date().getTime() / 1000);
      let dying = false;
      this.alerts.push({
        type: alertType,
        content: text,
        timeAdded: timeAdded,
        id: id,
        dying: dying,
      });
      setTimeout(function() {
        self.removeToast(id);
      }, this.delay);
    },
    removeToast(id) {
      var self = this;
      let alert = this.alerts.filter((alert) => alert.id == id)[0];
      if (alert && !alert.dying) {
        alert.dying = true;
        this.$forceUpdate();
        setTimeout(function() {
          self.alerts = self.alerts.filter((alert) => alert.id != id);
          self.$forceUpdate();
        }, 501);
      } else if (!alert) {
        self.$nextTick(self.removeToast(id));
      }
    },
  },
};
export default VueToast;
</script>

<style>
.vue-toast-dying {
  opacity: 0 !important;
}
@keyframes fadein {
  from {
    opacity: 0;
    transform: translateX(200px);
  }
  to {
    opacity: 1;
    transform: translateX(0px);
  }
}

/* Firefox < 16 */
@-moz-keyframes fadein {
  from {
    opacity: 0;
    transform: translateX(200px);
  }
  to {
    opacity: 1;
    transform: translateX(0px);
  }
}

/* Safari, Chrome and Opera > 12.1 */
@-webkit-keyframes fadein {
  from {
    opacity: 0;
    transform: translateX(200px);
  }
  to {
    opacity: 1;
    transform: translateX(0px);
  }
}

/* Internet Explorer */
@-ms-keyframes fadein {
  from {
    opacity: 0;
    transform: translateX(200px);
  }
  to {
    opacity: 1;
    transform: translateX(0px);
  }
}

/* Opera < 12.1 */
@-o-keyframes fadein {
  from {
    opacity: 0;
    transform: translateX(200px);
  }
  to {
    opacity: 1;
    transform: translateX(0px);
  }
}
</style>
