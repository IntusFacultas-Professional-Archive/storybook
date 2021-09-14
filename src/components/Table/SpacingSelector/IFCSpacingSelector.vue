<template>
  <div :class="computedContainerClass">
    <IFCButton
      class="IFCSpacingSelector__button"
      :class="computedClass"
      @click="clickOffDependantContainerOpen
        ? clickOffDependantContainerOpen = false : openClickOffDependantContainer()"
      variant="primary"
      title="Change table spacing"
      :height="40"
      :ref="`${nonCollapseRefPrefix}toggler`"
      circle
      >
      <IFCScreenReaderText>Change table spacing</IFCScreenReaderText>
      <LineHeight v-if='!clickOffDependantContainerOpen' />
      <Close v-else />
    </IFCButton>
    <div class="IFCSpacingSelector__dropdown"  :ref="`${nonCollapseRefPrefix}container`" >
      <IFCRadio
        v-for="size in sizes"
        :ref="`${nonCollapseRefPrefix}${size}`"
        :key="size"
        :name="`tablespacing-${_uid}`"
        :checked="value === size"
        :value="size"
        @change="$emit('sizing', size)">
        {{convertToTitleCase(size)}}
      </IFCRadio>
    </div>
  </div>
</template>

<script>

import { IFCScreenReaderText } from '@Components/Text/IFCScreenReaderText.vue';
import { convertToTitleCase } from '@Components/utils.js';
import IFCRadio from '@Components/Radio/IFCRadio.vue';
import { CollapseWhenOffClickedMixin } from '@Components/mixins.js';
import { IFCButton } from '@Components/Button/IFCButton.vue';
import LineHeight from '../icons/LineHeight.vue';
import Close from '../icons/Close.vue';

export const IFCSpacingSelector = {
  components: {
    LineHeight,
    Close,
    IFCButton,
    IFCRadio,
    IFCScreenReaderText,
  },
  data() {
    return {
      open: false,
      nonCollapseRefPrefix: 'sizing-',
    };
  },
  mixins: [CollapseWhenOffClickedMixin],
  props: {

    /**
     * What size is currently selected.
     */
    value: {
      type: String,
      required: true,
    },

    /**
     * An array of strings corresponding to the size options in the theme.
     */
    sizes: {
      type: Array,
      validator(value) {
        return !value.some((el) => typeof el !== 'string');
      },
    },
  },
  methods: {
    convertToTitleCase,
  },
  computed: {
    baseClass() {
      return 'IFCSpacingSelector';
    },
    computedContainerClass() {
      return {
        [`${this.baseClass}`]: true,
        [`${this.baseClass}--toggled`]: this.clickOffDependantContainerOpen,
      };
    },
    computedClass() {
      return {
        [`${this.baseClass}__button--toggled`]: this.open,
      };
    },
  },
};

export default IFCSpacingSelector;
</script>

<style lang='scss'>
@import './spacingSelector.scss';
</style>
