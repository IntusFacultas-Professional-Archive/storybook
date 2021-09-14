import Vue from 'vue';

export function recompute(vm, propName) {
  // handle non-existent props.
  if (!vm.$__recomputables || !vm.$__recomputables[propName]) {
    return;
  }

  /**
   * We have to modify the parameter since the paramter is the instance of the vue component calling this.
   */
  /* eslint-disable-next-line no-param-reassign */
  vm.$__recomputables[propName].backdoor += 1;
}

export function recomputable(fn, name) {
  const reactive = Vue.observable({
    backdoor: 0,
  });

  /**
   * We are intentionally using the func.call syntax here, so we need a traditional function
   */
  /* eslint-disable-next-line func-names */
  return function () {
    // initialize a map once.
    if (!this.$__recomputables) {
      this.$__recomputables = {};
    }

    // add a reference to my reactive backdoor trigger.
    if (!this.$__recomputables[fn.name || name]) {
      this.$__recomputables[fn.name || name] = reactive;
    }

    /**
     * Disabled because the point is to reference a reactive property to force recompute
     */
    /* eslint-disable-next-line no-unused-expressions */
    reactive.backdoor; // reference it!

    return fn.call(this);
  };
}
