module.exports = {
  env: {
    node: true,
  },

  extends: [
    'plugin:vue/essential',
    'airbnb-base',
  ],

  parserOptions: {
    parser: 'babel-eslint',
    ecmaVersion: 12,
    sourceType: 'module',
  },

  plugins: [
    'vue',
  ],

  rules: {
    'max-len': ['warn', 120, 2],
    'vue/experimental-script-setup-vars': ['off'],
    'import/extensions': ['error', 'ignorePackages', {
      js: 'always',
      vue: 'always',
    }],
  },

  settings: {
    'import/resolver': {
      alias: {
        map: [
          ['@Components', './src/components'],
          ['@Assets', './src/assets'],
          ['@Views', './src/views'],
          ['@App', './src'],
        ],
        extensions: ['.ts', '.js', '.vue', '.json', '.svg'],
      },
    },
  },

  overrides: [
    {
      files: [
        '**/__tests__/*.{j,t}s?(x)',
        '**/tests/unit/**/*.spec.{j,t}s?(x)',
      ],
      env: {
        jest: true,
      },
    },
  ],
};
