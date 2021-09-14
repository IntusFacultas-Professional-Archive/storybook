<template>
  <tooltip-container>
    <tooltip-content
      :flavor="flavor"
      :active-flavor="computedActiveFlavor"
      :translate="translate"
      :translate-amount="translateAmount"
      ref="container"
    >
      <div class="vue-tooltip-content" ref="content">
        <slot></slot>
      </div>
      <svg
        class="vue-tooltip-icon"
        xmlns="http://www.w3.org/2000/svg"
        width="18"
        height="18"
        viewBox="0 0 24 24"
      >
        <path
          d="M12 2c5.514 0 10 4.486 10 10s-4.486 10-10 10-10-4.486-10-10 4.486-10 10-10zm0-2c-6.627 0-12 5.373-12 12s5.373 12 12 12 12-5.373 12-12-5.373-12-12-12zm1 18h-2v-8h2v8zm-1-12.25c.69 0 1.25.56 1.25 1.25s-.56 1.25-1.25 1.25-1.25-.56-1.25-1.25.56-1.25 1.25-1.25z"
        />
      </svg>
    </tooltip-content>
  </tooltip-container>
</template>

<script>
import styled from "vue-styled-components";
import Theme from "@IntusFacultas/design-system";
const props = {
  flavor: String,
  activeFlavor: String,
  translate: Boolean,
  translateAmount: Number,
  defaultTheme: {
    type: Object,
    default: function() {
      return Theme;
    }
  }
};
const TooltipContainer = styled("div", props)`
  font-family: "Open Sans Regular", -apple-system, BlinkMacSystemFont,
    "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif, "Apple Color Emoji",
    "Segoe UI Emoji", "Segoe UI Symbol";
  display: inline-block;
  position: relative;
  width: 48px;
  height: 48px;
`;
const TooltipContent = styled("div", props)`
  z-index: 2;
  background-color: ${props =>
    props.theme && props.theme[props.flavor]
      ? props.theme[props.flavor].background.color
      : props.defaultTheme[props.flavor]
      ? props.defaultTheme[props.flavor].background.color
      : "#f2f2f2"};
  padding: 1em;
  clip-path: circle(18px at calc(100% - 1.55em) 1.55em);
  transition: all 0.5s ease-in-out;

  display: inline-block;
  position: absolute;
  right: 0;
  border-radius: 5px;
  & * {
    opacity: 1;
    line-height: 1rem;
    color: ${props =>
      props.theme && props.theme[props.flavor]
        ? props.theme[props.flavor].color.color
        : props.defaultTheme[props.flavor]
        ? props.defaultTheme[props.flavor].color.color
        : "#222"};
  }
  & div.vue-tooltip-content {
    margin-right: 50px;
  }
  & svg.vue-tooltip-icon {
    position: absolute;
    right: 1em;
    top: 1em;
    stroke: ${props =>
      props.theme && props.theme[props.flavor]
        ? props.theme[props.flavor].color.color
        : props.defaultTheme[props.flavor]
        ? props.defaultTheme[props.flavor].color.color
        : "#222"};
    fill: ${props =>
      props.theme && props.theme[props.flavor]
        ? props.theme[props.flavor].color.color
        : props.defaultTheme[props.flavor]
        ? props.defaultTheme[props.flavor].color.color
        : "#222"};
  }
  &:hover {
    box-shadow: 0px 5px 3px 0px #d6d6d6;
    clip-path: circle(100%);
    background-color: ${props =>
      props.theme && props.theme[props.activeFlavor]
        ? props.theme[props.activeFlavor].background.color
        : props.defaultTheme[props.activeFlavor]
        ? props.defaultTheme[props.activeFlavor].background.color
        : "#f2f2f2"};
    color: ${props =>
      props.theme && props.theme[props.activeFlavor]
        ? props.theme[props.activeFlavor].color.color
        : props.defaultTheme[props.activeFlavor]
        ? props.defaultTheme[props.activeFlavor].color.color
        : "#222"};
    ${props =>
      props.translate
        ? `
      transform: translate(calc(${props.translateAmount}px + 2em + 30px), 0px)
    `
        : ``}
  }
`;

export const Tooltip = {
  components: { TooltipContainer, TooltipContent },
  data() {
    return {
      translate: false
    };
  },
  props: {
    flavor: {
      type: String,
      default: ""
    },
    activeFlavor: {
      type: String,
      default: ""
    }
  },
  methods: {
    setSide() {
      let distanceFromEdge = this.$refs.content.getBoundingClientRect();
      if (distanceFromEdge.x < distanceFromEdge.width) {
        this.translate = true;
        this.translateAmount = distanceFromEdge.width;
      } else {
        this.translate = false;
      }
    }
  },
  beforeDestroy() {
    window.removeEventListener("resize", this.setSide);
  },
  mounted() {
    this.setSide();
    window.addEventListener("resize", this.setSide);
  },
  computed: {
    computedActiveFlavor() {
      if (this.activeFlavor) {
        return this.activeFlavor;
      }
      return this.flavor;
    }
  }
};
export default Tooltip;
</script>

<style>
</style>
