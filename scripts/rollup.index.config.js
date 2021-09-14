/* eslint-disable import/no-extraneous-dependencies */
import path from 'path';
import commonjs from '@rollup/plugin-commonjs';
import babel from 'rollup-plugin-babel';
import replace from '@rollup/plugin-replace';
import alias from '@rollup/plugin-alias';
import VuePlugin from 'rollup-plugin-vue';
import svg from 'rollup-plugin-vue-inline-svg';

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

export default () => {
  const projectRoot = path.resolve(__dirname, '..');
  const replaceConfig = {
    build: '',
    delimiters: ['', ''],

  };

  const npmConfig = {
    input: `${projectRoot}/index.js`,
    output: {
      name: 'index',
      sourcemap: true,
    },
    external(id) {
      // the entry module for some bizarre reason is passed in so we need to not mark the entry module as external
      if (id.includes('index.js')) {
        return false;
      }
      return true;
    },
    plugins: [
      alias({
        entries: [
          {
            find: 'vue',
            replacement: 'vue/dist/vue.esm.js',
          },
        ],
      }),
      svg(),
      VuePlugin(),
      replace(replaceConfig),
      commonjs(),
      babel(),
      // After transforms...
    ],
  };

  // ESM config
  const esmConfig = { ...npmConfig };
  esmConfig.output = {
    ...npmConfig.output,
    file: path.resolve(projectRoot, 'build/index.js'),
    preserveModules: true,
  };
  const configurations = [];
  configurations.push(esmConfig);
  return configurations;
};
