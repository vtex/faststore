module.exports = {
  extends: ['vtex'],
  plugins: ['react-hooks', 'jest-dom', 'testing-library'],
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
        // ui is browser-only
        'packages/ui/**/*',
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
      env: {
        node: true,
        commonjs: true,
        browser: true,
        jest: true,
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
