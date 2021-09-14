<template>
  <content-container ref="content">
    <vue-input
      :label="label"
      input-type="Date"
      :label-flavor="textFlavor"
      :name="name"
      :value="internalDate ? internalDate.format('YYYY-MM-DD') : ''"
      @focus="open()"
      @input="handleManualInput"
      @change="confirmOrCancelManualInput"
      @blur="confirmOrCancelManualInput"
      ref="input"
      :data-datepicker="name"
    ></vue-input>
    <date-picker-container
      :data-datepicker="name"
      v-if="selectingDay && (show || debug)"
      ref="daypicker"
      :top="calculatedTop"
    >
      <selector-bar :data-datepicker="name">
        <increment-decrement
          :data-datepicker="name"
          @click="decrementCursorDate(1, 'month')"
          >&#10094;</increment-decrement
        >
        <month-picker :data-datepicker="name" @click="toggleMonth">
          {{ shownMonth.month }}
        </month-picker>
        <increment-decrement
          :data-datepicker="name"
          @click="incrementCursorDate(1, 'month')"
          >&#10095;</increment-decrement
        >
      </selector-bar>

      <calendar :data-datepicker="name">
        <tbody :data-datepicker="name" v-if="cursorDate">
          <tr>
            <td>Su</td>
            <td>Mo</td>
            <td>Tu</td>
            <td>We</td>
            <td>Th</td>
            <td>Fr</td>
            <td>Sa</td>
          </tr>
          <tr
            :data-datepicker="name"
            v-for="(week, index) in shownMonth.dates"
            :key="index"
          >
            <day
              :data-datepicker="name"
              v-for="(day, dayIndex) in week"
              :in-month="
                day.month() == cursorDate.month() &&
                  day.year() == cursorDate.year()
              "
              :disabled="testDisabled(day)"
              @click="
                setCursorDate(day, 'day');
                setInternalDate(day);
              "
              @keyup.space="
                setCursorDate(day, 'day');
                setInternalDate(day);
              "
              @keyup.enter="
                setCursorDate(day, 'day');
                setInternalDate(day);
              "
              :current="
                currentDate.month() == day.month() &&
                  currentDate.year() == day.year() &&
                  currentDate.date() == day.date()
              "
              :active="
                internalDate
                  ? internalDate.month() == day.month() &&
                    internalDate.year() == day.year() &&
                    internalDate.date() == day.date()
                  : false
              "
              :key="dayIndex"
              role="button"
              :tabindex="selectingDay && (show || debug) ? 0 : -1"
              >{{ day.format("D") }}</day
            >
          </tr>
          <tr>
            <day
              :tabindex="selectingDay && (show || debug) ? 0 : -1"
              @click="
                setCursorDate(currentDate, 'day');
                setInternalDate(currentDate);
              "
              @keyup.space="
                setCursorDate(currentDate, 'day');
                setInternalDate(currentDate);
              "
              @keyup.enter="
                setCursorDate(currentDate, 'day');
                setInternalDate(currentDate);
              "
              :in-month="true"
              :disabled="testDisabled(currentDate)"
              colspan="7"
              >Today</day
            >
          </tr>
          <tr>
            <day
              :tabindex="selectingDay && (show || debug) ? 0 : -1"
              @click="
                setCursorDate(currentDate, 'day');
                setInternalDate(null);
              "
              @keyup.space="
                setCursorDate(currentDate, 'day');
                setInternalDate(null);
              "
              @keyup.enter="
                setCursorDate(currentDate, 'day');
                setInternalDate(null);
              "
              :in-month="true"
              :disabled="false"
              v-if="showClear"
              colspan="7"
              >Clear</day
            >
          </tr>
        </tbody>
      </calendar>
    </date-picker-container>
    <date-picker-container
      ref="monthpicker"
      class="monthpicker"
      :data-datepicker="name"
      v-else-if="selectingMonth && (show || debug)"
    >
      <selector-bar :data-datepicker="name">
        <increment-decrement
          :data-datepicker="name"
          @click="decrementCursorDate(1, 'year')"
          >&#10094;</increment-decrement
        >
        <month-picker :data-datepicker="name" @click="toggleYear">
          {{ shownYear.year }}
        </month-picker>
        <increment-decrement
          :data-datepicker="name"
          @click="incrementCursorDate(1, 'year')"
          >&#10095;</increment-decrement
        >
      </selector-bar>
      <calendar :data-datepicker="name" class="monthpicker__table">
        <tbody :data-datepicker="name" v-if="cursorDate">
          <tr
            :data-datepicker="name"
            v-for="(monthChunk, index) in shownYear.months"
            :key="index"
          >
            <month-or-year
              :data-datepicker="name"
              v-for="(month, monthIndex) in monthChunk"
              :current="
                currentDate.month() == month.value &&
                  currentDate.year() == shownYear.year
              "
              :active="
                internalDate
                  ? internalDate.month() == month.value &&
                    internalDate.year() == shownYear.year
                  : false
              "
              :key="monthIndex"
              role="button"
              :tabindex="selectingMonth && (show || debug) ? 0 : -1"
              @click="
                setCursorDate(month.value, 'month');
                toggleDay();
              "
              @keyup.space="
                setCursorDate(month.value, 'month');
                toggleDay();
              "
              @keyup.enter="
                setCursorDate(month.value, 'month');
                toggleDay();
              "
              >{{ month.display }}</month-or-year
            >
          </tr>
          <tr>
            <day
              :tabindex="selectingMonth && (show || debug) ? 0 : -1"
              @click="
                setCursorDate(currentDate, 'day');
                setInternalDate({
                  clone() {
                    return null;
                  },
                });
              "
              @keyup.space="
                setCursorDate(currentDate, 'day');
                setInternalDate({
                  clone() {
                    return null;
                  },
                });
              "
              @keyup.enter="
                setCursorDate(currentDate, 'day');
                setInternalDate({
                  clone() {
                    return null;
                  },
                });
              "
              :in-month="true"
              :disabled="false"
              v-if="showClear"
              colspan="7"
              >Clear</day
            >
          </tr>
        </tbody>
      </calendar>
    </date-picker-container>
    <date-picker-container
      :data-datepicker="name"
      v-else-if="selectingYear && (show || debug)"
      ref="yearpicker"
      class="yearpicker"
    >
      <selector-bar :data-datepicker="name">
        <increment-decrement
          :data-datepicker="name"
          @click="decrementCursorDate(10, 'year')"
          >&#10094;</increment-decrement
        >
        <year-picker :data-datepicker="name">
          {{ shownYears.range }}
        </year-picker>
        <increment-decrement
          :data-datepicker="name"
          @click="incrementCursorDate(10, 'year')"
          >&#10095;</increment-decrement
        >
      </selector-bar>
      <calendar :data-datepicker="name" class="yearpicker__table">
        <tbody :data-datepicker="name" v-if="cursorDate">
          <tr
            :data-datepicker="name"
            v-for="(yearChunk, index) in shownYears.years"
            :key="index"
          >
            <month-or-year
              :data-datepicker="name"
              v-for="(year, yearIndex) in yearChunk"
              :current="currentDate.year() == year"
              :active="internalDate ? internalDate.year() == year : false"
              :key="yearIndex"
              role="button"
              :tabindex="selectingYear && (show || debug) ? 0 : -1"
              @click="
                setCursorDate(year, 'year');
                toggleMonth();
              "
              @keyup.space="
                setCursorDate(year, 'year');
                toggleMonth();
              "
              @keyup.enter="
                setCursorDate(year, 'year');
                toggleMonth();
              "
              >{{ year }}</month-or-year
            >
          </tr>
          <tr>
            <day
              :tabindex="selectingYear && (show || debug) ? 0 : -1"
              @click="
                setCursorDate(currentDate, 'day');
                setInternalDate({
                  clone() {
                    return null;
                  },
                });
              "
              @keyup.space="
                setCursorDate(currentDate, 'day');
                setInternalDate({
                  clone() {
                    return null;
                  },
                });
              "
              @keyup.enter="
                setCursorDate(currentDate, 'day');
                setInternalDate({
                  clone() {
                    return null;
                  },
                });
              "
              :in-month="true"
              :disabled="false"
              v-if="showClear"
              colspan="7"
              >Clear</day
            >
          </tr>
        </tbody>
      </calendar>
    </date-picker-container>
  </content-container>
</template>

<script>
import moment from "moment";
import styled from "vue-styled-components";
import { VueInput } from "@IntusFacultas/input";
import Theme from "@IntusFacultas/design-system";
const SATURDAY = 6;
const SUNDAY = 0;
const props = {
  active: {
    type: Boolean,
    default: false,
  },
  disabled: {
    type: Boolean,
    default: false,
  },
  inMonth: {
    type: Boolean,
    default: false,
  },
  current: {
    type: Boolean,
    default: false,
  },
  top: {
    type: String,
    default: "inherit",
  },
  defaultTheme: {
    type: Object,
    default() {
      return Theme;
    },
  },
};
const SelectorBar = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  text-align: center;
  width: 100%;
  & * {
    font-size: 16px;
  }
`;
const MonthPicker = styled.button`
  background-color: white;
  width:240px
  border: 1px solid white;
  border-radius: 4px;
  cursor: pointer;
  padding: 4px 0px;
  &:hover {
    background-color: #eee;
  }
  transition: color .1s ease-in-out,
            background-color .1s ease-in-out,
            border-color .1s ease-in-out,
            box-shadow .1s ease-in-out;
`;
const YearPicker = styled.span`
  background-color: white;
  width:240px
  border: 1px solid white;
  border-radius: 4px;
  padding: 4px 0px;
`;
const IncrementDecrement = styled.button`
  background-color: white;
  border: 1px solid white;
  border-radius: 4px;
  cursor: pointer;
  text-align: center;
  padding: 4px 16px;
  &:hover {
    background-color: #eee;
  }
  transition: color 0.1s ease-in-out, background-color 0.1s ease-in-out,
    border-color 0.1s ease-in-out, box-shadow 0.1s ease-in-out;
`;
const ContentContainer = styled.div`
  position: relative;
`;
const DatePickerContainer = styled("div", props)`
  width: 280px;
  position: absolute;
  padding: 10px 10px;
  border-radius: 4px;
  background-color: white;
  top: ${(props) => props.top};
  & * {
    font-family: "Open Sans Regular", -apple-system, BlinkMacSystemFont,
      "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif,
      "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol";
    user-select: none;
  }
  z-index: 1000;
  box-shadow: 0px 8px 8px 2px #e4e4e4;
`;
const MonthOrYear = styled("td", props)`
  ${(props) =>
    props.active
      ? `
        color: ${props.defaultTheme.Primary.color.color}
        background-color: ${props.defaultTheme.Primary.background.color}
        &:hover {
          background-color: ${props.defaultTheme.Primary.background.hover};
        }
      `
      : props.current
      ? `
        background-color: #ddd;
        &:hover {
          background-color: #eee;
        }
      `
      : `
  &:hover {
    background-color: #eee;
  }`}
  padding: 5px 10px;
  transition: color 0.1s ease-in-out, background-color 0.1s ease-in-out,
    border-color 0.1s ease-in-out, box-shadow 0.1s ease-in-out;
  cursor: pointer;
  border-radius: 4px;
`;
const Day = styled("td", props)`
  ${(props) => (props.inMonth ? `` : `color: #b8b8b8;`)}
  ${(props) =>
    props.active
      ? `
        color: ${props.defaultTheme.Primary.color.color}
        background-color: ${props.defaultTheme.Primary.background.color}
        &:hover {
          background-color: ${props.defaultTheme.Primary.background.hover};
        }
      `
      : props.current
      ? `
        background-color: #ddd;
        &:hover {
          background-color: #eee;
        }
      `
      : `
  &:hover {
    background-color: #eee;
  }`}
  cursor: pointer;
  ${(props) =>
    props.disabled
      ? `pointer-events: none; color: #f0f0f0; cursor: not-allowed;`
      : ``}
  transition: color 0.1s ease-in-out, background-color 0.1s ease-in-out,
    border-color 0.1s ease-in-out, box-shadow 0.1s ease-in-out;
  border-radius: 4px;
`;
const Calendar = styled.table`
  width: 100%;
  text-align: center;
`;
export const DatePicker = {
  components: {
    VueInput,
    DatePickerContainer,
    IncrementDecrement,
    MonthPicker,
    SelectorBar,
    Calendar,
    Day,
    MonthOrYear,
    YearPicker,
    ContentContainer,
  },
  data() {
    return {
      correctOnBlur: false,
      debounceCorrection: null,
      lastManualInput: null,
      show: false,
      selectingDay: true,
      selectingMonth: false,
      selectingYear: false,
      cursorDate: null,
      currentDate: null,
      calculatedTop: "initial",
      internalDate: null,
      shownMonth: {
        month: "Loading",
        dates: [],
      },
      shownYear: {
        year: "Loading",
        months: [],
      },
      shownYears: {
        range: "Loading",
        years: [],
      },
    };
  },
  watch: {
    value(newVal, oldVal) {
      if (newVal != null) {
        if (!moment(newVal).isSame(this.internalDate)) {
          this.internalDate = moment(newVal);
          this.cursorDate = this.internalDate;
        }
      } else {
        this.internalDate = null;
      }
    },
    start(newVal, oldVal) {
      if (oldVal == null || !moment(newVal).isSame(oldVal)) {
        this.validateStartEnd();
      }
    },
    end(newVal, oldVal) {
      if (oldVal == null || !moment(newVal).isSame(oldVal)) {
        this.validateStartEnd();
      }
    },
  },
  beforeDestroy() {
    document.removeEventListener("click", this.handleClick, { passive: true });
  },
  mounted() {
    Element.prototype.closestDatePicker = function(name) {
      var el = this;
      var ancestor = this;
      if (!document.documentElement.contains(el)) return null;
      do {
        if (ancestor.getAttribute("data-datepicker") == name) return ancestor;
        ancestor = ancestor.parentElement;
      } while (ancestor !== null);
      return null;
    };
    this.internalDate = moment(this.value);
    if (!this.internalDate.isValid()) {
      this.internalDate = null;
      this.cursorDate = moment();
    } else {
      this.cursorDate = this.internalDate.clone();
    }
    this.currentDate = moment();
    this.validateStartEnd();
    this.updateShownValues();
    document.addEventListener("click", this.handleClick, { passive: true });
  },
  props: {
    label: {
      type: String,
      default: "Select a date",
    },
    debug: {
      type: Boolean,
      default: false,
    },
    showClear: {
      type: Boolean,
      default: true,
    },
    textFlavor: {
      type: String,
      default: "Normal",
    },
    name: {
      type: String,
      required: true,
    },
    defaultNow: {
      type: Boolean,
      default: true,
    },
    start: {
      type: [Object, String, Date, moment],
      default() {
        return null;
      },
    },
    end: {
      type: [Object, String, Date, moment],
      default() {
        return null;
      },
    },
    disabledDates: {
      type: Array,
      default() {
        return [];
      },
    },
    value: {
      type: [Object, String, Date, moment],
      default() {
        return new Date();
      },
    },
  },
  computed: {
    computedStart() {
      if (this.start) {
        return moment(this.start);
      }
      return null;
    },
    computedEnd() {
      if (this.end) {
        return moment(this.end);
      }
      return null;
    },
  },
  methods: {
    confirmOrCancelManualInput() {
      const self = this;
      if (self.debounceCorrection) {
        clearTimeout(self.debounceCorrection);
      }
      self.debounceCorrection = setTimeout(() => {
        if (self.correctOnBlur && self.lastManualInput) {
          if (self.computedStart) {
            if (self.computedStart.isAfter(self.lastManualInput)) {
              self.internalDate = self.computedStart.clone();
              self.lastManualInput = null;
              self.$emit("input", self.internalDate);
            }
          }
          if (self.computedEnd) {
            if (self.computedEnd.isBefore(self.lastManualInput)) {
              self.internalDate = self.computedEnd.clone();
              self.lastManualInput = null;
              self.$emit("input", self.internalDate);
            }
          }
        } else if (!self.correctOnBlur && self.lastManualInput) {
          self.internalDate = self.lastManualInput.clone();
          self.lastManualInput = null;
          self.$emit("input", self.internalDate);
        }
        self.correctOnBlur = false;
      }, 250);
    },
    handleManualInput(value) {
      let manualDate = moment(value);
      if (manualDate.isValid()) {
        this.lastManualInput = manualDate.clone();
        // check if date is before allowed start
        if (this.computedStart) {
          if (this.computedStart.isAfter(manualDate)) {
            this.correctOnBlur = true;
            return;
          }
        }
        if (this.computedEnd) {
          if (this.computedEnd.isBefore(manualDate)) {
            this.correctOnBlur = true;
            return;
          }
        }
        this.correctOnBlur = false;
      } else {
        // set date to start or current date
        this.lastManualInput = this.start
          ? this.start.clone()
          : this.currentDate.clone();
      }
    },
    open() {
      this.show = true;
      let self = this;
      let ref;
      if (this.selectingDay) {
        ref = "daypicker";
      } else if (this.selectingMonth) {
        ref = "monthpicker";
      } else if (this.selectingYear) {
        ref = "yearpicker";
      }

      this.$nextTick(() => {
        self.calculatedTop = self.calculateTop(ref);
        self.$forceUpdate();
      });
    },
    calculateTop(ref) {
      const BUFFER = 20;
      if (this.$refs[ref]) {
        let totalHeightNeeded = this.$refs[ref].$el.getBoundingClientRect()
          .bottom;
        if (totalHeightNeeded > window.innerHeight) {
          return `-${this.$refs[ref].$el.scrollHeight - BUFFER}px`;
        }
        return "inherit";
      }
      return "inherit";
    },
    validateStartEnd() {
      if (this.computedStart && this.computedEnd) {
        if (this.computedEnd.isBefore(this.computedStart)) {
          console.error(
            `Datepicker ID: ${
              this.name
            } was passed an end date that comes before the passed start date. Start Date: ${this.computedStart.format(
              "YYYY-MM-DD"
            )}, End date: ${this.computedEnd.format("YYYY-MM-DD")}`
          );
        }
      }
    },
    testDisabled(d) {
      for (disabled in this.disabledDates) {
        if (moment(disabled).isSame(d)) {
          return true;
        }
      }
      if (this.computedStart) {
        if (d.isBefore(this.computedStart)) {
          return true;
        }
      }
      if (this.computedEnd) {
        if (d.isAfter(this.computedEnd)) {
          return true;
        }
      }
      return false;
    },
    close() {
      this.show = false;
      this.selectingDay = true;
      this.selectingMonth = false;
      this.selectingYear = false;
    },
    handleClick(event) {
      if (
        event.target.getAttribute("data-datepicker") != this.name &&
        !event.target.closestDatePicker(this.name)
      ) {
        this.close();
      }
    },
    updateShownValues() {
      this.shownMonth = this.formatMonth(this.getsDayOfMonth(this.cursorDate));
      this.shownYear = {
        year: this.cursorDate.year(),
        months: [
          [
            {
              display: "JAN",
              value: 0,
            },
            {
              display: "FEB",
              value: 1,
            },
            {
              display: "MAR",
              value: 2,
            },
            {
              display: "APR",
              value: 3,
            },
          ],
          [
            {
              display: "MAY",
              value: 4,
            },
            {
              display: "JUN",
              value: 5,
            },
            {
              display: "JUL",
              value: 6,
            },
            {
              display: "AUG",
              value: 7,
            },
          ],
          [
            {
              display: "SEP",
              value: 8,
            },
            {
              display: "OCT",
              value: 9,
            },
            {
              display: "NOV",
              value: 10,
            },
            {
              display: "DEC",
              value: 11,
            },
          ],
        ],
      };
      let rangeStart = Math.floor(this.cursorDate.year() / 10) * 10;
      let rangeEnd = Math.round(this.cursorDate.year() / 10) * 10;
      if (rangeStart == rangeEnd) {
        rangeEnd += 10;
      }
      let years = [[], [], [], []];
      let buffer = 0;
      let YEARS_PER_ROW = 3;
      for (let year = rangeStart; year <= rangeEnd; year++) {
        years[parseInt(buffer++ / YEARS_PER_ROW)].push(year);
      }
      this.shownYears = {
        range: `${rangeStart} - ${rangeEnd}`,
        years,
      };
    },
    incrementCursorDate(amount, duration) {
      this.cursorDate.add(amount, duration);
      this.updateShownValues();
    },
    decrementCursorDate(amount, duration) {
      this.cursorDate.subtract(amount, duration);
      this.updateShownValues();
    },
    setInternalDate(day) {
      if (day == null) {
        this.internalDate = null;
      } else {
        this.internalDate = day.clone();
      }
      this.$emit("input", this.internalDate);
      this.close();
    },
    setCursorDate(value, time) {
      if (time == "day") {
        this.cursorDate = value.clone();
      } else if (time == "month") {
        this.cursorDate.month(value);
      } else if (time == "year") {
        this.cursorDate.year(value);
      }
      this.updateShownValues();
      this.$forceUpdate();
    },
    toggleYear() {
      this.selectingDay = false;
      this.selectingMonth = false;
      this.selectingYear = true;
    },
    toggleMonth() {
      this.selectingDay = false;
      this.selectingMonth = true;
      this.selectingYear = false;
    },
    toggleDay() {
      this.selectingDay = true;
      this.selectingMonth = false;
      this.selectingYear = false;
    },
    formatMonth(days) {
      if (days[0].day() != 0) {
        let missedDate = days[0].clone().subtract(1, "d");
        while (missedDate.day() != SATURDAY) {
          days.unshift(missedDate.clone());
          missedDate.subtract(1, "d");
        }
      }

      if (days[days.length - 1].day() != SATURDAY) {
        let missedDate = days[days.length - 1].clone().add(1, "d");
        while (missedDate.day() != SUNDAY) {
          days.push(missedDate.clone());
          missedDate.add(1, "d");
        }
      }
      let formattedMonth = [];
      let week = [];
      for (let day of days) {
        if (day.day() == SATURDAY) {
          week.push(day);
          formattedMonth.push(week.slice());
          week = [];
        } else {
          week.push(day);
        }
      }
      return {
        month: this.cursorDate.format("MMMM YYYY"),
        dates: formattedMonth.slice(),
      };
    },
    getsDayOfMonth(momentDate) {
      let daysBehind = [];
      let daysAhead = [];
      let previousDay = momentDate.clone().subtract(1, "d");
      while (previousDay.month() == momentDate.month()) {
        daysBehind.push(previousDay.clone());
        previousDay.subtract(1, "d");
      }
      daysBehind = daysBehind.reverse();
      let nextDay = momentDate.clone().add(1, "d");
      while (nextDay.month() == momentDate.month()) {
        daysAhead.push(nextDay.clone());
        nextDay.add(1, "d");
      }
      return [...daysBehind, momentDate, ...daysAhead];
    },
  },
};
export default DatePicker;
</script>

<style>
.yearpicker {
  height: 238px;
}
.yearpicker__table {
  height: 206px;
}
.monthpicker {
  height: 238px;
}
.monthpicker__table {
  height: 206px;
}
input::-webkit-calendar-picker-indicator {
  display: none;
}
input[type="date"]::-webkit-input-placeholder {
  visibility: hidden !important;
}
input[type="date"]::-webkit-outer-spin-button,
input[type="date"]::-webkit-inner-spin-button {
  -webkit-appearance: none;
  margin: 0;
}
</style>
