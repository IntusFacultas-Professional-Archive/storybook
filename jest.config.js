module.exports = {
  transformIgnorePatterns: [
    '/node_modules/(?!(@storybook/.*\\.vue$))',
    // '/node_modules/cytoscape/dist/*.cjs',
  ],
  preset: '@vue/cli-plugin-unit-jest',
  collectCoverage: true,
  setupFilesAfterEnv: ['<rootDir>/setupTests.js'],
  coveragePathIgnorePatterns: [
    'node_modules', // these are ignored because we don't test dependencies
    '.*Polyfill(s)?.js', // these are ignored because these are official polyfills.
    '.*/icons/.*', // these are ignored because these are Vue wrappers on SVGs with no logic
    'Styled.*.js', // these are ignored because these are styled components with no logic to test, logic is in .vue
    // this is ignored because we can't test mixins alone, and we do test the logic in consuming components
    'src/components/mixins.js',
  ],
  moduleNameMapper: {
    '^@Components/(.*)$': '<rootDir>/src/components/$1',
    '^@App/(.*)$': '<rootDir>/src/$1',
  },
  moduleDirectories: [
    'node_modules',
    'src',
  ],
  transform: {
    '^.+\\.(mjs|jsx)$': 'babel-jest',
    // '/node_modules/cytoscape/src/*.js': 'babel-jest',
  },
  testMatch: [
    '<rootDir>/tests/unit/*.spec.js',
    '<rootDir>/tests/unit/*.spec.mjs',
  ],
};
