# IFC UI Component Library

# Setup Instructions

1. Clone project
2. `npm install`
3. `npm install vue` This is necessary because Vue is a peer dependency and npm doesn't install peer dependencies by default
4. In another terminal window: `npm run test:generate-output`
4. In main terminal window: `npm run storybook`

# Build Instructions

In order to preserve templates in componenets, a script in `scripts` called `build.sh`
first moves all code in `src/` to a directory called `build`. It will then iterate through every folder and build each component into a transpiled `.js` file. There are a few requirements that you as a developer have to meet in order for the script to find and transpile your components correctly.

1. Your `.vue` should export both an `export const` and an `export default` value.
2. Your `.vue` must be eslint compliant.
3. Any `.vue` imports that you use must have the file extension `.vue` in the import string.
4. Any `.js` imports that you use must have the file extension `.js` in the import string.
5. Your `.vue` files must match the name of the component that is `export default`.
6. When you are going to expose your component for export by exporting it from `index.js` you need to target the eventual location of the build. e.g.

If you would normally do:

```js
export { IFCMyComponent } from 'src/components/MyComponent/IFCMyComponent.vue';
```

You instead will do

```js
export { IFCMyComponent } from './build/components/MyComponent/IFCMyComponent.esm.js';
```

**NOTE**: If you're having build errors where imports are failing to find components, it's almost certainly because
you messed up steps **3** and **4**.