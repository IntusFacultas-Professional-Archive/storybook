<template>
  <div class="IFCTagEditorContainer">
    <IFCLabel :for="name">
      <slot name="label"></slot>
    </IFCLabel>
    <div class="IFCTagEditor">
      <button v-for="(tag, index) in value" :key="`${tag}-${index}`" class="IFCTagEditor__Tag" @click="remove(tag)">
        <IFCSpan>
          {{tag}}
        </IFCSpan>
      </button>
      <div class="IFCTagEditor__BackgroundCatcher" @click="captureFocus()"/>
      <input
        ref="input"
        :id="computedId"
        :value="inputValue"
        @focus="$emit('focus')"
        @blur="$emit('blur')"
        @input="handleInput($event)"/>
        <!--
          TODO: Add state (success and error) to this. You can crib notes from how I did it in IFCInput.

          TLDR:

          Add about 1 em of padding to the right side of IFCTagEditor class, then position absolute a container div
          on the right hand side in the 1 em of padding. Put display flex justify content center align items center
          on that container div and inside conditionally display the error and success SVG Vue SFCs that you can
          find in Input/icons.

          Add the state prop, and add the CSS to color the SVGs correctly, and you're done.
         -->
    </div>
    <slot name="microcopy">
      <IFCSpan>Type a comma to make a new entry</IFCSpan>
    </slot>
  </div>
</template>

<script>
import { IFCLabel } from '@Components/Text/IFCLabel.vue';
import { IFCSpan } from '@Components/Text/IFCSpan.vue';
import { StringReplaceAllPolyfill } from '@Components/StringReplaceAllPolyfill.js';

export const IFCTagEditor = {
  components: {
    IFCLabel,
    IFCSpan,
  },
  data() {
    return {
      inputValue: '',
    };
  },
  props: {
    /**
     * The name of the input. Used to generate the input label :for attribute as well.
     */
    name: {
      type: String,
      required: true,
    },

    /**
     * The id of the input. Used to generate the input label :for attribute as well.
     */
    id: {
      type: String,
      required: false,
    },

    /**
     * The list of tags
     */
    value: {
      type: Array,
      required: true,
      validator(value) {
        return !value.some((el) => typeof el !== 'string');
      },
    },
  },
  mounted() {
    StringReplaceAllPolyfill();
  },
  methods: {
    /**
     * @function remove
     * @param {String} tag the tag to remove
     * @listens onclick of buttons
     * @emits change
     */
    remove(tag) {
      this.$emit('change', this.value.slice().filter((t) => t !== tag));
    },

    /**
     * @function captureFocus
     * @listens onclick of focus capture element
     * The input itself isn't as large as the entire container, but the user "thinks" that the input is the size of
     * the entire visual container. We mimic this by capturing clicks on the background element, and focusing
     * the input when that click event occurs.
     */
    captureFocus() {
      const input = this.$refs?.input;
      if (typeof input !== 'undefined') {
        input.focus();
      }
    },

    /**
     * @function handleInput
     * @listens oninput of input
     * @emits change
     * @param {HTMLEvent} event the input event
     * Sets the inputValue and creates a new tag if a non empty string with , is found
     */
    handleInput(event) {
      const { value } = event.target;
      if (value.includes(',') && value.length > 1) {
        // new tag created.
        const [newTag, inputValue] = value.split(',');
        this.inputValue = inputValue;
        this.$emit('change', [...this.value, newTag]);
      } else {
        this.inputValue = value.replaceAll(',', '');
        this.$forceUpdate();
      }
    },
  },
  computed: {
    computedId() {
      return this.id ?? this.name;
    },
  },
};
export default IFCTagEditor;
</script>

<style lang="scss">
@import './tagEditor.scss';
</style>
