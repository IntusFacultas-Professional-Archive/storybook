<template>
  <div class="IFCDropdown" ref="outsidecontainer">
    <div class="IFCDropdown__formContainer">
      <div
        :class="computedInputContainerClass"
        @keydown.down='focusNext(0, $event)'
        @keydown.up='focusNext(shownOptions.length - 1, $event)'
      >
        <div class="IFCDropdown__labelBorderContainer">
          <div :class="computedLeftBorderClass" />
          <div
            :class="computedLabelBorderClass"
            :style="computedLabelStyle"
            ref="labelContainer"
          >
            <label :id="computedLabelId" :for="computedName">
              <slot name="label"></slot>
              <span v-if="readonly">(Read only)</span>
            </label>
          </div>
          <div :class="computedRightBorderClass" />
          <div :class="computedSVGClass">
            <Correct v-if="state === SUCCESS"/>
            <Wrong v-else-if="state === ERROR"/>
          </div>
        </div>
        <Carat />
        <button
          v-for="(valueObj, index) in value"
          :class="computeSelectedClass(valueDisabledFn(valueObj, value))"
          type="button"
          role='button'
          data-selected="true"
          :key='`value-${calculateKey(index, valueObj)}`'
          :tabindex="valueDisabledFn(valueObj, value) ? -1 : false"
          @click="$emit('input', valueObj)"
          >
          <IFCScreenReaderText>Selected: </IFCScreenReaderText>
          <slot name="selected" :option='valueObj'>
            {{valueObj}}
          </slot>
        </button>
        <input class="IFCDropdown__input"
          ref="input"
          autocomplete="off"
          :name="name"
          :id="computedName"
          :aria-labelledby="computedAriaLabeledBy"
          v-model="searchText"
          :aria-expanded="focus"
          @focus="handleDropdownInputFocus()"
          @blur="handleDropdownInputBlur()"
          @keydown.esc="immediateBlur()"
          />
        <div class="IFCDropdown__backgroundCatcher" data-background='true' @click="captureFocus()"/>
      </div>
      <div class="IFCDropdown__svgContainer" :class="computedSVGClass">
        <Correct v-if="state === SUCCESS"/>
        <Wrong v-else-if="state === ERROR"/>
      </div>
    </div>
    <div
      v-show="focus"
      :tabindex="focus ? false : -1"
      :class="computedDropdownContainerClass"
      ref="dropdownmenu">
      <ul class="IFCDropdown__dropdown" >
          <li v-for="(option, index) in shownOptions" :key="calculateRef(index, option)">
            <button
              role="button"
              :class="computeDropdownButtonClass(optionSelectedFn(option, value), optionDisabledFn(option, value))"
              :tabindex="optionDisabledFn(option, value) ? -1 : false"
              data-dropdownoption="true"
              @focus="cancelBlur()"
              @keydown.down="focusNext(index + 1, $event)"
              @keydown.up="focusNext(index - 1, $event)"
              @keydown.esc="focus = false;"
              @blur="deferBlur()"
              @click="handleSelection(option)"
              type="button"
              :ref="calculateRef(index, option)">
            <IFCScreenReaderText v-if="optionSelectedFn(option, value)">Selected: </IFCScreenReaderText>
            <IFCScreenReaderText v-else>Press enter to: </IFCScreenReaderText>
            <slot name="option" :option="option">

            </slot>
          </button>
        </li>
        <li v-if='options.length === 0 || shownOptions.length === 0'>
          <button
            :class="computeDropdownButtonClass(false, true)"
            role="button"
            tabindex="-1"
          >{{ computeEmptyMessage(searchText, options.length, shownOptions.length)}}</button>
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
import Carat from '@Components/Dropdown/icons/Carat.vue';
import { SUCCESS, ERROR } from '@Components/Input/config.js';
import Correct from '@Components/Input/icons/Correct.vue';
import Wrong from '@Components/Input/icons/Wrong.vue';
import { FloatingLabelMixin } from '@Components/mixins.js';
import { IFCScreenReaderText } from '@Components/Text/IFCScreenReaderText.vue';
import { DropdownMixin } from './dropdownMixin.js';

export const IFCDropdown = {
  components: {
    Carat,
    Correct,
    Wrong,
    IFCScreenReaderText,
  },
  data() {
    return {
      focus: false,
      searchText: '',
      SUCCESS,
      ERROR,
      observer: null,
      blurId: null,
      currentlyFocused: 0,
      distanceFromBottom: 0,
      distanceFromTop: 0,
      menuSize: 0,
    };
  },
  mixins: [DropdownMixin, FloatingLabelMixin],
  methods: {

    /**
     * @function computeSelectedClass
     * Computes the class for each selected option
     */
    computeSelectedClass(disabled) {
      return {
        [`${this.baseClass}__selectedButton`]: true,
        [`${this.baseClass}__selectedButton--disabled`]: disabled,
      };
    },

    /**
     * @function computeDropdownButtonClass
     * Compute the class for each dropdown option
     */
    computeDropdownButtonClass(selected, disabled) {
      return {
        [`${this.baseClass}__button`]: true,
        [`${this.baseClass}__button--enabled`]: !disabled,
        [`${this.baseClass}__button--disabled`]: disabled,
        [`${this.baseClass}__button--selected`]: selected,
      };
    },

    /**
     * @function handleDropdownInputBlur
     * @see deferBlur
     * @see $emit
     * @listens onblur of input
     * @emits blur
     * closes the dropdown and emits focus
     */
    handleDropdownInputBlur() {
      this.deferBlur();
      this.$emit('blur');
    },

    /**
     * @function handleDropdownInputFocus
     * @see cancelBlur
     * @see checkPositionOnScreen
     * @see $emit
     * @listens onfocus of Input
     * @emits focus
     * Cancels blur, opens dropdown, and emits focus
     */
    handleDropdownInputFocus() {
      this.cancelBlur();
      this.checkPositionOnScreen();
      this.$emit('focus');
    },

    /**
     * @function handleSelection
     * @listens onclick of dropdown option
     * @emits input
     * Emits value for container component to use, and closes if closeAfterSeleciton set to true
     */
    handleSelection(option) {
      this.$emit('input', option);
      if (this.closeAfterSelection) {
        this.focus = false;
      }
    },

    /**
     * @function checkPositionOnScreen
     * @listens onfocus of input
     * Sets the distanceFromBottom variable to keep track of how far from the bottom of the viewport the searchbar
     */
    checkPositionOnScreen() {
      /**
       * This magic number exists because we have no easy way of determining the size of our internal dropdown options
       * but as the developer we roughly know the size. So in order to determine whether we have sufficient clearance
       * underneath, or whether we need to open above, we multiply our shownOptions length by the average element height
       * to get out needed size.
       */
      const AVERAGE_ELEMENT_SIZE = 40;
      if (typeof this?.$refs?.outsidecontainer?.getBoundingClientRect !== 'undefined') {
        this.distanceFromTop = this?.$refs?.outsidecontainer?.getBoundingClientRect()?.top;
      }
      this.distanceFromBottom = window.innerHeight - this.distanceFromTop;
      this.menuSize = this.shownOptions.length * AVERAGE_ELEMENT_SIZE;
    },

    /**
     * @function immediateBlur
     * @listens onescape of input or menu
     * Immediately closes the dropdown menu
     */
    immediateBlur() {
      this.$emit('blur');
      const input = this.$refs?.input;
      if (typeof input !== 'undefined') {
        input.blur();
      }
    },

    /**
     * @function calculateRef
     * @param {Number} index the index in the for loop
     * @param {Object} obj the object currently assigned to the iteration variable
     * @returns {String} ref
     * Used to generate refs for keys and manual html selection
     */
    calculateRef(index, obj) {
      return `option-${this.calculateKey(index, obj)}`;
    },

    /**
     * @function focusNext
     * @param {Number} index the index of the next item to loop
     * @param {Event} event the native event
     * @listens onkeyup
     * focuses the next menu button on key up or down
     */
    focusNext(index, event) {
      event.preventDefault();
      if (this.shownOptions.length === 0) {
        return -1;
      }
      let el = null;
      if (index === -1) {
        if (typeof this.$refs?.input !== 'undefined') {
          this.$refs?.input?.focus();
          return 1;
        }
        return 0;
      }
      el = index >= this.shownOptions.length
        ? this.$refs?.[this.calculateRef(0, this.shownOptions[0])]?.[0]
        : this.$refs?.[this.calculateRef(index, this.shownOptions[index])]?.[0];
      if (typeof el !== 'undefined') {
        el?.focus();
        return 1;
      }
      return 0;
    },

    /**
     * @function cancelBlur
     * @listens onfocus of other interactable elements of the dropdown
     * This is used to keep the dropdown open when the input loses focus but another dropdown element gets focused
     * therefore the user is still within the dropdown.
     */
    cancelBlur() {
      if (this.blurId) {
        clearTimeout(this.blurId);
      }
      this.focus = true;
    },

    /**
     * @function deferBlur
     * @listens onblur of input
     * The user could blur the input because they are moving to the dropdown, or because they are leaving the dropdown.
     * Since we can't know for certain which it is at the time of the blur, we defer the menu collapse long enough
     * for another dropdown element to cancel it should they capture focus.
     */
    deferBlur() {
      this.blurId = setTimeout(() => {
        this.focus = false;
      }, 100);
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
  },
  mounted() {
    setTimeout(() => {
      this.checkPositionOnScreen();
    }, 50);
  },
  props: {
    /**
     * When there are no options to display (either because you're loading the options asynchronously or
     * because the user's search returns no options, the dropdown will display a message to the user. This
     * function should return what that message should be. Keep in mind you'll have access to the parent component
     * scope in this function, which lets you access inFlight flags for AJAX requests. The function should accept 3
     * arguments: text, optionsLength, and shownOptionsLength). These map to
     *
     * text: the text the user searched
     *
     * optionsLength: the length of the options array passed to this component
     *
     * shownOptionsLength: the length of the shown options array passed to this component.
     *
     * These are the variables that this dropdown component will pass when calling this function
     */
    computeEmptyMessage: {
      type: Function,
      default: (text, optionsLength, shownOptionsLength) => {
        if (!optionsLength) {
          return 'No options to display';
        } if (!shownOptionsLength) {
          return 'No options match criteria';
        } if (text) {
          return 'Loading';
        }
        return 'Edge case';
      },
      validator(value) {
        return value.length >= 3;
      },
    },
  },
  computed: {
    /**
     * @function baseClass
     * The base css class
     */
    baseClass() {
      return 'IFCDropdown';
    },

    computedInputContainerClass() {
      return {
        [`${this.baseClass}__inputContainer`]: true,
        [`${this.baseClass}__inputContainer--focus`]: this.focus,
        [`${this.baseClass}__inputContainer--disabled`]: this.disabled,
        [`${this.baseClass}__inputContainer--${this.state}`]: this.state,
      };
    },

    computedDropdownContainerClass() {
      return {
        [`${this.baseClass}__dropdownContainer`]: true,
        [`${this.baseClass}__dropdownContainer--above`]: (
          this.menuSize > this.distanceFromBottom && this.menuSize < this.distanceFromTop
        ),
      };
    },

    /**
     * @function shownOptions
     * @see searchFn
     * @returns {Array}
     * What options match the searched for value.
     */
    shownOptions() {
      if (this.searchText) {
        return this.options.filter((option) => this.searchFn(this.searchText, option));
      }
      return this.options;
    },

    /**
     * @function fileld
     * @returns {Boolean}
     * Determines whether the label should be toggled above the content based on whether there is a value selected
     * or text searched.
     */
    filled() {
      return this.value.length !== 0 || Boolean(this.searchText);
    },

    /**
     * Computes the complete aria-labelled-by attribute
     */
    computedAriaLabeledBy() {
      const consumerProvidedAriaLabel = Array.isArray(this.ariaLabeledBy)
        ? this.ariaLabeledBy.join(' ') : this.ariaLabeledBy;
      return `${consumerProvidedAriaLabel ? `${consumerProvidedAriaLabel} ` : ''}${this.computedLabelId}`;
    },
    computedLabelId() {
      /**
       * Disabled next line because _uid is an internal variable of Vue, so we can't control the naming convention
       */
      /* eslint-disable-next-line no-underscore-dangle */
      return `label-${this.name}-${this._uid}`;
    },
    computedName() {
      /**
       * Disabled next line because _uid is an internal variable of Vue, so we can't control the naming convention
       */
      /* eslint-disable-next-line no-underscore-dangle */
      return this.id ? this.id : `${this.name}-${this._uid}`;
    },
  },
};
export default IFCDropdown;
</script>

<style lang="scss">
@import './dropdown.scss';
</style>
