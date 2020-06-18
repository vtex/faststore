module.exports = {
  extends: ['vtex'],
  env: {
    browser: true,
    es6: true,
    node: true,
  },
  overrides: [
    // Use vtex-react preset for .tsx files
    {
      files: '**/*.tsx',
      extends: ['vtex-react'],
      rules: {
        'react/jsx-pascal-case': 'off',
      },
    },
    // General overrides
    {
      files: ['*'],
      rules: {
        '@typescript-eslint/no-explicit-any': 'off',
        '@typescript-eslint/no-non-null-assertion': 'off',
        '@typescript-eslint/camelcase': 'off',
        '@typescript-eslint/explicit-module-boundary-types': 'off',
      },
    },
    // Override for .ts components only
    {
      files: ['packages/*/components/**/*'],
      rules: {
        'no-console': 'off',
      },
    },
    // Override for node related code
    {
      files: ['packages/gastby-source-*'],
      rules: {
        'no-console': 'off',
        'import/no-nodejs-modules': 'off',
        'global-require': 'off',
        '@typescript-eslint/no-require-imports': 'off',
        '@typescript-eslint/no-var-requires': 'off',
      },
    },
  ],
}
