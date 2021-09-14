<template>
  <form v-bind="$props" class="IFCForm">
    <slot></slot>
  </form>
</template>

<script>
export const IFCForm = {

};
export default IFCForm;
</script>

<style lang='scss'>
@import './form.scss';
</style>
