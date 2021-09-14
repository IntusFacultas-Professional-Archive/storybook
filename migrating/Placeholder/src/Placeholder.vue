<template>
  <placeholder-container ref="container" :height="height">
    <placeholder-paragraph
      v-for="(paragraph, paragraphIndex) in internals.paragraphs"
      :key="`paragraph${paragraphIndex}`"
    ></placeholder-paragraph>
    <placeholder-line
      v-for="(line, index) in internals.lines"
      :key="index"
      :width="getWidth()"
    ></placeholder-line>
  </placeholder-container>
</template>

<script>
import styled from "vue-styled-components";

const props = {
  height: {
    type: String,
    default: "50px",
  },
  width: {
    type: [String, Number],
    default: "50px",
  },
};
const PlaceholderContainer = styled("div", props)`
  height: ${(props) => props.height};
  padding: 15px;
`;
const PlaceholderLine = styled("div", props)`
  animation: shimmer 2.5s infinite;
  background: linear-gradient(to right, #eff1f3 4%, #e2e2e2 25%, #eff1f3 36%);
  background-size: 1000px 100%;
  height: 10px;
  display: inline-block;
  margin: 10px 0px;
  border-radius: 8px;
  width: ${(props) => props.width}%;
`;
export const PlaceholderPicture = styled("div", props)`
  animation: shimmer 2.5s infinite;
  background: linear-gradient(to right, #eff1f3 4%, #e2e2e2 25%, #eff1f3 36%);
  background-size: 1000px 100%;
  height: ${(props) => props.height};
  margin: 10px 10px;
  border-radius: 8px;
  width: ${(props) => props.width};
`;
export const ParagraphLineHolder = styled.div`
  width: calc(100% - 85px);
  display: inline-block;
`;
const PlaceholderParagraph = {
  components: { PlaceholderLine, PlaceholderPicture, ParagraphLineHolder },
  methods: {
    getWidth() {
      return Math.random() * (100 - 85) + 85;
    },
  },
  template: `
    <div>
        <div>
            <placeholder-picture height="78px" width="60px" class="paragraph"></placeholder-picture>
            <paragraph-line-holder>
                <placeholder-line :width="getWidth()" class="paragraph"></placeholder-line>
                <placeholder-line :width="getWidth()" class="paragraph"></placeholder-line>
                <placeholder-line :width="getWidth()" class="paragraph"></placeholder-line>
            </paragraph-line-holder>
        </div>
        <placeholder-line :width="getWidth()"></placeholder-line>
        <placeholder-line :width="getWidth()"></placeholder-line>
    </div>
    `,
};
export const Placeholder = {
  components: { PlaceholderContainer, PlaceholderLine, PlaceholderParagraph },
  data() {
    return {
      PLACEHOLDER_LINE_HEIGHT: 30,
      PARAGRAPH_HEIGHT: 170,
      PADDING_BUFFER: 30,
      internals: { paragraphs: 0, lines: 0 },
    };
  },
  props: {
    height: {
      type: String,
      default: "50px",
    },
    paragraphs: {
      type: Boolean,
      default: true,
    },
  },
  watch: {
    height() {
      this.$nextTick(() => {
        this.internals = this.calculateInternals();
        this.$forceUpdate();
      });
    },
  },
  mounted() {
    this.$nextTick(() => {
      this.internals = this.calculateInternals();
    });
  },
  methods: {
    getWidth() {
      return Math.random() * (100 - 85) + 85;
    },
    calculateInternals() {
      try {
        let availableSpace =
          this.$refs.container.$el.scrollHeight - this.PADDING_BUFFER;
        if (!this.paragraphs) {
          return {
            paragraphs: 0,
            lines: parseInt(availableSpace / this.PLACEHOLDER_LINE_HEIGHT),
          };
        } else {
          let maxParagraphs = parseInt(availableSpace / this.PARAGRAPH_HEIGHT);
          let remainingSpace = parseInt(
            (availableSpace % this.PARAGRAPH_HEIGHT) /
              this.PLACEHOLDER_LINE_HEIGHT
          );
          return {
            paragraphs: maxParagraphs,
            lines: remainingSpace,
          };
        }
      } catch (error) {
        return {
          paragraphs: 0,
          lines: 0,
        };
      }
    },
  },
  computed: {},
};
export default Placeholder;
</script>

<style>
@keyframes shimmer {
  0% {
    background-position: -1000px 0;
  }
  100% {
    background-position: 1000px 0;
  }
}
@-webkit-keyframes shimmer {
  0% {
    background-position: -1000px 0;
  }
  100% {
    background-position: 1000px 0;
  }
}
@-moz-keyframes shimmer {
  0% {
    background-position: -1000px 0;
  }
  100% {
    background-position: 1000px 0;
  }
}
.paragraph {
  display: inline-block;
}
</style>
