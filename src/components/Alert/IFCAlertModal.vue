<template>
  <div class="IFCAlertModal" :ref="focusCaptureRef" :class="`IFCAlertModal--${variant}`">
    <div :aria-live="'assertive'" class="IFCAlertModal__Content">
      <IFCSpan role="alert" :size="20" bold>
        {{title}}
      </IFCSpan>
      <IFCScreenReaderText role="alert" v-if="alert.autoclose !== undefined">
        This alert will auto-close in {{parseInt(alert.autoclose / 1000, 10)}} seconds
      </IFCScreenReaderText>
      <div v-if="Array.isArray(content)">
        <IFCParagraph
          role="alert"
          v-for="text in content"
          :key="text">
            {{text}}
        </IFCParagraph>
      </div>
      <IFCParagraph role="alert" v-else>{{content}}</IFCParagraph>
      <span v-if="html" v-html="html"></span>
      <IFCForm class="IFCAlertModal__Form" v-if="fields.length">
        <IFCInput
          v-for="field in fields"
          :type="field.type"
          :name="field.name"
          :value="fieldData[field.name]"
          @change="handleFieldChange($event, field)"
          @input="handleFieldChange($event, field)"
          state="default"
          :key="field.name"
          >
            <template v-slot:label>
              <span v-html="field.label"></span>
            </template>
        </IFCInput>
      </IFCForm>
      <div class="IFCAlertModal__ButtonGroup">
        <IFCButton
          v-for="(button, index) in buttons"
          :variant="button.variant"
          @click="handleButtonClick(button.action)"
          size="sm"
          :key="`button-${index}`">
            <span v-html="button.content"></span>
        </IFCButton>
      </div>
    </div>
    <div class="IFCAlertModal__AutocloseContainer" v-if="alert.autoclose !== undefined">
      <IFCSmall
        aria-hidden="true"
        role="presentation"
        >Auto-closing in {{timeoutRemaining}}
      </IFCSmall>
    </div>
  </div>
</template>

<script>
import { FocusCaptureMixin } from '@Components/mixins.js';
import { IFCSpan } from '@Components/Text/IFCSpan.vue';
import { IFCSmall } from '@Components/Text/IFCSmall.vue';
import { IFCScreenReaderText } from '@Components/Text/IFCScreenReaderText.vue';
import { IFCParagraph } from '@Components/Text/IFCParagraph.vue';
import { IFCButton } from '@Components/Button/IFCButton.vue';
import { IFCInput } from '@Components/Input/IFCInput.vue';
import { IFCForm } from '@Components/Form/IFCForm.vue';
import { EventNameRefocus } from './IFCAlertPlugin.js';

export const IFCAlertModal = {
  data() {
    return {
      focusCaptureRef: 'alert',
      fieldData: {},
      timeoutRemaining: 0,
      closed: false,
      timeoutId: null, // we have to track this to ensure this gets cancelled on manual cancel.
    };
  },
  components: {
    IFCSpan,
    IFCParagraph,
    IFCButton,
    IFCInput,
    IFCForm,
    IFCSmall,
    IFCScreenReaderText,
  },
  mixins: [FocusCaptureMixin],
  props: {
    /**
     * The alert this modal will display
     */
    alert: {
      type: Object,
      required: true,
    },
  },
  mounted() {
    document.addEventListener('keydown', this.captureFocus);
    window.addEventListener(EventNameRefocus, this.recaptureFocus);
    this.focusFirstElement();
    this.fields.forEach((field) => {
      const defaultValue = field.type === 'text' ? '' : 0;
      const value = field.value ?? defaultValue;
      this.$set(this.fieldData, field.name, value);
    });
    if (this.alert.autoclose !== undefined) {
      this.timeoutRemaining = parseInt(this.alert.autoclose / 1000, 10);
      this.handleAutoClose();
    }
  },
  beforeDestroy() {
    document.removeEventListener('keydown', this.captureFocus);
    window.removeEventListener(EventNameRefocus, this.recaptureFocus);
  },
  methods: {

    /**
     * @function recaptureFocus
     * @param {CustomEvent} event the event fired
     * When the user clicks on the backdrop, alert modals lose focus. We have no way of knowing that the backdrop
     * was clicked from this component, and we also have no way of knowing if we are the "most recent" modal (ergo
     * that we are on top), so we listen for an event that has the id of the most recent alert, and if that happens
     * to be us, then we recapture focus. The event fires on backdrop click.
     */
    recaptureFocus(event) {
      if (event.detail.id === this.alert.id) {
        this.focusFirstElement();
      }
    },

    /**
     * @function handleButtonClick
     * @param {Function} callback the callback the alert configuration specified for the button
     * @listens onclick of button
     * Calls the button callback and returns value
     */
    handleButtonClick(callback) {
      const result = callback(this.fieldData);
      if (!result) {
        // falsey response means we can close this
        if (this.timeoutId !== null) {
          clearTimeout(this.timeoutId);
        }
        this.$emit('close');
      }
    },

    handleAutoClose() {
      if (this.timeoutRemaining === 0) {
        this.closed = true;
        this.$emit('close');
      } else {
        this.timeoutRemaining -= 1;
        this.timeoutId = setTimeout(this.handleAutoClose, 1000);
      }
    },

    /**
     * @function convertValue
     * @param {String} value the value to convert
     * @param {Object} field the field the value is for
     * @returns {String,Number} the value coerced into the appropriate value type
     */
    convertValue(value, field) {
      if (field.type === 'number' && typeof value === 'string') {
        return value.includes('.') ? parseFloat(value) : parseInt(value, 10);
      }
      return value;
    },

    /**
     * @function handleFieldChange
     * @param {String} value the value from the input event
     * @param {Object} field the field the input is for
     * @see convertValue
     * @listens oninput,onchange of inputs
     * Updates field data
     */
    handleFieldChange(value, field) {
      this.$set(
        this.fieldData, field.name,
        this.convertValue(value, field),
      );
    },
  },
  computed: {
    /**
     * Provide a sane default if the alert lacks a title
     */
    title() {
      return this.alert.title ?? 'Alert';
    },

    /**
     * Provide a sane default for the alert variant
     */
    variant() {
      return this.alert.variant ?? 'default';
    },

    /**
     * Provide a sane default if the alert lacks fields and omit malformed fields
     */
    fields() {
      return (this.alert.fields ?? []).filter(
        (field) => field.type !== undefined && field.label !== undefined && field.name !== undefined,
      );
    },

    /**
     * Provide a sane default if the alert lacks content
     */
    content() {
      return this.alert.content ?? '';
    },

    /**
     * Provide a sane default if the alert lacks html content
     */
    html() {
      return this.alert.html ?? false;
    },

    /**
     * Provides a sane default if the alert lacks buttons
     */
    buttons() {
      return this.alert.buttons ?? [{
        variant: 'primary',
        action() {},
        content: 'Close',
      }];
    },

  },
};

export default IFCAlertModal;

</script>
