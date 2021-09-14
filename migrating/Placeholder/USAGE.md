# Placeholder

## Type of Component

Vue Component - https://v1.vuejs.org/guide/components.html

## Installation

```bash
npm install @IntusFacultas/placeholder@latest --save
```

## Purpose

This provides two Facebook React style skeleton website components for displaying areas waiting for data to load.

## Usage

```html
<placeholder :height="height"></placeholder>
<placeholder-picture :height="height" :width="width"></placeholder-picture>
```

```javascript
import {Placeholder, PlaceholderPicture} from "@IntusFacultas/placeholder"
data: {
  height: "100px",
  width: "100px"
}
```

The placeholder component will expand to the full width of the parent container, and will automatically populate in paragraphs if the paragraph is set to true.

For paragraphs to display, the height must be at least 170px.

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
        <tr>
            <td>height</td>
            <td>`String`</td>
            <td>`"50px"`</td>
            <td>Controls the height of the placeholder</td>
        </tr>
        <tr>
            <td>width</td>
            <td>`String`</td>
            <td>`"50px"`</td>
            <td>Controls the width of the placeholder</td>
        </tr>
        <tr>
            <td>Paragraphs</td>
            <td>`Boolean`</td>
            <td>`true`</td>
            <td>When set to true, paragraphs will be included instead of just lines.<br><b>This does not affect the PlaceholderPicture component</b></td>
        </tr>
    </tbody>
</table>
