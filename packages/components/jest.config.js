const tsConfig = require('./tsconfig.json')

/** @type {import('ts-jest').JestConfigWithTsJest} */
module.exports = {
  ...require('../../jest.config.js'),
  transform: {
    '^.+\\.tsx?$': [
      'ts-jest',
      {
        ...tsConfig.compilerOptions,
        noUnusedLocals: false,
      },
    ],
  },
  testEnvironment: 'jest-environment-jsdom',
  setupFilesAfterEnv: ['<rootDir>/jest.setup.ts'],
}
