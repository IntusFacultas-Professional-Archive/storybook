/* eslint-disable import/no-extraneous-dependencies */
import path from 'path';
import commonjs from '@rollup/plugin-commonjs';
import babel from 'rollup-plugin-babel';
import { terser } from 'rollup-plugin-terser';
import replace from '@rollup/plugin-replace';
import alias from '@rollup/plugin-alias';
import VuePlugin from 'rollup-plugin-vue';
import svg from 'rollup-plugin-vue-inline-svg';
import fs from 'fs';
import renameExtensions from '@betit/rollup-plugin-rename-extensions';
import inject from '@rollup/plugin-inject';

/**
 * To future maintainers:
 *
 * Look, I know this is terrible. I didn't want this either. But the previous 4 rollup configurations, including
 * automatically configured ones from vue-sfc-rollup, as well as rollup configurations based on various well known
 * libraries didn't work worth a damn. This is the only way I can make Rollup stop ripping the damn templates out
 * of components.
 *
 * So I'm sorry in advance if you have to touch this.
 *
 * As an explanation of what's going on here:
 *
 * Rollup is tearing out the template out of Vue SFCs that are imported from other files. So we can't just point
 * it at the entry.js and call it a day like we usually would. Instead I have to iterate through every single
 * Vue SFC and transpile them into functional components, giving this rollup file the SFC as the entry point itself
 * since it then behaves correctly and preserves the template as it converts the Vue SFC into plain JS. The iteration
 * is done by the build.sh file.
 *
 * However we have to treat all dependencies as external because if one of our components imports another of our
 * components, then those components get imported as part of the rollup bundle and their templates get ripped out.
 * This also causes code duplication, so we have to leave the dependencies as external and trust that those
 * will get transpiled too.
 *
 * But then the next problem arises. The way Rollup transpiles Vue SFCs into plain JavaScript is that it rips
 * the template out and converts it into the transpiled JSX engine code that Vue uses under the hood, then rips
 * out the <script></script> content and keeps the code in the transpiled file. Then it takes the template and
 * the script content and passes it to a functionalComponent factory, which returns a pure component with the
 * template and logic baked in. It then exports that as the default. **But** we run into a problem here, because
 * it also exports the <script></script> content component as a named export. That's an issue because that isn't
 * a functional component (it lacks the render function/template) so we then need to figure out what variable
 * the script content got assigned to (since the naming convention is that vue_script_$3 gets passed to the factory
 * and comes out as a pure component called vue_component_$3) so we can then replace the export { NonPureComponent} with
 * export { vue_component_$3 as NonPureComponent} to preserve the naming convention.
 */

/* eslint-disable no-extend-native, func-names */
if (!String.prototype.replaceAll) {
  String.prototype.replaceAll = function (str, newStr) {
    // If a regex pattern
    if (Object.prototype.toString.call(str).toLowerCase() === '[object regexp]') {
      return this.replace(str, newStr);
    }

    // If a string
    return this.replace(new RegExp(str, 'g'), newStr);
  };
}
/* eslint-enable no-extend-native */

const configureRelativePath = (pathString) => {
  // for some god-forsaken reason path.relative produces paths like ..../fileName which isn't valid.
  // so we need to convert those paths into ../../fileName
  let configuredPath = '';
  let dotsFound = 0;
  pathString.split('').forEach((character, index) => {
    configuredPath += character;
    if (character === '.') {
      dotsFound += 1;
    }
    if (dotsFound === 2) {
      dotsFound = 0;
      if (pathString[index + 1] !== '/') {
        configuredPath += '/';
      }
    }
  });
  return configuredPath || './';
};

export default (commandLineArgs) => {
  const projectRoot = path.resolve(__dirname, '..');
  const { module, path: modulePath } = commandLineArgs;
  const PrimaryComponentName = module.includes('.vue')
    ? module.substring(0, module.length - '.vue'.length)
    : module.substring(0, module.length - '.js'.length);
  const replaceImportString = `export { ${PrimaryComponentName}`;

  const file = fs.readFileSync(
    path.resolve(`${modulePath}/${module}`),
  )
    .toString()
    .split('\n');

  /**
   * If this is a .vue file we need to handle the incorrect named export issue
   */
  const functionalComponentAssignments = file.filter((entry) => entry && entry.includes(
    '/*#__PURE__*/',
  ));
  let transpiledPrimaryExportName = '__vue_component__';
  if (functionalComponentAssignments.length > 1) {
    const finalTranspiledAssignation = file.filter((entry) => entry && entry.includes(
      `= ${PrimaryComponentName}`,
    ));
    /**
     * Eslint will try to remove the trailing comma, but since we are doing array unpacking we need it there.
     */
    /* eslint-disable-next-line */
    const [lhs, ] = finalTranspiledAssignation.pop().split('=').map((side) => side.trim());
    const [, variable] = lhs.split(' ');
    transpiledPrimaryExportName = variable.replace('script', 'component');
  }
  const replaceConfig = {
    // '.js': '.esm',
    // '.vue': '.esm.js',
    'process.env.NODE_ENV': JSON.stringify('production'),
    'process.env.VUE_ENV': JSON.stringify('compiler'),
    '@Components': `${configureRelativePath(path.relative(modulePath, 'build/components'))}`,
    '@Views': `${configureRelativePath(path.relative(modulePath, 'src/views'))}`,
    '@App': `${configureRelativePath(path.relative(modulePath, 'build'))}`,
    '@Project': `${configureRelativePath(path.relative(modulePath, '.'))}`,
    '@Assets': `${configureRelativePath(path.relative(modulePath, 'src/assets'))}`,

    // If we use optimizeSSR, then server.mjs is imported but the logic breaks. So we instead manually replace
    // the browser version with the server and don't optimize for SSR to avoid a breaking bug.
    // if you're curious what the error is, its _vm._ssrClass is not a function
    'vue-runtime-helpers/dist/inject-style/browser.mjs': 'vue-runtime-helpers/dist/inject-style/server.mjs',
    delimiters: ['', ''],

  };

  if (module.includes('.vue')) {
    replaceConfig[replaceImportString] = `export { ${transpiledPrimaryExportName} as ${PrimaryComponentName}`;
  }

  const npmConfig = {
    input: `${modulePath}/${module}`,
    output: {
      name: `${module}`,
      sourcemap: true,
    },
    external(id) {
      // the entry module for some bizarre reason is passed in so we need to not mark the entry module as external
      if (id.includes(module)) {
        return false;
      }
      return !id.includes(module);
    },
    plugins: [
      // first we need to alias each of the import urls in order for files to be found correctly
      alias({
        entries: [
          {
            find: 'vue',
            replacement: 'vue/dist/vue.esm.js',
          },
          {
            find: '@Components',
            replacement: `${path.resolve(projectRoot, 'build/components')}`,
          },
          {
            find: '@Assets',
            replacement: `${path.resolve(projectRoot, 'src/assets')}`,
          },
          {
            find: '@Views',
            replacement: `${path.resolve(projectRoot, 'src/views')}`,
          },
          {
            find: '@App',
            replacement: `${path.resolve(projectRoot, 'build')}`,
          },
          {
            find: '@Project',
            replacement: `${path.resolve(projectRoot, '.')}`,
          },
        ],
      }),

      // we import svgs in a variety of places, so we need to support svg imports here.
      svg(),

      // make sure rollup can handle Vue SFCs
      VuePlugin({
        // template: { optimizeSSR: true },
      }),

      // in the final transpiled files, we want the shortcut import urls replaced with appropriate relative imports
      replace(replaceConfig),

      // transpile all the ES6 code into ES5 with polyfills
      commonjs(),
      babel(),

      // babel injects regeneratorRuntime in a variety of places and Nuxt doesn't know its a global import so
      // we inject the import statement at the top whenever we find regeneratorRuntime being used
      inject({
        regeneratorRuntime: ['regenerator-runtime/runtime', 'regeneratorRuntime'],
      }),

      /**
       *
       * however the inject plugin injects the import as such:
       *
       * import { regeneratorRuntime } from 'regenerator-runtime/runtime'
       *
       * but what we need is:
       *
       * import regeneratorRuntime from 'regenerator-runtime/runtime'
       *
       * so we replace the named import with the default import here.
       */
      replace({
        /* eslint-disable-next-line max-len */
        "import { regeneratorRuntime } from 'regenerator-runtime/runtime';": "import regeneratorRuntime from 'regenerator-runtime/runtime';",
      }),

      // After transforms, the import paths will be correct but we'll be targeting untranspiled files. So
      // convert .vue and .js into .esm.js
      renameExtensions({
        include: ['**/*.js', '**/*.vue'],
        mappings: {
          '.vue': '.esm.js',
          '.js': '.esm.js',
        },
      }),
    ],
  };

  // ESM config
  const esmConfig = { ...npmConfig };
  esmConfig.output = {
    ...npmConfig.output,
    file: path.resolve(projectRoot, `${modulePath}/${PrimaryComponentName}.js`),
    format: 'esm',
    preserveModules: true,
  };

  // ESM prod config
  const esmProdConfig = { ...esmConfig };
  esmProdConfig.output = {
    ...esmConfig.output,
    file: path.resolve(projectRoot, `${modulePath}/${PrimaryComponentName}.min.js`),
    sourcemap: false,
  };
  esmProdConfig.plugins = [...esmConfig.plugins, terser()];

  const configurations = [];
  configurations.push(esmConfig);
  return configurations;
};
