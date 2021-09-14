<template>
  <div class="IFCCard">
    <div class="IFCCard__titleArea" :style="computedStyle">
      <slot name="title"> </slot>
    </div>
    <div class="IFCCard__imageArea">
      <slot name="image"> </slot>
    </div>
    <div class="IFCCard__contentArea">
      <slot name="body"> </slot>
    </div>
    <div class="IFCCard__buttonArea" v-if="containsButtons">
      <IFCButtonGroup>
        <slot name="buttons"> </slot>
      </IFCButtonGroup>
    </div>
  </div>
</template>

<script>
import { IFCButton } from '@Components/Button/IFCButton.vue';
import { IFCButtonGroup } from '@Components/Button/IFCButtonGroup.vue';
import { StringReplaceAllPolyfill } from '@Components/StringReplaceAllPolyfill.js';

export const IFCCard = {
  components: {
    IFCButton,
    IFCButtonGroup,
  },
  mounted() {
    StringReplaceAllPolyfill();
  },
  props: {
    /**
     * How to justify the title
     */
    justify: {
      type: String,
      default: 'center',
    },

    /**
     * Whether to hide the button slot section
     */
    containsButtons: {
      type: Boolean,
      default: true,
    },
  },
  computed: {
    computedStyle() {
      return {
        '--IFC-card-title-justify': this.justify,
      };
    },
  },
};

export default IFCCard;
</script>

<style lang="scss">
@import "./card.scss";
</style>
