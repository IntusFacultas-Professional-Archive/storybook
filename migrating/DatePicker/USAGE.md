# DatePicker

## Type of Component

Vue Component - https://v1.vuejs.org/guide/components.html

## Installation

```bash
npm install @IntusFacultas/date-picker@latest --save
```

## Purpose

This provides a datepicker input with standardized styling across browsers, and shares some but not all features with the Eonasdan datetimepicker.

## Usage

When you are instantiating your component instance, make sure to bind a variable containing the options

```html
<date-picker
  :label="label"
  :debug="debug"
  :text-flavor="textFlavor"
  :name="name"
  :start="startDate"
  :end="endDate"
  v-model="date"
  :start="start"
  :end="end"
></date-picker>
```

```javascript
data: {
    label: "Select a date",
    debug: false,
    textFlavor: "Normal",
    name: "datepicker",
    startDate: "",
    endDate: "",
    date: "",
}
```

## Configuration

Various Vue Component Props have been exposed for customizing the behavior of the component.

Special note: camelCase props need to be converted to kebab-case when being set.

<table>
    <thead>
        <tr>
            <th>Prop Name</th>
            <th>Type</th>
            <th>Default</th>
            <th>Purpose</th>
        </tr>
    </thead>
    <tbody>
        <tr><td>`defaultNow`</td><td>`Boolean`</td><td>true</td><td>When set to true, the datepicker will have a default value of the current day</td></tr>
        <tr><td>`showClear`</td><td>`Boolean`</td><td>true</td><td>When set to true, the datepicker will have have a clear button</td></tr>
        <tr><td>`label`</td><td>`String`</td><td>`"Select a Date"`</td><td>Sets the label for the input</td></tr>
        <tr><td>`debug`</td><td>`Boolean`</td><td>`false`</td><td>Keeps the datepicker open if set to true</td></tr>
        <tr><td>`textFlavor`</td><td>`String`</td><td>`"Normal"`</td><td>Sets the text flavor of the label</td></tr>
        <tr><td>`name`</td><td>`String`</td><td><b>None. Required.</b></td><td>Required for detecting when to close the datepicker on click.</td></tr>
        <tr><td>`start`</td><td>`Date` or `DateString` or `Moment`</td><td>`null`</td><td>Sets the inclusive start of the range of allowed dates</td></tr>
        <tr><td>`end`</td><td>`Date` or `DateString` or `Moment`</td><td>`null`</td><td>Sets the inclusive end of the range of allowed dates</td></tr>
    </tbody>
</table>

## Events

<table>
    <thead>
        <tr>
            <th>Event</th>
            <th>Bind Attribute</th>
            <th>Payload</th>
            <th>Description</th>
        </tr>
    </thead>
    <tbody>
        <tr>
            <td>`input`</td>
            <td>`@input`</td>
            <td>Currently Selected Options</td>
            <td>Fired on selection</td>
        </tr>
    </tbody>
</table>
