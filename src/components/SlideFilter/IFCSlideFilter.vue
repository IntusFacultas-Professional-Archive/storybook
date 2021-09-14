<template>
  <div class="IFCSlideFilter">
    <label class="IFCSlideFilter__label" :id="computedId"> <slot name="label"></slot> </label>
    <IFCScreenReaderText as="label" :id="lowerValueLabelId">
      <slot name="label"></slot> Lower Value
      </IFCScreenReaderText>
    <IFCScreenReaderText as="label" :id="upperValueLabelId">
      <slot name="label"></slot> Upper Value
    </IFCScreenReaderText>
    <div class="IFCSlideFilter__inputContainer">
      <input
        class="IFCSlideFilter__input"
        type="number"
        :id="computedLeftId"
        :name="lowerValueName"
        :value="lowerValue"
        :min="min"
        :max="upperValue"
        :aria-labelledby="lowerValueLabelId"
        @input="eventHandler($event, 'input', true)"
        @change="eventHandler($event, 'change', true)"
      />
      <div class="IFCSlideFilter__sliderContainer">
        <input class="IFCSlideFilter__slider"
          type="range"
          :id="computedLowerSliderId"
          :name="lowerValueName"
          :value="lowerValue"
          :aria-labelledby="lowerValueLabelId"
          @input="eventHandler($event, 'input', true)"
          @change="eventHandler($event, 'change', true)"
        />
        <input class="IFCSlideFilter__slider"
          type="range"
          :id="computedUpperSliderId"
          :name="upperValueName"
          :value="upperValue"
          :aria-labelledby="upperValueLabelId"
          @input="eventHandler($event, 'input', false)"
          @change="eventHandler($event, 'change', false)"
        />
      </div>
      <input
        class="IFCSlideFilter__input"
        type="number"
        :id="computedRightId"
        :name="upperValueName"
        :value="upperValue"
        :max="max"
        :min="lowerValue"
        :aria-labelledby="upperValueLabelId"
        @input="eventHandler($event, 'input', false)"
        @change="eventHandler($event, 'change', false)"
      />
    </div>
  </div>
</template>
<script>
import { IFCScreenReaderText } from '@Components/Text/IFCScreenReaderText.vue';

export const IFCSlideFilter = {
  components: {
    IFCScreenReaderText,
  },
  props: {
    /**
     * The id for the data value
     */
    id: {
      type: String,
      default: null,
    },
    /**
     * The lower value of the slider
     */
    lowerValue: {
      type: Number,
      required: true,
    },
    /**
     * The upper value of the slider
     */
    upperValue: {
      type: Number,
      required: true,
    },
    /**
     * The minimum value allowed
     */
    min: {
      type: Number,
      required: true,
    },
    /**
     * The maximum value allowed
     */
    max: {
      type: Number,
      required: true,
    },
    /**
     * The step to increase by
     */
    step: {
      type: Number,
      default: 1,
    },
    /**
     * The name of the slider
     */
    name: {
      type: String,
      required: true,
    },
  },
  computed: {
    computedId() {
      /**
       * Disabled because _uid is a Vue internal variable. We have no control over it.
       */
      /* eslint-disable-next-line no-underscore-dangle */
      return this.id ?? `IFCSlideFilter-${this._uid}`;
    },
    computedName() {
      return this.name;
    },
    lowerValueName() {
      return `${this.computedName}-lower`;
    },
    upperValueName() {
      return `${this.computedName}-upper`;
    },
    computedLeftId() {
      return `${this.computedId}-left`;
    },
    computedRightId() {
      return `${this.computedId}-right`;
    },
    computedLowerSliderId() {
      return `${this.computedLeftId}-slider`;
    },
    computedUpperSliderId() {
      return `${this.computedRightId}-slider`;
    },
    visibleLabelId() {
      return `IFCNumberSliderLabel-${this.computedId}`;
    },
    lowerValueLabelId() {
      return `${this.visibleLabelId}-lower`;
    },
    upperValueLabelId() {
      return `${this.visibleLabelId}-upper`;
    },
  },
  methods: {
    eventHandler(event, eventType, isLower) {
      /**
       * Disabled because we need access to the event.target.value
       */
      /* eslint-disable no-param-reassign */
      let { value } = event.target;
      value = Number.parseInt(value, 10);
      if (isLower) {
        if (value >= this.upperValue) {
          value = this.upperValue - this.step;
          event.target.value = value;
          this.$forceUpdate();
        } else if (value < this.min) {
          value = this.min;
          event.target.value = value;
          this.$forceUpdate();
        }
      } else if (value <= this.lowerValue) {
        value = this.lowerValue + this.step;
        event.target.value = value;
        this.$forceUpdate();
      } else if (value > this.max) {
        value = this.max;
        event.target.value = value;
        this.$forceUpdate();
      }
      /**
       * Disabled because Visual Studio doesn't register that this expression does anything
       */
      /* eslint-disable-next-line no-unused-expressions */
      isLower
        ? this.$emit(eventType, {
          lowerValue: value,
          upperValue: this.upperValue,
        })
        : this.$emit(eventType, {
          lowerValue: this.lowerValue,
          upperValue: value,
        });
    }, /* eslint-enable no-param-reassign */
  },
};

export default IFCSlideFilter;
</script>

<style lang="scss">
@import './slideFilter.scss';
</style>
