module.exports = {
  env: {
    browser: true,
    es6: true,
    node: true,
  },
  extends: [
    'airbnb',
  ],
  globals: {
    Atomics: 'readonly',
    SharedArrayBuffer: 'readonly',
  },
  parserOptions: {
    ecmaFeatures: {
      jsx: true,
    },
    ecmaVersion: 2018,
    sourceType: 'module',
  },
  plugins: [
    'react',
  ],
  rules: {
    'semi': ['error', 'never'],
    indent: [
      'error',
      4,
      {
        SwitchCase: 1
      }
    ],
    'default-case': 0,
    'arrow-parens': ['error', 'as-needed'],
    'max-statements-per-line': ['error', { max: 1 }],
    'max-classes-per-file': 0,
    'no-await-in-loop': 0,
    'no-restricted-syntax': 0,
    'curly': ['error', 'multi-line', 'consistent'],
    'no-param-reassign': 0
  }
}
