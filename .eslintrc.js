module.exports = {
  extends: ['vtex'],
  overrides: [
    // Use vtex-react preset for .tsx files
    {
      files: '*.tsx',
      extends: ['vtex-react'],
    },
    // General overrides
    {
      files: '*',
      rules: {
        'no-console': [
          'error',
          {
            allow: ['warn', 'error', 'info', 'time', 'timeEnd'],
          },
        ],
        '@typescript-eslint/no-explicit-any': 'off',
        '@typescript-eslint/no-non-null-assertion': 'off',
        'no-await-in-loop': 'off',
      },
    },
    // Gatsby configuration files
    {
      files: ['gatsby-{ssr,browser,node,config}.{ts,tsx}'],
      rules: {
        'global-require': 'off',
        '@typescript-eslint/no-require-imports': 'off',
        '@typescript-eslint/no-var-requires': 'off',
      },
    },
  ],
}
