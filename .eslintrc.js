module.exports = {
  extends: ['vtex'],
  overrides: [
    {
      files: [
        // all tsx files
        '*.tsx',
        // gatsby config files (gatsby preset takes care of each variant)
        'gatsby-*.*',
        // generic components/hooks path
        'components/**/*',
        'hooks/**/*',
        // hooks
        'use*.ts',
        'hooks.ts',
        // themes
        'theme.ts',
        // store-ui is browser-only
        'packages/store-ui/**/*',
      ],
      extends: ['vtex-react/gatsby'],
    },
    // General overrides
    {
      files: '*',
      rules: {
        'no-console': [
          'error',
          {
            allow: ['warn', 'error', 'info', 'time', 'timeEnd', 'assert'],
          },
        ],
        '@typescript-eslint/no-explicit-any': 'off',
        '@typescript-eslint/no-non-null-assertion': 'off',
        'no-await-in-loop': 'off',
      },
    },
    // stories overrides
    {
      files: '*.stories.tsx',
      rules: {
        'no-console': 'off',
      },
    },
  ],
}
