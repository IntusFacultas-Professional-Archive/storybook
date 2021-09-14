# VueToast

## Type of Component

Vue Component - https://v1.vuejs.org/guide/components.html

## Installation

```bash
npm install @IntusFacultas/vue-toast@latest --save
```

## Purpose

This provides a jQuery Toastr style alert system

# Usage

When instantiating your component, it is extremely important to bind a Vue instance to the parentInstance attribute, as that instance will be the instance that has the \$toast method bound to it, by which you will call toasts.

```html
<vue-toast
  :max-width="maxWidth"
  :delay="delay"
  :parent-instance="this"
></vue-toast>
```

```javascript
import VueToast from "@IntusFacultas/vue-toast";
data: {
    maxWidth: 300,
    delay: 5000,
    alertType: "success",
    alertText: "This is a toast alert",
},
methods: {
    fireToast: function() {
        this.$toast({
            type: this.alertType,
            text: this.alertText,
        })
    }
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
            <td>maxWidth</td>
            <td>`Number`</td>
            <td>`300`</td>
            <td>Sets the max width of the toasts</td>
        </tr>
        <tr>
            <td>delay</td>
            <td>`Number`</td>
            <td>`5000`</td>
            <td>Sets the delay in ms before the toasts disappear</td>
        </tr>
        <tr>
            <td>parentInstance</td>
            <td>`Object`</td>
            <td>`None`<b>REQUIRED</b></td>
            <td>Which Vue instance will receive the $toast method that can be passed an object containing the following options:<br><br>
            <pre>
                <code>
                    {
                        type: String, // options are: warning, success, info, danger
                        text: String (can be HTML, will be displayed)
                    }
                </code>
            </pre></td>
        </tr>
    </tbody>
</table>
