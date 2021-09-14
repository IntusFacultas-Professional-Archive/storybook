<template>
  <div :class="computedModalClass" :aria-hidden="!visible" :hidden="!visible">
    <transition name="IFCModalBackdrop">
      <div class="IFCModal__backdrop" v-if="visible" @click="handleBackdropClick()" />
    </transition>
    <transition name="IFCModal">
      <div
          v-if="visible"
          role="dialog"
          class="IFCModal__modal"
          :ref="focusCaptureRef"
          :style="computedStyleClass"
          :aria-labelledby="`${modalDescriptionId}`"
          >
        <IFCScreenReaderText :id="modalDescriptionId">
          {{modalDescription}}
        </IFCScreenReaderText>
        <div class="IFCModal__section IFCModal__header" v-if="!hideHeader">
          <slot name="header">
            <div class="IFCModal__titleContainer">
              <h1 class="IFCModal__title" >
                {{title}}
              </h1>
              <IFCButton variant="transparent" class="IFCModal__closeButton"  @click="handleClose()">
                <IFCScreenReaderText>Close Modal</IFCScreenReaderText>
                <Close />
              </IFCButton>
            </div>
          </slot>
        </div>
        <div class="IFCModal__section IFCModal__body">
          <slot></slot>
        </div>
        <div class="IFCModal__section IFCModal__footer" v-if='!hideFooter'>
          <slot name="footer"></slot>
        </div>
      </div>
    </transition>
  </div>
</template>

<script>
import { IFCScreenReaderText } from '@Components/Text/IFCScreenReaderText.vue';
import { FocusCaptureMixin } from '@Components/mixins.js';
import { IFCButton } from '@Components/Button/IFCButton.vue';
import Close from './icons/Close.vue';
import { generateId } from './utils.js';

export const IFCModal = {
  components: {
    IFCButton,
    IFCScreenReaderText,
    Close,
  },
  data() {
    return {
      visible: false,
      focusCaptureRef: 'modalcontainer',
    };
  },
  mixins: [FocusCaptureMixin],
  watch: {
    show() {
      this.updateVisibleBasedOnProp();
    },
  },
  props: {
    /**
     * The id of this modal, used for toggling with the plugin
     */
    id: {
      type: String,
      required: true,
    },

    /**
     * The title of the modal
     */
    title: {
      type: String,
      default: '',
    },

    /**
     * Allow background dismiss if letting the modal handle its own hiding
     */
    allowBackgroundDismiss: {
      type: Boolean,
      default: true,
    },

    /**
     * Override for showing the modal. this makes allowBackgroundDismiss do nothing.
     */
    show: {
      type: Boolean,
      default: null,
    },

    /**
     * Max width of the modal
     */
    maxWidth: {
      type: String,
      default: '500px',
    },

    /**
     * Whether to hide the header
     */
    hideHeader: {
      type: Boolean,
      default: false,
    },

    /**
     * Whether to hide the footer
     */
    hideFooter: {
      type: Boolean,
      default: false,
    },

    /**
     * The description of the modal for screen readers
     */
    modalDescription: {
      type: String,
      required: true,
    },

    /**
     * What the modal is labeled by (usually the title)
     */
    ariaLabeledBy: {
      type: String,
      default: null,
    },
  },
  mounted() {
    this.updateVisibleBasedOnProp();
    window.addEventListener(generateId(this.id), this.detectPluginCall);
  },
  beforeDestroy() {
    window.removeEventListener(generateId(this.id), this.detectPluginCall);
  },
  methods: {
    /**
     * @function detectPluginCall
     * If the consumer uses the plugin to toggle the modal state, we capture it here
     */
    detectPluginCall(event) {
      this.visible = event.detail.modal;
      if (this.visible) {
        this.$nextTick(() => {
          this.focusFirstElement();
          document.addEventListener('keydown', this.captureFocus);
        });
      }
    },

    /**
     * @function handleClose
     * @emits toggle
     * if show is not set, toggles the visibility state, removes capturefocus event listener,
     * else emits toggle
     */
    handleClose() {
      if (this.show !== null) {
        this.$emit('toggle');
      } else {
        this.visible = !this.visible;
        document.removeEventListener('keydown', this.captureFocus);
      }
    },

    /**
     * @function handleBackdropClick
     * @see handleClose
     * if allowBackgroundDismiss is set to true, calls handleClose
     */
    handleBackdropClick() {
      if (this.allowBackgroundDismiss) {
        this.handleClose();
      }
    },

    /**
     * @function updateVisibleBasedOnProp
     * @see focusFirstElement
     * @see captureFocus
     * If show changes and isn't null, we update visibility to match, call focusFirstElement
     * and add captureFocus as an event listener for keydown
     */
    updateVisibleBasedOnProp() {
      if (this.show !== null) {
        this.visible = this.show;
        if (this.visible) {
          this.$nextTick(() => {
            this.focusFirstElement();
            document.addEventListener('keydown', this.captureFocus);
          });
        }
      }
    },
  },
  computed: {
    baseClass() {
      return 'IFCModal';
    },
    computedModalClass() {
      return {
        [this.baseClass]: true,
        [`${this.baseClass}--hidden`]: !this.visible,
      };
    },
    computedStyleClass() {
      return {
        'max-width': this.maxWidth,
      };
    },

    /**
     * The id for the modal description
     */
    modalDescriptionId() {
      /**
       * Disabled because we don't control uid's naming
       */
      /* eslint-disable-next-line no-underscore-dangle */
      return `modal-description-${this._uid}`;
    },
  },
};

export default IFCModal;
</script>

<style lang="scss">
@import './modal.scss';
</style>
