<template>
  <div class="IFCAlertContainer" :class="{'IFCAlertContainer--active': alerts.length}">
    <transition name="IFCAlertBackdrop">
      <div class="IFCAlertBackdrop" v-if="alerts.length" @click="cancelLast()"/>
    </transition>
    <div class="IFCAlertModalContainer">
      <transition-group name="IFCAlertModal">
        <IFCAlertModal
          v-for="(alert, index) in alerts"
          :alert="alert"
          :class="alertClasses[index]"
          @close="handleClose(alert)"
          :key="alert.id" />
      </transition-group>
    </div>
  </div>
</template>

<script>

import { IFCAlertModal } from './IFCAlertModal.vue';
import { EventName, EventNameCancel, EventNameRefocus } from './IFCAlertPlugin.js';

export const IFCAlert = {
  components: {
    IFCAlertModal,
  },
  data() {
    return {
      alertClasses: [[]],
      alerts: [],
    };
  },
  mounted() {
    window.addEventListener(EventName, this.detectPluginCall);
    window.addEventListener(EventNameCancel, this.detectPluginCancelCall);
  },
  beforeDestroy() {
    window.removeEventListener(EventName, this.detectPluginCall);
    window.removeEventListener(EventNameCancel, this.detectPluginCancelCall);
  },
  methods: {

    /**
     * @function detectPluginCancelCall
     * The consumer will use the plugin call to cancel an alert
     */
    detectPluginCancelCall(event) {
      this.alerts = this.alerts.filter((alert) => alert.id !== event.detail.id);
    },

    /**
     * @function detectPluginCall
     * The consumer will use the plugin call to call for more alerts.
     */
    detectPluginCall(event) {
      this.alerts.push(event.detail.alert);
    },

    /**
     * @function cancelLast
     * @listens onclick of backdrop
     * Cancels the last alert
     */
    cancelLast() {
      const lastAlert = this.alerts[this.alerts.length - 1];
      if (lastAlert.backgroundDismiss || lastAlert.backgroundDismiss === undefined) {
        this.alerts.pop();
      } else {
        this.$set(this.alertClasses, this.alerts.length - 1, ['IFCAlertModalShake']);

        // clicking the backdrop loses focus on the alert modal, we need to focus it again so we issue an event
        // that all alert modals listen for, with the detail being the id, so that only that alert modal calls
        // focusFirstElement
        const evt = new CustomEvent(EventNameRefocus, {
          detail: { id: this.alerts[this.alerts.length - 1].id },
        });
        window.dispatchEvent(evt);
        setTimeout(() => {
          // after the class finishes it's shake, we remove it
          this.$set(this.alertClasses, this.alerts.length - 1, []);
        }, 840);
      }
    },

    /**
     * @function handleClose
     * @param {Object} alert the alert to close
     * @listens onclose of alert
     * Closes a modal
     */
    handleClose(alert) {
      this.alerts = this.alerts.filter((a) => a.id !== alert.id);
      if (this.alerts.length > 0) {
        // We need to recapture focus for whatever alert was underneath, so we issue an event that the alert is
        // listening for that will trigger a recapture.
        const evt = new CustomEvent(EventNameRefocus, {
          detail: { id: this.alerts[this.alerts.length - 1].id },
        });
        window.dispatchEvent(evt);
      }
    },
  },
};
export default IFCAlert;
</script>

<style lang="scss">
@import './alert.scss';
</style>
