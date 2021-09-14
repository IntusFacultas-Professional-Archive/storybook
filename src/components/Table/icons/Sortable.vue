<template>
  <button
    :class="computedClass"
    @click="$emit('click')"
    role="button"
    :title="`Column sorted by ${sortDirection}. Toggle to switch`">
    <IFCScreenReaderText>
      Column sorted by {{sortDirection}}. Toggle to switch.
    </IFCScreenReaderText>
    <svg height="18" width="18" viewBox="0 0 1024 767.5"><path d="M0 384l383.75 383.75L767.5 384H0z"/></svg>
  </button>
</template>

<script>
import { IFCScreenReaderText } from '@Components/Text/IFCScreenReaderText.vue';

export const Sortable = {
  components: {
    IFCScreenReaderText,
  },
  props: {
    activated: {
      type: Boolean,
      default: false,
    },
    sortDirection: {
      type: String,
      default: 'descending',
    },
  },
  computed: {
    baseClass() {
      return 'IFCTableSortable';
    },
    computedClass() {
      return {
        [this.baseClass]: true,
        [`${this.baseClass}--activated`]: this.activated,
        [`${this.baseClass}--ascending`]: this.sortDirection === 'ascending',
      };
    },
  },
};
export default Sortable;
</script>

<style lang='scss'>
@import './sortable.scss';
</style>
