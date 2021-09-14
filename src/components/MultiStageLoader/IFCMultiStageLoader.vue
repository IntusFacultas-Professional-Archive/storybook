<template>
  <div class="IFCMultiStageLoader">
    <canvas ref="canvas" width=300 height=300 />
    <div class="IFCMultiStageLoader__textContainer">
      <IFCScreenReaderText>Waiting on </IFCScreenReaderText>
      <IFCSpan
        v-if="stages.some((stage) => !stage.complete)"
        class="IFCMultiStageLoadingText"
        :size="20"
        :color="textColor"
        bold>
        {{currentlyActiveStage.title}}
      </IFCSpan>
      <IFCSpan v-else :size="20" :color="textColor" bold>
        Complete!
      </IFCSpan>
    </div>
  </div>
</template>

<script>
import { IFCScreenReaderText } from '@Components/Text/IFCScreenReaderText.vue';
import { IFCSpan } from '@Components/Text/IFCSpan.vue';

export const IFCMultiStageLoader = {
  data() {
    return {
      angle: 0,
      currentAngles: [],
      originalAngles: [],
      maxAngles: [],
      textColor: '',
      padding: 30,
      currentlyActiveStage: { title: 'Loading' },
    };
  },
  components: {
    IFCScreenReaderText,
    IFCSpan,
  },
  props: {

    /**
     * The height and width of the animation (its a circle, so one dimension is enough)
     */
    dimensions: {
      type: Number,
      default: 300,
    },

    /**
     * Default colors for when a stage lacks a color manually provided to it.
     */
    defaultColors: {
      type: Array,
      default() {
        return [
          '#003f5c',
          '#2f4b7c',
          '#519169',
          '#a05195',
          '#d45087',
          '#f95d6a',
          '#ff7c43',
          '#ffa600',
        ];
      },
      validator(value) {
        return !value.some((color) => (
          typeof color !== 'string' || color.match(/(#[A-Fa-f0-9]{6})|(#[A-Fa-f0-9]{3})/g) === null
        ));
      },
    },

    /**
     * How thick the circle should be
     */
    lineWidth: {
      type: Number,
      default: 25,
    },

    /**
     * What stages there should be and whether or not they are done
     */
    stages: {
      type: Array,
      required: true,
      validator(value) {
        return !value.some((stage) => (
          typeof stage.complete !== 'boolean'
          || typeof stage.title !== 'string'
          || (typeof stage.color === 'string'
            && stage.color.match(/(#[A-Fa-f0-9]{6})|(#[A-Fa-f0-9]{3})/g) === null)
          || (typeof stage.color !== 'undefined' && typeof stage.color !== 'string')
        ));
      },
    },
  },
  mounted() {
    this.defineStartingAngles();
    requestAnimationFrame(this.animate);
  },
  methods: {
    defineStartingAngles() {
      this.currentAngles = this.stages.map((stage, index) => (
        0 + (index) * ((Math.PI * 2) / this.stages.length)));
      this.originalAngles = this.currentAngles.slice();
      this.maxAngles = this.currentAngles.map((angle) => (Math.PI * 2) / this.stages.length + angle);
    },
    animate() {
      this.canvasContext.clearRect(0, 0, this.dimensions, this.dimensions);
      this.draw();
      requestAnimationFrame(this.animate);
    },
    drawStage(stage, index) {
      const startAngle = this.originalAngles[index];
      const maxAngleAllowed = stage.complete ? this.maxAngles[index] : this.maxAngles[index] - (Math.PI / 180) * 20;
      const endAngle = Math.min(this.currentAngles[index] + Math.PI / 180, maxAngleAllowed);
      this.canvasContext.strokeStyle = stage.color ?? this.defaultColors[index % this.defaultColors.length];
      this.canvasContext.lineWidth = this.lineWidth;
      this.canvasContext.beginPath();
      this.canvasContext.arc(
        this.dimensions / 2,
        this.dimensions / 2,
        this.radius,
        startAngle,
        endAngle, false,
      );
      this.canvasContext.stroke();
      this.currentAngles[index] = endAngle;
    },
    draw() {
      const incompleteStages = this.stages.filter((stage) => !stage.complete);
      const completedStages = this.stages.filter((stage) => stage.complete);
      if (incompleteStages.length > 0) {
        const stagesToDraw = [...completedStages]; // draw all complete
        if (!completedStages.some((stage, index) => this.currentAngles[index] < this.maxAngles[index])) {
          /**
           * if we've finished drawing each of the completed stages (since upon completion the last completed arc
           * there is 20% of the arc left to draw)
           */
          stagesToDraw.push(incompleteStages[0]);
        }
        this.currentlyActiveStage = stagesToDraw[stagesToDraw.length - 1];
        this.textColor = stagesToDraw[stagesToDraw.length - 1].color
          ?? this.defaultColors[(stagesToDraw.length - 1) % this.defaultColors.length];
        stagesToDraw.forEach((stage, index) => this.drawStage(stage, index));
      } else {
        this.textColor = this.stages[this.stages.length - 1].color
          ?? this.defaultColors[(this.stages.length - 1) % this.defaultColors.length];
        this.stages.forEach((stage, index) => this.drawStage(stage, index));
      }
    },
  },
  computed: {
    canvas() {
      return this.$refs?.canvas ?? {
        getContext: () => ({
          beginPath: () => {},
          arc: () => {},
          stroke: () => {},
          clearRect: () => {},
        }),
      };
    },
    radius() {
      return this.dimensions / 2 - this.padding;
    },
    canvasContext() {
      return this.canvas.getContext('2d');
    },
  },
};

export default IFCMultiStageLoader;
</script>

<style lang="scss">
@import './multiStageLoader.scss';
</style>
