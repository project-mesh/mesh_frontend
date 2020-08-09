const isProd = process.env.NODE_ENV === 'production'

module.exports = {
  root: true,
  env: {
    node: true,
  },
  extends: [
    'plugin:vue/essential',
    'eslint:recommended',
    'plugin:vue/strongly-recommended',
    '@vue/prettier',
  ],
  parserOptions: {
    parser: 'babel-eslint',
  },
  rules: {
    'no-console': 'warn',
    'no-debugger': isProd ? 'warn' : 'off',
    'prettier/prettier': 'off',
    'vue/eqeqeq': ['error', 'smart'],
    'vue/no-unused-components': 1,
    'no-unused-vars': isProd ? 'error' : 'warn',
  },
  overrides: [
    {
      files: ['**/__tests__/*.{j,t}s?(x)', '**/tests/unit/**/*.spec.{j,t}s?(x)'],
      env: {
        jest: true,
      },
    },
  ],
}
