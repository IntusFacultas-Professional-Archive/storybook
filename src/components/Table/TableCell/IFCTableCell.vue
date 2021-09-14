<template>
  <td :class="computedClass" :style="computedStyle">
    <div class="IFCTableBorderManager" />
    <div :class="computedResizeableClass" :style="computedResizeableStyle" ref="content">
      <Pin v-if="pinnable || pinned" :pinned="pinned" @pin="$emit('pin')"/>
      <button class='IFCTableCellButton'
        :aria-disabled="!interactive"
        @mouseover="interactive ? $emit('hover', $event) : ''"
        @click="interactive ? $emit('click', $event) : ''">
        <slot></slot>
      </button>
    </div>
    <div class='IFCtablecell--externalcontent'>
      <slot name="external-content"></slot>
    </div>
  </td>
</template>

<script>
import Pin from '../icons/Pin.vue';
import { cellMixin } from '../cellUtils.js';

export const IFCTableCell = {
  components: {
    Pin,
  },
  mixins: [cellMixin],
};

export default IFCTableCell;
</script>

<style lang="scss">
@import '../table.scss';
</style>
