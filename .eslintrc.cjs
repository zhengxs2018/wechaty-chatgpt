// @ts-check

/**
 * @type {import('eslint').Linter.Config}
 */
const userConfig = {
  root: true,
  env: {
    node: true,
    jest: true,
  },
  ignorePatterns: ['.eslintrc.js', 'jest.config.js'],
  parser: '@typescript-eslint/parser',
  parserOptions: {
    sourceType: 'module',
  },
  plugins: ['unicorn', 'tsdoc'],
  extends: [
    'plugin:import/recommended',
    'plugin:import/typescript',
    'plugin:@typescript-eslint/recommended',
    'plugin:prettier/recommended',
  ],
  rules: {
    '@typescript-eslint/no-explicit-any': 'off',
    '@typescript-eslint/no-non-null-assertion': 'off',
    'no-console': process.env.NODE_ENV === 'production' ? 'warn' : 'off',
    'no-debugger': process.env.NODE_ENV === 'production' ? 'warn' : 'off',
    'prettier/prettier': 'error',
    'unicorn/filename-case': [
      'error',
      {
        case: 'snakeCase',
        ignore: ['\\.js$', '\\.d.ts$'],
      },
    ],
    // 'import/no-extraneous-dependencies': [
    //   'error',
    //   { devDependencies: ['src/**/*.spec.mts'] },
    // ],
    'import/no-extraneous-dependencies': 'off'
  },
  settings: {
    'import/resolver': {
      typescript: true,
      node: true,
    },
  },
}

module.exports = userConfig
