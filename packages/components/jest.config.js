/** @type {import('ts-jest').JestConfigWithTsJest} */
module.exports = {
  ...require('../../jest.config.js'),
  testEnvironment: 'jest-environment-jsdom',
  setupFilesAfterEnv: ['<rootDir>/jest.setup.ts'],
}
