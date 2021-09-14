# Tooltip

## Type of Component

Vue Component - https://v1.vuejs.org/guide/components.html

## Installation

```bash
npm install @IntusFacultas/tooltip@latest --save
```

## Purpose

This provides a collapsible and expandible tooltip on hover

# Usage

```html
<tooltip style="margin-top:14px" :flavor="flavor" :active-flavor="activeFlavor">
  <!-- html content here -->
</tooltip>
```

```javascript
import Tooltip from "@IntusFacultas/tooltip";
data: {
    flavor: "Primary",
    activeFlavor: "Success",
}
```

## Configuration

- Various Vue Component Props have been exposed for customizing the behavior of the component.
- The flavors are chosen from the AlertTheme in `@IntusFacultas/design-system`
- Special note: camelCase props need to be converted to kebab-case when being set.

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
            <td>flavor</td>
            <td>`String`</td>
            <td>`""`</td>
            <td>Sets the flavor of the tooltip when collapsed, and when expanded if activeFlavor is not set</td>
        </tr>
        <tr>
            <td>activeFlavor</td>
            <td>`String`</td>
            <td>`""`</td>
            <td>Sets the flavor of the tooltip when expanded. <strong>Optional.</strong></td>
        </tr>
    </tbody>
</table>
