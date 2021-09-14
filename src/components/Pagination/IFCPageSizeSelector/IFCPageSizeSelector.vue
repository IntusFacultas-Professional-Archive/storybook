<template>
  <div>
    <span class="IFCPageSizeSelectorText">Rows per page:</span>
    <select class="IFCPageSizeSelector" @change="$emit('change', Number($event.target.value))" :value="value">
      <option v-for="size in pageSizes" :value="size" :key="size">{{size}}</option>
    </select>
  </div>
</template>

<script>

export const IFCPageSizeSelector = {
  props: {
    /**
     * The current page size
     */
    value: {
      type: Number,
      required: true,
    },

    /**
     * The available page sizes
     */
    pageSizes: {
      type: Array,
      required: true,
      validator(value) {
        return !value.some((v) => Number.isNaN(Number(v)));
      },
    },
  },
};

export default IFCPageSizeSelector;
</script>

<style lang="scss">
@import './pageSizeSelector.scss';
</style>
