<template>
  <th :class="computedClass" :style="computedStyle">
    <div class="IFCTableBorderManager" />
    <div :class="computedResizeableClass" :style="computedResizeableStyle" ref="content" @mouseup="clearStyling">
      <Pin v-if="pinnable || pinned"  :pinned="pinned" @pin="$emit('pin')"/>
      <button class='IFCTableCellButton'
        :aria-disabled="!interactive"
        @mouseover="interactive ? $emit('hover', $event) : ''"
        @click="interactive ? $emit('click', $event) : ''">
        <slot></slot>
      </button>
      <Sortable
        v-if="sortable"
        role="button"
        @click="$emit('sort')"
        :sortDirection="activelySorted ? sortDirection : 'descending'"
        :activated="activelySorted" />
    </div>
    <div class="IFCTableCell--externalcontent">
      <slot name="external-content"></slot>
    </div>
  </th>
</template>

<script>
import { Sortable } from '../icons/Sortable.vue';
import Pin from '../icons/Pin.vue';
import { cellMixin } from '../cellUtils.js';

export const IFCTableHeader = {
  components: {
    Pin,
    Sortable,
  },
  data() {
    return {
      type: 'header',
    };
  },
  mixins: [cellMixin],
  props: {

    /**
     * Whether this column can be sortable
     */
    sortable: {
      type: Boolean,
      default: false,
    },

    /**
     * Whether this column is the one actively being sorted.
     */
    activelySorted: {
      type: Boolean,
      default: false,
    },

    /**
     * What direction this sortable column is sorted. default descending. options 'descending', 'ascending'
     */
    sortDirection: {
      type: String,
      default: 'descending',
      validator(value) {
        return ['descending', 'ascending'].includes(value);
      },
    },

    /**
     * How top aligned this cell is when the user scrolls (this element is sticky)
     */
    top: {
      type: Number,
      default: -1,
    },
  },
};

export default IFCTableHeader;
</script>

<style lang="scss">
@import '../table.scss';
</style>
