import commonjs from '@rollup/plugin-commonjs';
import babel from 'rollup-plugin-babel';
import { terser } from 'rollup-plugin-terser';
import replace from '@rollup/plugin-replace';
import alias from '@rollup/plugin-alias';
import VuePlugin from 'rollup-plugin-vue';
import svg from 'rollup-plugin-vue-inline-svg';
import renameExtensions from '@betit/rollup-plugin-rename-extensions';

const npmConfig = {
  input: 'index.esm.js',
  output: {
    name: 'component-library',
    sourcemap: true,
  },
  external: [
    'vue',
    'vue-styled-components',
    'vue-svg-pan-zoom',
    'resize-observer-polyfill',
  ],
  plugins: [
    alias({
      vue: 'vue/dist/vue.esm.js',
    }),
    svg(),
    VuePlugin(),
    replace({
      'process.env.NODE_ENV': JSON.stringify('production'),
      'process.env.VUE_ENV': JSON.stringify('compiler'),
      "'vue'": "'vue/dist/vue.esm.js'",
      delimiters: ['', ''],
    }),
    commonjs(),
    babel({
      exclude: 'node_modules/@babel/**',
    }),
    renameExtensions({
      include: ['**/*.esm.js'],
      mappings: {
        '.esm.js': '.js',
      },
    }),
    terser(),
  ],
};

// ESM config
const esmConfig = { ...npmConfig };
esmConfig.output = {
  ...npmConfig.output,
  file: 'dist/component-library.esm.js',
  format: 'esm',
  preserveModules: true,
};

// ESM prod config
const esmProdConfig = { ...esmConfig };
esmProdConfig.output = {
  ...esmConfig.output,
  file: 'dist/component-library.esm.min.js',
  sourcemap: false,
  preserveModules: true,
};
esmProdConfig.plugins = [...esmConfig.plugins, terser()];

const configurations = [];
configurations.push(esmConfig);

export default configurations;
