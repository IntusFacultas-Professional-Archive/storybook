# VueMe

## Type of Component

Vue Component - https://v1.vuejs.org/guide/components.html

## Installation

```bash
npm install --save @IntusFacultas/vue-me@latest
```

## Purpose

Provides a Vue dialog component with configurable styling and inset forms.

## Usage

```html
<vue-me :parent-instance="this"></vue-me>
```

The initial <IntusFacultas-dialog> element sets up a function in the Vue app passed as the `parentInstance` called `$alert`. This is how you create alerts in IntusFacultas dialog. You can pass it a number of options:

```javascript
import VueMe from "@IntusFacultas/vue-me";
methods: {
    callAlert: function() {
        var self = this;
        /**
         * @function $alert
         * Creates a Dialog and shows it to the user
         * @param {Object} options, options to customize the dialog
         */
        self.$alert({
            // Sets the flavor of the dialog, use IntusFacultas Theme flavors
            // Default: ""
            flavor: "Primary",

            // Sets the min-width of the dialog. Uses px measurements
            // Default: 360
            width: 360,

            // Sets the title of the dialog
            // Default: "Alert"
            title: "Title",

            // Rendered as inline html next to title
            // Default: ""
            icon: '<i class="fa fa-info"></i>',

            // Rendered as html in dialog body (do not use for forms, v-model wont work)
            // Default: ""
            content: "<span>Content</span>",

            // Allows background dismiss
            // Default: true
            backgroundDismiss: false,

            // Buttons - Array of Objects
            // Controls: the buttons that are displayed at the bottom.
            buttons: [
            {
                // Text - String
                // Controls - The button text
                text: "Close",

                // Flavor - String
                // Options: Flavors in Design System
                flavor: "Primary",

                // Action - Function
                // The function to be called when the button is clicked. Takes one argument which are the fieldValues data
                // If the function returns false, the dialog will not be closed, else the dialog will be closed on click
                // Default: function(data) {}
                action: function(data) {
                if (!data.name) {
                    self.$alert({
                    title: "Error",
                    type: "Danger",
                    content: "Please provide a name",
                    buttons: [{ text: "Ok" }]
                    });
                    return false;
                }
                self.$alert({
                    title: "Hello",
                    type: "Success",
                    content: "Hello " + data.name,
                    buttons: [{ text: "Hello" }]
                });
                },

                // ID - String or Integer
                // Used for referencing buttons. This is important for autoclose
                // Default: UID assigned at time of creation
                id: "CloseButton"
            }
            ],

            // Fields - Array of Objects
            // Controls: The form fields rendered in the dialog
            // Default: [],
            fields: [
            {
                // Label - String
                // Controls the text for the label
                // Default: "Label"
                label: "Enter your name",

                // Type - String
                // Controls: the type of the input, must be valid type
                // Default: "text"
                type: "text",

                // id - String
                // Used to bind the value to fieldValues in v-model, doing v-model="fieldValues[field.id]"
                // Default: label + "-" + fieldType
                id: "name"
            }
            ],

            // Autoclose - String
            // Format must be "idOfButton|TimeInMilliseconds"
            // Default: disabled
            autoClose: "CloseButton|10000"
        });
    }
},

```

## Configuration

<table>
    <thead>
        <tr>
            <th>Prop Name</th>
            <th>Type</th>
            <th>Default</th>
        </tr>
    </thead>
    <tbody>
        <tr>
            <td>parentInstance</td>
            <td>`Object`</td>
            <td>Pass the parent Vue instance by using the `this` keyword so that VueMe can bind to your parent Vue component. Without this, you won't be able to call dialogs.</td>
        </tr>
    </tbody>
</table>

## Events

When a button is pressed, all field values for any inputs you've requested will be passed as one argument in dict format back to the callback function you have provided to the buttons.
