<script>
import Vue from "vue";
import TableOfContents from "./TableOfContents.vue";

export default Vue.extend({
  name: "ServeDev",
  components: {
    TableOfContents
  }
});
</script>

<template>
  <div id="app">
    <table-of-contents />
  </div>
</template>
