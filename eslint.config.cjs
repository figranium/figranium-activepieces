const js = require('@eslint/js');
const parser = require('@typescript-eslint/parser');

module.exports = [
  {
    files: ['src/**/*.ts'],
    languageOptions: {
      parser,
      parserOptions: { ecmaVersion: 'latest', sourceType: 'commonjs' },
    },
    rules: {
      ...js.configs.recommended.rules,
      // Core ESLint rules do not understand TypeScript's type-only bindings.
      'no-undef': 'off',
      'no-unused-vars': 'off',
    },
  },
];
