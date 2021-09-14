const path = require('path');

module.exports = {
  "stories": [
    "../src/**/*.stories.mdx",
    "../src/**/*.stories.@(js|jsx|ts|tsx)"
  ],
  webpackFinal: async (config) => {
    config.resolve.alias = {
      ...config.resolve.alias,
      '@Components': path.resolve(__dirname, '../src/components'),
      '@Assets': path.resolve(__dirname, '../src/assets'),
      '@Views': path.resolve(__dirname, '../src/views'),
      '@App': path.resolve(__dirname, '../src'),
    }
    config.module.rules.push({
      test: /\.scss$/,
      use: [
        'vue-style-loader',
        'css-loader',
        'sass-loader'
      ],
    })
    config.resolve.extensions = [
      '.js', '.ts', '.vue', '.svg'
    ]
    return config;
  },

  "addons": [
    "@storybook/addon-links",
    "@storybook/addon-a11y",
    '@storybook/addon-jest',
    // "@storybook/addon-notes",
    "@storybook/addon-essentials"
  ]
}