<template>
  <div class="IFCTablePin">
    <button
      :class="computedClass"
      role="button"
      @click="$emit('pin')"
      title='Horizontally pin this column'>
      <IFCScreenReaderText>
        Horizontally Pin this column
      </IFCScreenReaderText>
      <svg
        height="16px"
        viewBox="0 0 24 24"
        width="16px"
        >
          <path d="M16.729,4.271c-0.389-0.391-1.021-0.393-1.414-0.004c-0.104,0.104-0.176,0.227-0.225,0.355  c-0.832,1.736-1.748,2.715-2.904,3.293C10.889,8.555,9.4,9,7,9C6.87,9,6.74,9.025,6.618,9.076C6.373,9.178,6.179,9.373,6.077,9.617  c-0.101,0.244-0.101,0.52,0,0.764c0.051,0.123,0.124,0.234,0.217,0.326l3.243,3.243L5,20l6.05-4.537l3.242,3.242  c0.092,0.094,0.203,0.166,0.326,0.217C14.74,18.973,14.87,19,15,19s0.26-0.027,0.382-0.078c0.245-0.102,0.44-0.295,0.541-0.541  C15.974,18.26,16,18.129,16,18c0-2.4,0.444-3.889,1.083-5.166c0.577-1.156,1.556-2.072,3.293-2.904  c0.129-0.049,0.251-0.121,0.354-0.225c0.389-0.393,0.387-1.025-0.004-1.414L16.729,4.271z"/>
      </svg>
    </button>
  </div>
</template>

<script>
import { IFCScreenReaderText } from '@Components/Text/IFCScreenReaderText.vue';

export const Pin = {
  components: {
    IFCScreenReaderText,
  },
  props: {
    pinned: {
      type: Boolean,
      default: false,
    },
  },
  computed: {
    baseClass() {
      return 'IFCTablePin__button';
    },
    computedClass() {
      return {
        [this.baseClass]: true,
        [`${this.baseClass}--pinned`]: this.pinned,
      };
    },
  },
};
export default Pin;
</script>

<style lang='scss'>
@import './pin.scss';
</style>
