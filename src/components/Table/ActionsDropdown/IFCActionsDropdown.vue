<template>
  <IFCButton variant="transparent" v-if="actions.length === 1" @click="$emit('action', actions[0])">
    {{actions[0]}}
  </IFCButton>
  <div class="IFCActionsDropdown" v-else>
    <IFCButton variant="transparent"
      @click="clickOffDependantContainerOpen ? clickOffDependantContainerOpen = false : openContainer()"
      :ref="computeRef('open')">
      <IFCScreenReaderText>Select to view </IFCScreenReaderText>
      Actions
    </IFCButton>
    <div
      class="IFCActionsDropdown__container"
      :style="computedStyle"
      v-show="clickOffDependantContainerOpen"
      :ref="computeRef('container')">
      <IFCButton variant="transparent"
        v-for="action in actions"
        :key="action"
        :ref="computeRef(action)"
        @click="handleDropdownActionClick(action)"
        @blur="actions.indexOf(action) === actions.length - 1 ? clickOffDependantContainerOpen = false : ''">
          {{action}}
      </IFCButton>
    </div>
  </div>
</template>

<script>
import { IFCButton } from '@Components/Button/IFCButton.vue';
import { IFCScreenReaderText } from '@Components/Text/IFCScreenReaderText.vue';
import { CollapseWhenOffClickedMixin } from '@Components/mixins.js';
import { saneDefault } from '@Components/utils.js';

export const IFCActionsDropdown = {
  data() {
    return {
      nonCollapseRefPrefix: 'actionbutton-',
      style: {},
    };
  },
  mixins: [CollapseWhenOffClickedMixin],
  props: {
    /**
     * An array of strings that describe verbs the user can take
     */
    actions: {
      type: Array,
      validator(value) {
        return !value.some((v) => typeof v !== 'string');
      },
      required: true,
    },
  },
  components: {
    IFCButton,
    IFCScreenReaderText,
  },
  methods: {
    /**
     * @function handleDropdownActionClick
     * @param {String} action the action clicked
     * @emits action
     * @listens onclick of dropdown action
     */
    handleDropdownActionClick(action) {
      this.$emit('action', action);
      this.clickOffDependantContainerOpen = false;
    },

    /**
     * @function computeRef
     * @param {String} action the action to compute the ref
     * @returns {String}
     * Computes the ref for the interactive elements
     */
    computeRef(action) {
      return `${this.nonCollapseRefPrefix}${action}`;
    },

    /**
     * @function computeOffset
     * Computes the left offset to ensure that an action menu on the left side of the screen doesn't collide
     * with the edge of the screen
     */
    computeOffset() {
      const element = this.$refs[this.computeRef('container')];
      const { left } = element.getBoundingClientRect();
      this.style = {};
      if (left < element.offsetWidth) {
        this.style.left = 0;
      }
    },

    /**
     * @function openContainer
     * @see openClickOffDependantContainer
     * @see computeOffset
     * @listens onclick of dropdown button toggle
     * Opens the dropdown input container
     */
    openContainer() {
      const callback = () => {
        this.$nextTick(() => {
          this.computeOffset();
          const el = this.$refs[this.computeRef(this.actions[0])]?.[0]?.$el ?? { focus: saneDefault };
          el.focus();
        });
      };
      this.openClickOffDependantContainer(callback);
    },
  },
  computed: {
    computedStyle() {
      return this.style;
    },
  },
};

export default IFCActionsDropdown;
</script>

<style lang="scss">
@import './actionsDropdown.scss';
</style>
